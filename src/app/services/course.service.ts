import { inject, Injectable } from '@angular/core';
import { CourseModel } from '../models/course.model';
import { environment } from '../../environments/environment';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CourseStore } from '../storage/course-store';
import { GUID } from '../utils/types';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private http = inject(HttpClient);
  private courseStore = inject(CourseStore);

  public async getAllCourses() : Promise<CourseModel[]> {
    if (this.courseStore.courses().length > 0)
      return this.courseStore.courses();

    const courses$ = this.http.get<CourseModel[]>(environment.coursesUrl);
    const courses = await firstValueFrom(courses$);

    // Save to signalStore
    this.courseStore.initCourses(courses);

    return courses; 
  }

  public async getCourseById(id: string) : Promise<CourseModel> {
    if (this.courseStore.courses().length > 0)
      return this.courseStore.courses().find(course => course.id === id);

    const course$ = this.http.get<CourseModel>(environment.coursesUrl + id);
    const course = await firstValueFrom(course$);

    return course;
  }

  public async getCourseByLessonId(lessonId: string) : Promise<CourseModel> {
    const course$ = this.http.get<CourseModel>(environment.courseByLessonUrl + lessonId);
    const course = await firstValueFrom(course$);

    return course;
  }

  public async updateCourse(course: CourseModel) : Promise<CourseModel> {
    const course$ = this.http.put<CourseModel>(environment.coursesUrl, course);
    const dbCourse = await firstValueFrom(course$);

    return dbCourse;
  }

  public async addCourse(course: CourseModel) : Promise<CourseModel> {
    const course$ = this.http.post<CourseModel>(environment.coursesUrl, course);
    const dbCourse = await firstValueFrom(course$);

    // Save to store
    this.courseStore.addCourse(dbCourse);

    return dbCourse;
  }

  public async deleteCourse(courseId: string) : Promise<void> {
    const result$ = this.http.delete(environment.coursesUrl + courseId);
    await firstValueFrom(result$);

    // Update store
    this.courseStore.deleteCourse(courseId);
  }
}
