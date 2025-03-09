import { Component, inject, Input, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CourseModel } from '../../../models/course.model';
import { CourseService } from '../../../services/course.service';
import { CommonModule } from '@angular/common';
import { LessonComponent } from "../../lesson-area/lesson/lesson.component";
import { LessonService } from '../../../services/lesson.service';
import { LessonModel } from '../../../models/lesson.model';

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

    public courseModel: CourseModel;
    public lessons: LessonModel[];

    @Input()
    public id : string = "";
  
    public link = '/courses/' + this.id;
    async ngOnInit(): Promise<void> {
        this.id = this.activatedRoute.snapshot.params['id'];
        this.courseModel = await this.courseService.getCourseById(this.id);

        this.lessons = await this.lessonService.getLessonsByCourseId(this.id);
    }
}
