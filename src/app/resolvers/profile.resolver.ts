import { inject, Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { SnackbarService } from '../services/snackbar.service';
import { UserService } from '../services/user.service';
import { CourseProgress, ProfileData, Roles } from '../utils/types';

@Injectable({
    providedIn: 'root'
})
export class ProfileResolver implements Resolve<ProfileData> {
    private userService = inject(UserService);
    private snackbarService = inject(SnackbarService);

    async resolve(): Promise<ProfileData> {
        try {
            if (this.userService.getUserRole() !== Roles.Student)
                return {courses: [], courseProgress: {}}; // Return empty data (other roles don't need (or have) this)

            const courses = await this.userService.getEnrolledCourses();
            const courseProgress: { [courseId: string]: CourseProgress } = {};
    
            for (const course of courses) {
                courseProgress[course.id] = await this.userService.getCourseProgress(course.id);
            }
    
            const data : ProfileData = {courses: courses, courseProgress: courseProgress};
    
            return data;
        }
        catch (err: any)
        {
            this.snackbarService.showError(err.message);
            return {courses: [], courseProgress: {}}; // Show an empty page (data wise) on error
        }
    }
}
