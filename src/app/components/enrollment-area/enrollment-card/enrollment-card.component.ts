import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Router, RouterModule } from '@angular/router';
import { CourseModel } from '../../../models/course.model';
import { UserService } from '../../../services/user.service';
import { CourseProgress } from '../../../utils/types';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-enrollment-card',
  imports: [MatCardModule, MatButtonModule, MatIconModule, RouterModule, MatProgressBarModule, CommonModule, MatDividerModule],
  templateUrl: './enrollment-card.component.html',
  styleUrl: './enrollment-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EnrollmentCardComponent implements OnInit {
  public progressPercent: number;

  @Input()
  public progress: CourseProgress; // Receive from parent component

  @Input()
  public course : CourseModel; // Receive from parent component

  @Output()
  public deleteClicked: EventEmitter<void> = new EventEmitter(); // Emit to parent component

  private userService = inject(UserService);
  private changeDetectorRef = inject(ChangeDetectorRef);
  private router = inject(Router);

  public async ngOnInit(): Promise<void> {
    try {
      this.progressPercent = (this.progress.completed / this.progress.total) * 100;
    }
    catch (err: any)
    {
      const errMessage = JSON.parse(err.error).errors;

      console.log(errMessage);
    }
  }

  public async unEnroll(): Promise<void> {
    try {
        const enrollmentId: string = this.userService.getEnrollmentForCourse(this.course.id).id;
        await this.userService.unenrollUser(enrollmentId);
        this.changeDetectorRef.markForCheck();
        this.deleteClicked.emit();
    }
    catch (err: any)
    {
      const errMessage = JSON.parse(err.error).errors;

      console.log(errMessage);
    }
  }

  public redirectToCourse(): void {
    this.router.navigateByUrl("courses/" + this.course.id);
  }
}
