import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CourseService } from '../../../services/course.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SnackbarService } from '../../../services/snackbar.service';
import { CourseModel } from '../../../models/course.model';

@Component({
  selector: 'app-add-course',
  imports: [MatDialogModule, MatButtonModule, FormsModule, MatFormFieldModule, MatInputModule,
            CommonModule],
  templateUrl: './add-course.component.html',
  styleUrl: './add-course.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddCourseComponent {
  private courseService = inject(CourseService);
  private router = inject(Router);
  private snackbarService = inject(SnackbarService);
  private dialogRef = inject(MatDialogRef<AddCourseComponent>);

  public courseName : string;
  public courseDescription: string;

  public async createCourse() : Promise<void> {
    try {
      const course : CourseModel = { id: undefined, title: this.courseName, description: this.courseDescription, createdAt: new Date() }
      const dbCourse = await this.courseService.addCourse(course);

      await this.router.navigateByUrl("courses"); // Added step to reload if already on courses/edit
      await this.router.navigateByUrl("courses/edit/" + dbCourse.id);
      this.dialogRef.close();
    }
    catch (err: any)
    {
      this.snackbarService.showError(err.message);
    }
  }
}
