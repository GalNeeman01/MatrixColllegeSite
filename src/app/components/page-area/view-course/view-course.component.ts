import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Input, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CourseModel } from '../../../models/course.model';
import { LessonInfoModel } from '../../../models/lessonInfo.model';
import { ProgressModel } from '../../../models/progress.model';
import { CourseService } from '../../../services/course.service';
import { LessonService } from '../../../services/lesson.service';
import { SnackbarService } from '../../../services/snackbar.service';
import { UserService } from '../../../services/user.service';
import { Roles } from '../../../utils/types';
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
    private activatedRoute = inject(ActivatedRoute);
    private lessonService = inject(LessonService);
    private userService = inject(UserService);
    private changeDetectorRef = inject(ChangeDetectorRef);
    private snackbarService = inject(SnackbarService);

    public courseModel: CourseModel;
    public lessons = signal<LessonInfoModel[]>([]);

    public id : string = "";

    public link = '/courses/' + this.id;
    public userProgress: ProgressModel[] = [];

    async ngOnInit(): Promise<void> {
      try {
        this.id = this.activatedRoute.snapshot.params['id'];
        this.courseModel = this.activatedRoute.snapshot.data['courseData'];

        // Fetch user progress
        if (this.userService.isLoggedIn() && this.userService.getUserRole() === Roles.Student)
            this.userProgress = await this.userService.getUserProgress();

        // Fetch lessons (no url)
        this.lessons.set(await this.lessonService.getLessonsInfoByCourseId(this.id));

        // Call change detection to render returned lessons
        this.changeDetectorRef.markForCheck();
      }
      catch (err: any)
      {
        this.snackbarService.showError(err.message);
      }
    }
}
