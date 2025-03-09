import { ChangeDetectionStrategy, Component, inject, Input, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { CourseModel } from '../../../models/course.model';
import { UserService } from '../../../services/user.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-course-card',
  imports: [MatCardModule, MatButtonModule, MatIconModule, RouterModule, DatePipe, MatChipsModule],
  templateUrl: './course-card.component.html',
  styleUrl: './course-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CourseCardComponent implements OnInit {
  @Input()
  public course : CourseModel;

  public enrolled = signal<boolean>(false);
  
  public link : string;

  private userService = inject(UserService);
  private router = inject(Router);

  async ngOnInit(): Promise<void> {
    this.link = `/courses/${this.course.id}`;

    // Check if the user is enrolled in the course
    if (this.userService.isLoggedIn()) {
      this.enrolled.set(this.userService.isEnrolled(this.course.id));
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
        this.router.navigateByUrl("profile");
      }
    }
    catch (err: any)
    {
        const errMessage = JSON.parse(err.error).errors;

        console.log(errMessage);
    }
  }
}
