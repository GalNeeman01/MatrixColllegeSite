import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { CourseModel } from '../models/course.model';
import { LessonInfoModel } from '../models/lessonInfo.model';
import { ProgressModel } from '../models/progress.model';
import { LessonService } from '../services/lesson.service';
import { SnackbarService } from '../services/snackbar.service';
import { UserService } from '../services/user.service';
import { Roles } from '../utils/types';
import { CourseService } from '../services/course.service';

export interface ViewCourseData {
    userProgress: ProgressModel[],
    lessons: LessonInfoModel[],
    course: CourseModel
}

@Injectable({
    providedIn: 'root'
})
export class ViewCourseResolver implements Resolve<ViewCourseData> {
    private userService = inject(UserService);
    private lessonService = inject(LessonService);
    private snackbarService = inject(SnackbarService);
    private courseService = inject(CourseService);

    async resolve(route: ActivatedRouteSnapshot): Promise<ViewCourseData> {
        try {
            const courseId = route.paramMap.get('id');
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
