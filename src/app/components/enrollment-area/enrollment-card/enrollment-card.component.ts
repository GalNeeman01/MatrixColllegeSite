import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Router, RouterModule } from '@angular/router';
import { CourseModel } from '../../../models/course.model';
import { SnackbarService } from '../../../services/snackbar.service';
import { UserService } from '../../../services/user.service';
import { CourseProgress } from '../../../utils/types';
import { ConfirmUnenrollComponent } from '../../dialogs/confirm-unenroll/confirm-unenroll.component';

@Component({
  selector: 'app-enrollment-card',
  imports: [MatCardModule, MatButtonModule, MatIconModule, RouterModule,
    MatProgressBarModule, CommonModule, MatChipsModule,
    MatDialogModule],
  templateUrl: './enrollment-card.component.html',
  styleUrl: './enrollment-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EnrollmentCardComponent implements OnInit, OnChanges {
  public progressPercent: number;

  @Input()
  public progress: CourseProgress; // Receive from parent component

  @Input()
  public course: CourseModel; // Receive from parent component

  @Output()
  public deleteClicked: EventEmitter<string> = new EventEmitter(); // Emit to parent component

  private userService = inject(UserService);
  private router = inject(Router);
  private snackbarService = inject(SnackbarService);
  private dialog = inject(MatDialog);


  public async ngOnInit(): Promise<void> {
    this.progressPercent = this.progress.total === 0 ? 0 : (this.progress.completed / this.progress.total) * 100;
  }

  public async unEnroll(): Promise<void> {
    try {
      const enrollment = await this.userService.getEnrollmentForCourse(this.course.id);
      await this.userService.unenrollUser(enrollment.id);
      this.snackbarService.showSuccess("Successfully unenrolled from course.");
      this.deleteClicked.emit(this.course.id);
    }
    catch (err: any) {
      const errMessage = JSON.parse(err.error).errors;
      this.snackbarService.showError(errMessage);
    }
  }

  public redirectToCourse(): void {
    this.router.navigateByUrl("courses/" + this.course.id);
  }

  public ngOnChanges(changes: SimpleChanges): void {
    // This fixes an issue that causes the progress bar to show 0% after a different enrollment is removed.
    this.progressPercent = this.progress.total === 0 ? 0 : (this.progress.completed / this.progress.total) * 100;
  }

  // Confirm un-enroll
  public openConfirmationDialog(): void {
    const dialogRef = this.dialog.open(ConfirmUnenrollComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result === true)
        this.unEnroll();
    });
  }
}
