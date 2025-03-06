import { inject, Injectable } from '@angular/core';
import { CourseModel } from '../models/course.model';
import { environment } from '../../environments/environment';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private http = inject(HttpClient);

  public async getAllCourses() : Promise<CourseModel[]> {
    const courses$ = this.http.get<CourseModel[]>(environment.coursesUrl);
    const courses = await firstValueFrom(courses$);

    return courses; 
  }

  public async getCourseById(id: string) : Promise<CourseModel> {
    const course$ = this.http.get<CourseModel>(environment.coursesUrl + "/" + id);
    const course = await firstValueFrom(course$);

    return course;
  }
}
