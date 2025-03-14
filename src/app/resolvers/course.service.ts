import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { CourseModel } from '../models/course.model';
import { CourseService } from '../services/course.service';

@Injectable({
  providedIn: 'root'
})
export class CourseResolver implements Resolve<CourseModel> {
  private courseService = inject(CourseService);

  resolve(route: ActivatedRouteSnapshot) : Promise<CourseModel> {
    return this.courseService.getCourseById(route.paramMap.get('id'));
  }
}
