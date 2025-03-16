import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { CourseModel } from '../models/course.model';
import { CourseService } from '../services/course.service';
import { SnackbarService } from '../services/snackbar.service';

@Injectable({
    providedIn: 'root'
})
export class EditCourseResolver implements Resolve<CourseModel> {
    // DI's
    private courseService = inject(CourseService);
    private snackbarService = inject(SnackbarService);

    // Resolve
    resolve(route: ActivatedRouteSnapshot): Promise<CourseModel> {
        try {
            // Fetch course by ID
            const id = route.paramMap.get('id');
            return this.courseService.getCourseById(id);
        }
        catch (err: any) {
            this.snackbarService.showError(err.message);
            return undefined;
        }
    }
}
