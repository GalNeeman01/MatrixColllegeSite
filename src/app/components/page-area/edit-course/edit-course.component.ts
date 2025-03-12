import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { CourseModel } from '../../../models/course.model';
import { LessonModel } from '../../../models/lesson.model';
import { LessonService } from '../../../services/lesson.service';
import { SnackbarService } from '../../../services/snackbar.service';
import { CourseService } from '../../../services/course.service';

@Component({
  selector: 'app-edit-course',
  imports: [FormsModule, MatFormFieldModule, MatLabel, MatInputModule, 
            MatExpansionModule, MatTableModule, MatIconModule, MatButtonModule,
            CommonModule],
  templateUrl: './edit-course.component.html',
  styleUrl: './edit-course.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditCourseComponent implements OnInit {
  private snackbarService = inject(SnackbarService);
  private lessonService = inject(LessonService);
  private activatedRoute = inject(ActivatedRoute);
  private courseService = inject(CourseService);

  public lessons = signal<LessonModel[]>([]);
  public course = signal<CourseModel>(undefined);
  public isCreateLesson : boolean = false;
  public createLessonTitle : string = "";
  public createLessonUrl : string = "";
  
  private lessonsToDelete : LessonModel[] = []
  private lessonsToAdd : LessonModel[] = [];
  private courseId : string;
  private originalCourseDetails = {title: "", desc: ""};

  public async ngOnInit(): Promise<void> {
    try {
      this.courseId = this.activatedRoute.snapshot.params['id'];

      // Fetch course
      this.course.set(await this.courseService.getCourseById(this.courseId));
      this.originalCourseDetails = { title: this.course().title, desc: this.course().description };

      // Fetch lessons
      this.lessons.set(await this.lessonService.getLessonsByCourseId(this.courseId));
    }
    catch (err: any)
    {
      this.snackbarService.showError(err.message);
    }
  }

  public deleteLesson(lesson: LessonModel): void {
    // Don't add to remove list if it's a dynamically added lesson (since it doesn't exist in the DB anyway)
    if (this.lessonsToAdd.some(l => l.title === lesson.title)) {
      this.lessonsToAdd = this.lessonsToAdd.filter(l => l.title !== lesson.title);
    }
    else
      this.lessonsToDelete.push(lesson);

    // Update displayed list
    this.lessons.set(this.lessons().filter(l => l.title !== lesson.title));
  }

  public resetChanges(): void {
    // Close new lesson panel
    this.isCreateLesson = false;

    // Reset lessons signal
    for (const lesson of this.lessonsToDelete) {
      this.lessons().push(lesson);
    }

    this.lessons.set(this.lessons().filter(l => !this.lessonsToAdd.some(le => le.id === l.id)));

    // Clear delete lessons list
    this.lessonsToDelete = [];

    // Clear add lessons list
    this.lessonsToAdd = [];
  }

  public async applyChanges() : Promise<void> {
    try {
      let isChange = false;

      // Apply lesson addition / deletion changes
      for (const lesson of this.lessonsToDelete) {
        await this.lessonService.removeLesson(lesson.id);
      }

      for (const lesson of this.lessonsToAdd) {
        await this.lessonService.addLesson(lesson);
      }

      // Reach here after successful push to DB
      if (this.lessonsToDelete.length > 0 || this.lessonsToAdd.length > 0)
        isChange = true;


      // Save course data (from form)
      if (this.course().title !== this.originalCourseDetails.title || this.course().description !== this.originalCourseDetails.desc) { // If any changes were made
        await this.courseService.updateCourse(this.course()); // Call to rest api
        this.originalCourseDetails = {title: this.course().title, desc: this.course().description};
        isChange = true;
      }

      if (isChange)
        this.snackbarService.showSuccess("Successfully applied changes.");
      else
        this.snackbarService.showWarning("No changes were made..");
    }
    catch (err: any) {
      this.snackbarService.showError(err.message);
    }
    finally {
      this.lessonsToDelete = [];
      this.lessonsToAdd = [];
    }
  }

  public addCreateLessonRow() : void {
    this.isCreateLesson = true;
  }

  public addLesson() : void {
    // Validate url RegEx from back-end
    const urlRegex = new RegExp(/^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/);
    if (!urlRegex.test(this.createLessonUrl)) {
      this.snackbarService.showError("The new lesson's VideoURL must be in a URL format.")
      return;
    }

    // Add logic (No DB)
    const lesson : LessonModel =  {id: undefined, title: this.createLessonTitle, videoUrl: this.createLessonUrl, courseId: this.courseId};
    this.lessonsToAdd.push(lesson);
    this.lessons().push(lesson);

    this.createLessonTitle = "";
    this.createLessonUrl = "";
    this.isCreateLesson = false;
  }
}
