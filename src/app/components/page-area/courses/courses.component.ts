import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CourseModel } from '../../../models/course.model';
import { CourseService } from '../../../services/course.service';
import { UserService } from '../../../services/user.service';
import { CourseCardComponent } from "../../course-area/course-card/course-card.component";
import { SnackbarService } from '../../../services/snackbar.service';
import { Roles } from '../../../utils/types';
import { CoursePageHeaderComponent } from "../../course-area/course-page-header/course-page-header.component";
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-courses',
  imports: [CourseCardComponent, CommonModule, CoursePageHeaderComponent],
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoursesComponent implements OnInit {
  public courses = signal<CourseModel[]>([]);
  
  private courseService = inject(CourseService);
  private userService = inject(UserService);
  private snackbarService = inject(SnackbarService);
  private route = inject(ActivatedRoute);

  public async ngOnInit(): Promise<void> {
    try {
      if (this.userService.isLoggedIn() && this.userService.getUserRole() === Roles.Student)
          await this.userService.getUserEnrollments(); // Initialize enrollments store

      this.courses.set(this.route.snapshot.data['coursesData']);
    }
    catch (err: any)
    {
      this.snackbarService.showError(err.message);
    }
  }

}
