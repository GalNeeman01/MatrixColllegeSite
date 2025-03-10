import { ChangeDetectionStrategy, Component, inject, Input, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltip, TooltipPosition } from '@angular/material/tooltip';
import { LessonInfoModel } from '../../../models/lessonInfo.model';
import { UserService } from '../../../services/user.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProgressModel } from '../../../models/progress.model';

@Component({
  selector: 'app-lesson',
  imports: [MatCardModule, MatIconModule, MatButtonModule, MatTooltip, CommonModule],
  templateUrl: './lesson.component.html',
  styleUrl: './lesson.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LessonComponent implements OnInit{
    @Input()
    public lesson: LessonInfoModel;

    @Input()
    public userProgress: ProgressModel[];

    public isEnrolled: boolean = false;
    public alreadyWatched = signal<boolean>(false);

    public position: { value: TooltipPosition } = { value: 'above' };

    private userService = inject(UserService);
    private router = inject(Router);

    public async ngOnInit(): Promise<void> {
      this.isEnrolled = this.userService.isEnrolled(this.lesson.courseId);
      this.alreadyWatched.set((this.userProgress).some(p => p.lessonId === this.lesson.id));
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
