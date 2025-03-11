import { HttpClient } from "@angular/common/http";
import { computed, effect, inject, Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { CredentialsModel } from "../models/credentials.model";
import { firstValueFrom, throwError } from "rxjs";
import { jwtDecode } from "jwt-decode";
import { UserModel } from "../models/user.model";
import { UserStore } from "../storage/user-store";
import { RegisterDto } from "../models/register.dto";
import { EnrollmentModel } from "../models/enrollment.model";
import { CourseModel } from "../models/course.model";
import { ProgressModel } from "../models/progress.model";
import { LessonService } from "./lesson.service";
import { CourseProgress } from "../utils/types";
import { EnrollmentStore } from "../storage/enrollments-store";
import { CourseService } from "./course.service";
import { ProgressStore } from "../storage/progress-store";

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private http = inject(HttpClient);
    private userStore = inject(UserStore);
    private enrollmentStore = inject(EnrollmentStore);
    private lessonService = inject(LessonService);
    private courseService = inject(CourseService);
    private progressStore = inject(ProgressStore);

    public constructor() { }

    // Check if the user is logged in and set the user store accordingly
    public async checkLoggedIn(): Promise<void>
    {
        if (this.userStore.user()) return; // No need to check

        const token = localStorage.getItem("token");
        if (token) {
            // Retrieve payload from token (local)
            const payload = jwtDecode<{ user: UserModel, exp: number }>(token);

            // Handle expired JWT token
            if (payload.exp * 1000 < Date.now()) {
                localStorage.removeItem("token");
                return;
            };

            const user = payload.user;
            this.userStore.initUser(user);
            const enrollments = await this.getUserEnrollments();
            this.enrollmentStore.initEnrollments(enrollments)
        }
    }

    public isLoggedIn(): boolean {
        return this.userStore.user() !== null;
    }

    // Register a new user with the given details
    public async register(registerDto: RegisterDto) {
        const token$ = this.http.post(environment.registerUrl, registerDto, {responseType: 'text'});
        const token = await firstValueFrom(token$);
        const payload = jwtDecode<{ user: UserModel }>(token);
        const user = payload.user;
        this.userStore.initUser(user);

        localStorage.setItem("token", token);
    }

    // Log the user in with the given credentials
    public async login(credentials: CredentialsModel): Promise<void> {
        const token$ = this.http.post(environment.loginUrl, credentials, {responseType: 'text'});
        const token = await firstValueFrom(token$);
        const payload = jwtDecode<{ user: UserModel }>(token);
        const user = payload.user;
        this.userStore.initUser(user);

        localStorage.setItem("token", token);
    }

    // Log the current user out
    public logout(): void {
        this.userStore.logoutUser();
        this.enrollmentStore.clearEnrollments();
        localStorage.removeItem("token");
    }

    // Get the username of the current user
    public getUsername() : string {
        return this.userStore.user().name;
    }

    public getEmail() : string {
        return this.userStore.user().email;
    }

    // Get the enrollments of the current user
    public async getUserEnrollments() : Promise<EnrollmentModel[]> {
        if (this.enrollmentStore.enrollments().length > 0)
            return this.enrollmentStore.enrollments();

        const enrollments$ = this.http.get<EnrollmentModel[]>(environment.enrollmentsUrl + this.userStore.user().id);
        const enrollments = await firstValueFrom(enrollments$);

        this.enrollmentStore.initEnrollments(enrollments);

        return enrollments;
    }

    // Get the courses the current user is enrolled in
    public async getEnrolledCourses() : Promise<CourseModel[]> {
        const enrollments = await this.getUserEnrollments();

        // Retrieve all courses
        let courses : CourseModel[] = await this.courseService.getAllCourses();

        // Filter for courses the user is enrolled in
        courses = courses.filter(c => enrollments.some(e => e.courseId === c.id));

        return courses;
    }

    public async getUserProgress() : Promise<ProgressModel[]> { 
        // Check if the progress is already loaded
        if (this.progressStore.progresses().length > 0)
            return this.progressStore.progresses();

        // load the progress from the database
        const progresses$ = this.http.get<ProgressModel[]>(environment.progressUrl + this.userStore.user().id);
        const progresses = await firstValueFrom(progresses$);

        this.progressStore.initProgresses(progresses);

        return progresses;
    }

    // Get the progress of the current user
    public async getCourseProgress(courseId: string) : Promise<CourseProgress> {
        // Retrieve user progress
        const userProgress = await this.getUserProgress();
        const lessons = await this.lessonService.getLessonsByCourseId(courseId);

        let lastWatched = new Date('1970-01-01');
        let completed = 0;

        const courseLessonIds = new Set(lessons.map(lesson => lesson.id));

        const completedLessonsSet = new Set<string>();
        // Get data for CourseProgress
        for (const progress of userProgress) {
            if (courseLessonIds.has(progress.lessonId) && !completedLessonsSet.has(progress.lessonId)) {
                completedLessonsSet.add(progress.lessonId); // Prevent duplicates
                completed++;

                if (new Date(progress.watchedAt) > lastWatched)
                    lastWatched = progress.watchedAt;
            }
        }

        // Progress to return
        const progress : CourseProgress = {
            completed: completed,
            total: lessons.length,
            lastWatched: lastWatched
        };

        return progress; 
    }

    // Create a new enrollment for the user
    public async enrollUser(courseId: string) : Promise<void> {
        const enrollment: EnrollmentModel = {id: undefined, userId: this.userStore.user().id, courseId: courseId, enrolledAt: new Date()};

        const enroll$ = this.http.post<EnrollmentModel>(environment.enrollUserUrl, enrollment);
        const dbEnrollment = await firstValueFrom(enroll$);

        this.enrollmentStore.addEnrollment(dbEnrollment);
    }

    // Remove an enrollment for the user
    public async unenrollUser(enrollmentId: string) : Promise<void> {
        const delete$ = this.http.delete(environment.enrollmentsUrl + enrollmentId);
        await firstValueFrom(delete$);

        // Update ProgressStore
        const courseId = this.enrollmentStore.enrollments().find(e => e.id === enrollmentId).courseId;
        const courseLessons = await this.lessonService.getLessonsInfoByCourseId(courseId);
        const newProgress = this.progressStore.progresses().filter(p => !courseLessons.some(l => l.id === p.lessonId));
        this.progressStore.initProgresses(newProgress);

        // Update EnrollmentStore
        this.enrollmentStore.deleteEnrollment(enrollmentId);
    }

    // Get the enrollment for a specific course
    public getEnrollmentForCourse(courseId: string) : EnrollmentModel {
        return this.enrollmentStore.enrollments().find(e => e.courseId === courseId);
    }

    // Check if the user is enrolled in a specific course
    public isEnrolled(courseId: string) : boolean {
        return this.getEnrollmentForCourse(courseId) !== undefined;
    }

    // Add progress
    public async addProgress(lessonId: string) : Promise<void> {
        const progress: ProgressModel = {id: undefined, userId: this.userStore.user().id, lessonId: lessonId, watchedAt: new Date()};

        const progress$ = this.http.post(environment.progressUrl, progress);
        await firstValueFrom(progress$);

        // Update ProgressStore
        this.progressStore.addProgress(progress);
    }
}
