import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { CourseModel } from '../../../models/course.model';
import { SnackbarService } from '../../../services/snackbar.service';
import { UserService } from '../../../services/user.service';
import { CourseProgress, GUID, Roles } from '../../../utils/types';
import { EnrollmentCardComponent } from "../../enrollment-area/enrollment-card/enrollment-card.component";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  imports: [EnrollmentCardComponent, CommonModule, RouterLink],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserProfileComponent implements OnInit {
  private userService = inject(UserService);
  private snackbarService = inject(SnackbarService);

  public username: string;
  public isStudent : boolean;
  public isProfessor : boolean;
  public courseProgress: { [courseId: string]: CourseProgress } = {};
  public enrolledCourses = signal<CourseModel[]>([]);
  public unfinishedCourses = computed<CourseModel[]>(() => this.enrolledCourses().filter(course => this.courseProgress[course.id] && (this.courseProgress[course.id].completed < this.courseProgress[course.id].total || this.courseProgress[course.id].completed === 0)))
  public completedCourses = computed<CourseModel[]>(() => this.enrolledCourses().filter(course => this.courseProgress[course.id] && this.courseProgress[course.id].completed === this.courseProgress[course.id].total && this.courseProgress[course.id].total !== 0));

  public coursesLoaded: boolean = false;

  public async ngOnInit(): Promise<void> {
    try {
      this.isStudent = this.userService.getUserRole() === Roles.Student;
      this.isProfessor = this.userService.getUserRole() === Roles.Professor;
      this.username = this.userService.getUsername();

      // Student logic
      if (this.isStudent) {
        this.enrolledCourses.set(await this.userService.getEnrolledCourses()); // Retrieve enrolled courses

        await this.loadCourseProgress(); // Load progress into dictionary
        this.enrolledCourses.set(this.enrolledCourses().filter(course => this.completedCourses().indexOf(course) === -1));
      }

      // Professor logic
      if (this.isProfessor) {

      }
    }
    catch (err: any) {
      this.snackbarService.showError(err.message);
    }
  }

  public async loadCourseProgress(): Promise<void> {
    try {
      for (const course of this.enrolledCourses()) {
        this.courseProgress[course.id] = await this.userService.getCourseProgress(course.id);
      }
      this.coursesLoaded = true; // Flag for template
    }
    catch (err: any) {
      this.snackbarService.showError(err.message);
    }
  }

  public removeEnrollment(courseId: GUID) {
    this.enrolledCourses.set(this.enrolledCourses().filter(e => e.id != courseId));
  }
}
