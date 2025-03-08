import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { CourseModel } from '../../../models/course.model';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-course-card',
  imports: [MatCardModule, MatButtonModule, MatIconModule, RouterModule],
  templateUrl: './course-card.component.html',
  styleUrl: './course-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CourseCardComponent implements OnInit {
  @Input()
  public course : CourseModel;
  
  public link : string;

  private userService = inject(UserService);
  private router = inject(Router);

  ngOnInit(): void {
    this.link = `/courses/${this.course.id}`;
  }

  public enroll(): void {
    try {
      // Verify that the user is logged in
      if (!this.userService.isLoggedIn()) {
        this.router.navigateByUrl("login");
      }
      else { // Enroll the user in the course
        this.userService.enrollUser(this.course.id);
        this.router.navigateByUrl("profile");
      }
    }
    catch (err: any)
    {

    }
  }
}
