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

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private http = inject(HttpClient);
    private userStore = inject(UserStore);
    private enrollmentStore = inject(EnrollmentStore);
    private lessonService = inject(LessonService);
    private courseService = inject(CourseService);

    public constructor() { }

    // Check if the user is logged in and set the user store accordingly
    public async checkLoggedIn(): Promise<void>
    {
        const token = localStorage.getItem("token");
        if (token) {
            const payload = jwtDecode<{ user: UserModel }>(token);
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

    // Get the progress of the current user
    public async getCourseProgress(courseId: string) : Promise<CourseProgress> {
        // Retrieve progress from DB
        const userProgress$ = this.http.get<ProgressModel[]>(environment.progressUrl + this.userStore.user().id);
        const userProgress = await firstValueFrom(userProgress$);

        // Retrieve course lessons
        const lessons = await this.lessonService.getLessonsByCourseId(courseId);
        const completed = userProgress.filter(p => lessons.some(l => l.id === p.lessonId)).length;

        const progress : CourseProgress = {
            completed: completed,
            total: lessons.length
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
}
