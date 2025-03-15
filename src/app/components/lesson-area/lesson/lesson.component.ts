import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Input, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltip, TooltipPosition } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { LessonInfoModel } from '../../../models/lessonInfo.model';
import { ProgressModel } from '../../../models/progress.model';
import { UserService } from '../../../services/user.service';
import { SnackbarService } from '../../../services/snackbar.service';
import { Roles } from '../../../utils/types';

@Component({
  selector: 'app-lesson',
  imports: [MatCardModule, MatIconModule, MatButtonModule, MatTooltip, CommonModule, MatChipsModule],
  templateUrl: './lesson.component.html',
  styleUrl: './lesson.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LessonComponent implements OnInit {
  @Input()
  public lesson: LessonInfoModel;

  @Input()
  public userProgress: ProgressModel[];

  @Input()
  public position: number;

  public isEnrolled = signal<boolean>(false);
  public isProfessor: boolean = false;
  public alreadyWatched = signal<boolean>(false);
  public toolTipPos: { value: TooltipPosition } = { value: 'above' };

  private userService = inject(UserService);
  private router = inject(Router);
  private snackbarService = inject(SnackbarService);

  public async ngOnInit(): Promise<void> {
    try {
      if (this.userService.isLoggedIn()) {
        this.isEnrolled.set(await this.userService.isEnrolled(this.lesson.courseId));
        this.alreadyWatched.set((this.userProgress).some(p => p.lessonId === this.lesson.id));
        this.isProfessor = this.userService.getUserRole() === Roles.Professor;
      }
    }
    catch (err: any) {
      this.snackbarService.showError(err.message);
    }
  }

  public async watchLesson(): Promise<void> {
    try {
      if (!this.isProfessor) {
        // Save user progress
        await this.userService.addProgress(this.lesson.id);
      }

      this.router.navigateByUrl("watch/" + this.lesson.id);
    }
    catch (err: any) {
      this.snackbarService.showError(err.message);
    }
  }
}
