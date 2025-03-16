import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CourseModel } from '../../../models/course.model';
import { LessonInfoModel } from '../../../models/lessonInfo.model';
import { ProgressModel } from '../../../models/progress.model';
import { ViewCourseData } from '../../../resolvers/view-course.resolver';
import { SnackbarService } from '../../../services/snackbar.service';
import { CoursePageHeaderComponent } from '../../course-area/course-page-header/course-page-header.component';
import { LessonComponent } from "../../lesson-area/lesson/lesson.component";

@Component({
  selector: 'app-view-course',
  imports: [RouterModule, CommonModule, LessonComponent, CoursePageHeaderComponent],
  templateUrl: './view-course.component.html',
  styleUrl: './view-course.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewCourseComponent implements OnInit {
  // DI's
    private activatedRoute = inject(ActivatedRoute);
    private snackbarService = inject(SnackbarService);

    // Public
    public courseModel: CourseModel;
    public lessons = signal<LessonInfoModel[]>([]);
    public id : string = "";
    public link = '/courses/' + this.id;
    public userProgress: ProgressModel[] = [];

    // Methods
    async ngOnInit(): Promise<void> {
      try {
        window.scrollTo(0, 0);
        const data : ViewCourseData = this.activatedRoute.snapshot.data['courseData'];

        // Apply data from resolver
        this.userProgress = data.userProgress;
        this.lessons.set(data.lessons);
        this.courseModel = data.course;
      }
      catch (err: any)
      {
        this.snackbarService.showError(err.message);
      }
    }
}
