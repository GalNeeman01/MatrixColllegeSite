import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { CourseModel } from '../../../models/course.model';
import { UserService } from '../../../services/user.service';
import { CourseProgress } from '../../../utils/types';
import { EnrollmentCardComponent } from "../../enrollment-area/enrollment-card/enrollment-card.component";

@Component({
  selector: 'app-user-profile',
  imports: [EnrollmentCardComponent, CommonModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css',
})
export class UserProfileComponent implements OnInit {
  private userService = inject(UserService);

  public username: string;
  public enrolledCourses: CourseModel[];
  public completedCourses: CourseModel[];
  public courseProgress: { [courseId: string]: CourseProgress } = {};
  public coursesLoaded: boolean = false;

  public async ngOnInit(): Promise<void> {
    try {
      this.username = this.userService.getUsername();
      this.enrolledCourses = await this.userService.getEnrolledCourses(); // Retrieve enrolled courses

      await this.loadCourseProgress(); // Load progress into dictionary

      // Order courses by progress
      this.completedCourses = this.enrolledCourses.filter(course => this.courseProgress[course.id].completed === this.courseProgress[course.id].total
                                                            && this.courseProgress[course.id].total !== 0
                                                          );
      this.enrolledCourses = this.enrolledCourses.filter(course => this.completedCourses.indexOf(course) === -1);
    }
    catch (err: any) {
      console.error(err.message);
    }
  }

  public async loadCourseProgress(): Promise<void> {
    try {
      for (const course of this.enrolledCourses) {
        this.courseProgress[course.id] = await this.userService.getCourseProgress(course.id);
      }
      this.coursesLoaded = true; // Flag for template
    }
    catch (err: any) {
      console.error(err.message);
    }

    return null; // Avoid compilation error
  }

  public async updateEnrollments() : Promise<void> {
    this.enrolledCourses = await this.userService.getEnrolledCourses();

    // Order courses by progress
    this.completedCourses = this.enrolledCourses.filter(course => this.courseProgress[course.id].completed === this.courseProgress[course.id].total
      && this.courseProgress[course.id].total !== 0
    );
    
    this.enrolledCourses = this.enrolledCourses.filter(course => this.completedCourses.indexOf(course) === -1);
  }
}
