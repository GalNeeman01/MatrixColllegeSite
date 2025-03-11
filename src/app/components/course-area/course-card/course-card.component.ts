import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Input, OnInit, signal } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { CourseModel } from '../../../models/course.model';
import { SnackbarService } from '../../../services/snackbar.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-course-card',
  imports: [MatCardModule, MatButtonModule, MatIconModule, RouterModule, DatePipe, MatChipsModule, CommonModule, MatBadgeModule],
  templateUrl: './course-card.component.html',
  styleUrl: './course-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CourseCardComponent implements OnInit {
  @Input()
  public course : CourseModel;

  public enrolled = signal<boolean>(false);
  public badge : string;
  public link : string;
  
  private isNew: boolean;

  private snackbarService = inject(SnackbarService);
  private userService = inject(UserService);
  private router = inject(Router);

  async ngOnInit(): Promise<void> {
    try {
      this.link = `/courses/${this.course.id}`;

      // Check if the user is enrolled in the course
      if (this.userService.isLoggedIn()) {
        this.enrolled.set(this.userService.isEnrolled(this.course.id));
      }

      this.isNew = (new Date().getTime()) - (new Date(this.course.createdAt).getTime()) < (7 * 24 * 60 * 60 * 1000);

      if (this.isNew) {
        this.badge = "NEW";
      }
    }
    catch (err: any) {
      this.snackbarService.showError(err.message);
    }
  }

  public async enroll(): Promise<void> {
    try {
      // Verify that the user is logged in
      if (!this.userService.isLoggedIn()) {
        this.router.navigateByUrl("login");
      }
      else { // Enroll the user in the course
        await this.userService.enrollUser(this.course.id);
        this.snackbarService.showSuccess("Successfully enrolled for course.")
        this.router.navigateByUrl("profile");
      }
    }
    catch (err: any)
    {
        const errMessage = JSON.parse(err.error).errors;
        this.snackbarService.showError(errMessage);
    }
  }
}
