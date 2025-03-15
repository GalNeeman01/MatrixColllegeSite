import { inject, Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { CourseModel } from '../models/course.model';
import { CourseService } from '../services/course.service';
import { SnackbarService } from '../services/snackbar.service';

@Injectable({
  providedIn: 'root'
})
export class CoursesResolver implements Resolve<CourseModel[]> {
  private courseService = inject(CourseService);
  private snackbarService = inject(SnackbarService);

  resolve() : Promise<CourseModel[]> {
    try {
      return this.courseService.getAllCourses();
    }
    catch (err: any)
    {
      this.snackbarService.showError(err.message);
      return undefined;
    }
  }
}
