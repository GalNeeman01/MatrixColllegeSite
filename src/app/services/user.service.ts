import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
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

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private http = inject(HttpClient);
    private userStore = inject(UserStore);
    private lessonService = inject(LessonService);

    public constructor() { }

    // Check if the user is logged in and set the user store accordingly
    public checkLoggedIn(): void
    {
        const token = localStorage.getItem("token");
        if (token) {
            const payload = jwtDecode<{ user: UserModel }>(token);
            const user = payload.user;
            this.userStore.initUser(user);
        }
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
        localStorage.removeItem("token");
    }

    // Get the username of the current user
    public getUsername() : string {
        return this.userStore.user().name;
    }

    // Get the enrollments of the current user
    private async getUserEnrollments() : Promise<EnrollmentModel[]> {
        const enrollments$ = this.http.get<EnrollmentModel[]>(environment.enrollmentsUrl + this.userStore.user().id);
        const enrollments = await firstValueFrom(enrollments$);
        
        return enrollments;
    }

    // Get the courses the current user is enrolled in
    public async getEnrolledCourses() : Promise<CourseModel[]> {
        const enrollments = await this.getUserEnrollments();

        const courses : CourseModel[] = [];

        // Retrieve all courses the user is enrolled in
        for (const enrollment of enrollments) {
            const course$ = this.http.get<CourseModel>(environment.coursesUrl + enrollment.courseId);
            const course = await firstValueFrom(course$);

            courses.push(course);
        }

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
}
