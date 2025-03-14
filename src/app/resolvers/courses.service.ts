import { inject, Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { CourseModel } from '../models/course.model';
import { CourseService } from '../services/course.service';

@Injectable({
  providedIn: 'root'
})
export class CoursesResolver implements Resolve<CourseModel[]> {
  private courseService = inject(CourseService);

  resolve() : Promise<CourseModel[]> {
    return this.courseService.getAllCourses();
  }
}
