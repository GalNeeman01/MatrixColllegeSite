import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Input, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CourseModel } from '../../../models/course.model';
import { LessonInfoModel } from '../../../models/lessonInfo.model';
import { ProgressModel } from '../../../models/progress.model';
import { CourseService } from '../../../services/course.service';
import { LessonService } from '../../../services/lesson.service';
import { UserService } from '../../../services/user.service';
import { LessonComponent } from "../../lesson-area/lesson/lesson.component";
import { SnackbarService } from '../../../services/snackbar.service';
import { Roles } from '../../../utils/types';

@Component({
  selector: 'app-view-course',
  imports: [RouterModule, CommonModule, LessonComponent],
  templateUrl: './view-course.component.html',
  styleUrl: './view-course.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewCourseComponent implements OnInit {
    private activatedRoute = inject(ActivatedRoute);
    private courseService = inject(CourseService);
    private lessonService = inject(LessonService);
    private userService = inject(UserService);
    private changeDetectorRef = inject(ChangeDetectorRef);
    private snackbarService = inject(SnackbarService);

    public courseModel: CourseModel;
    public lessons = signal<LessonInfoModel[]>([]);

    @Input()
    public id : string = "";

    public link = '/courses/' + this.id;
    public userProgress: ProgressModel[] = [];

    async ngOnInit(): Promise<void> {
      try {
        this.id = this.activatedRoute.snapshot.params['id'];
        this.courseModel = await this.courseService.getCourseById(this.id);

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
