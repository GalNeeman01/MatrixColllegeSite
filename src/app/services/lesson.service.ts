import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { LessonModel } from '../models/lesson.model';
import { environment } from '../../environments/environment';
import { firstValueFrom } from 'rxjs';
import { LessonInfoModel } from '../models/lessonInfo.model';

@Injectable({
  providedIn: 'root'
})
export class LessonService {
  private http = inject(HttpClient);

  public async getLessonsByCourseId(courseId: string) : Promise<LessonModel[]> {
    const lessons$ = this.http.get<LessonModel[]>(environment.courseLessonsUrl + courseId);
    const lessons = await firstValueFrom(lessons$);
    
    return lessons;
  }

  public async getLessonsInfoByCourseId(courseId: string) : Promise<LessonInfoModel[]> {
    const lessons$ = this.http.get<LessonInfoModel[]>(environment.courseLessonsInfoUrl + courseId);
    const lessons = await firstValueFrom(lessons$);
    
    return lessons;
  }

  public async getLessonById(lessonId: string) : Promise<LessonModel> { 
    const lesson$ = this.http.get<LessonModel>(environment.lessonsUrl + lessonId);
    const lesson = await firstValueFrom(lesson$);

    return lesson;
  }
}
