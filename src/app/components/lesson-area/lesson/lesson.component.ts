import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltip, TooltipPosition } from '@angular/material/tooltip';
import { LessonInfoModel } from '../../../models/lessonInfo.model';
import { UserService } from '../../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lesson',
  imports: [MatCardModule, MatIconModule, MatButtonModule, MatTooltip],
  templateUrl: './lesson.component.html',
  styleUrl: './lesson.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LessonComponent implements OnInit{
    @Input()
    public lesson: LessonInfoModel;

    public isEnrolled: boolean = false;

    public position: { value: TooltipPosition } = { value: 'above' };

    private userService = inject(UserService);
    private router = inject(Router);

    public ngOnInit(): void {
      this.isEnrolled = this.userService.isEnrolled(this.lesson.courseId);
    }

    public async watchLesson(): Promise<void> {
      try {
        // Save user progress
        await this.userService.addProgress(this.lesson.id);

        this.router.navigateByUrl("watch/" + this.lesson.id);
      }
      catch (err: any) {
        console.error(err);
      }
    }
}
