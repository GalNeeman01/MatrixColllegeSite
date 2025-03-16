import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { CourseModel } from '../models/course.model';
import { LessonInfoModel } from '../models/lessonInfo.model';
import { ProgressModel } from '../models/progress.model';
import { CourseService } from '../services/course.service';
import { LessonService } from '../services/lesson.service';
import { SnackbarService } from '../services/snackbar.service';
import { UserService } from '../services/user.service';
import { Roles } from '../utils/types';

export interface ViewCourseData {
    userProgress: ProgressModel[],
    lessons: LessonInfoModel[],
    course: CourseModel
}

@Injectable({
    providedIn: 'root'
})
export class ViewCourseResolver implements Resolve<ViewCourseData> {
    // DI's
    private userService = inject(UserService);
    private lessonService = inject(LessonService);
    private snackbarService = inject(SnackbarService);
    private courseService = inject(CourseService);
    private router = inject(Router);

    // Resolve
    async resolve(route: ActivatedRouteSnapshot): Promise<ViewCourseData> {
        // Fetch user progress, lessons and course
        try {
            const courseId = route.paramMap.get('id');
            let course: CourseModel;

            // Validate existence of course
            try {
                course = await this.courseService.getCourseById(courseId);
            } catch {
                this.snackbarService.showError("The course you were looking for does not exist");
                this.router.navigateByUrl("home");
                return undefined;
            }

            const data: ViewCourseData = { lessons: [], userProgress: [], course: undefined };

            // Fetch user progress
            if (this.userService.isLoggedIn() && this.userService.getUserRole() === Roles.Student)
                data.userProgress = await this.userService.getUserProgress();

            // Fetch lessons (no url)
            data.lessons = await this.lessonService.getLessonsInfoByCourseId(courseId);

            data.course = await this.courseService.getCourseById(courseId);

            return data;
        }
        catch (err: any) {
            this.snackbarService.showError(err.message);
            return undefined;
        }
    }
}
