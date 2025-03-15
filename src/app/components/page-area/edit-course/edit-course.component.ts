import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseModel } from '../../../models/course.model';
import { CourseService } from '../../../services/course.service';
import { SnackbarService } from '../../../services/snackbar.service';
import { CourseLessonsEditComponent } from "../../course-area/course-lessons-edit/course-lessons-edit.component";
import { ConfirmDeleteCourseComponent } from '../../dialogs/confirm-delete-course/confirm-delete-course.component';
import { ConfirmEditCourseComponent } from '../../dialogs/confirm-edit-course/confirm-edit-course.component';

@Component({
  selector: 'app-edit-course',
  imports: [FormsModule, MatFormFieldModule, MatLabel, MatInputModule,
    MatExpansionModule, MatTableModule, MatIconModule, MatButtonModule,
    CommonModule, CourseLessonsEditComponent],
  templateUrl: './edit-course.component.html',
  styleUrl: './edit-course.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditCourseComponent implements OnInit {
  @ViewChild(CourseLessonsEditComponent)
  lessonsTable: CourseLessonsEditComponent;

  private snackbarService = inject(SnackbarService);
  private activatedRoute = inject(ActivatedRoute);
  private courseService = inject(CourseService);
  private dialog = inject(MatDialog);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  public course = signal<CourseModel>(undefined);
  
  private courseId : string;
  private originalCourseDetails = {title: "", desc: ""};

  public async ngOnInit(): Promise<void> {
    try {
      this.courseId = this.activatedRoute.snapshot.params['id'];

      // Fetch course
      const resolveData : CourseModel = this.route.snapshot.data['courseData'];
      this.course.set(resolveData);

      // Save copy to use to reset the form
      this.originalCourseDetails = { title: this.course().title, desc: this.course().description };
    }
    catch (err: any)
    {
      this.snackbarService.showError(err.message);
    }
  }

  public resetChanges(): void {
    this.lessonsTable.resetChanges();
  }

  public async applyChanges() : Promise<void> {
    try {
      let isChangesMade = await this.lessonsTable.saveChanges();

      // Save course data (from form)
      if (this.course().title !== this.originalCourseDetails.title || this.course().description !== this.originalCourseDetails.desc) { // If any changes were made
        await this.courseService.updateCourse(this.course()); // Call to rest api
        this.originalCourseDetails = {title: this.course().title, desc: this.course().description};
      }

      if (isChangesMade)
        this.snackbarService.showSuccess("Successfully applied changes.");
      else {
        this.snackbarService.showWarning("No changes were made..");
      }
    }
    catch (err: any) {
      this.snackbarService.showError(err.message);
    }
  }

  public confirmDelete() : void {
    const dialogRef = this.dialog.open(ConfirmDeleteCourseComponent);

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === true) {
        try {
          await this.courseService.deleteCourse(this.courseId);
          this.snackbarService.showSuccess("Successfully removed course.");
          this.router.navigateByUrl("courses");
        }
        catch(err: any) {
          this.snackbarService.showError(err.message);
        }
      }
    })
  }

  // Confirm actions
  public openConfirmationDialog() : void
  {
    const dialogRef = this.dialog.open(ConfirmEditCourseComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result === true)
        this.applyChanges();
    });
  }
}
