import { Component, inject, Input, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CourseModel } from '../../../models/course.model';
import { CourseService } from '../../../services/course.service';
import { CommonModule } from '@angular/common';
import { LessonComponent } from "../../lesson-area/lesson/lesson.component";
import { LessonService } from '../../../services/lesson.service';
import { LessonModel } from '../../../models/lesson.model';
import { UserService } from '../../../services/user.service';
import { LessonInfoModel } from '../../../models/lessonInfo.model';

@Component({
  selector: 'app-view-course',
  imports: [RouterModule, CommonModule, LessonComponent],
  templateUrl: './view-course.component.html',
  styleUrl: './view-course.component.css',
})
export class ViewCourseComponent implements OnInit {
    private activatedRoute = inject(ActivatedRoute);
    private courseService = inject(CourseService);
    private lessonService = inject(LessonService);
    private userService = inject(UserService);

    public courseModel: CourseModel;
    public lessons: LessonInfoModel[];

    @Input()
    public id : string = "";
  
    public link = '/courses/' + this.id;

    async ngOnInit(): Promise<void> {
      try {
        this.id = this.activatedRoute.snapshot.params['id'];
        this.courseModel = await this.courseService.getCourseById(this.id);

        // Fetch lessons (no url)
        this.lessons = await this.lessonService.getLessonsInfoByCourseId(this.id);
      }
      catch (err: any)
      {
        console.log(err.message);
      }
    }
}
