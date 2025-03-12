import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, OnInit, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { LessonModel } from '../../../models/lesson.model';
import { LessonService } from '../../../services/lesson.service';
import { SnackbarService } from '../../../services/snackbar.service';
import { GUID } from '../../../utils/types';

@Component({
  selector: 'app-course-lessons-edit',
  imports: [MatIconModule, CommonModule, FormsModule, MatFormFieldModule, 
            MatLabel, MatInputModule, MatIconModule, MatButtonModule],
  templateUrl: './course-lessons-edit.component.html',
  styleUrl: './course-lessons-edit.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CourseLessonsEditComponent implements OnInit {
  @Input()
  public courseId : GUID;

  // DI's
  private lessonService = inject(LessonService);
  private snackbarService = inject(SnackbarService);

  // Public
  public lessons = signal<LessonModel[]>([]);
  public isCreateLesson : boolean = false;
  public createLessonTitle : string = "";
  public createLessonUrl : string = "";
  public editLesson = new LessonModel();

  // Private
  private lessonsToDelete : LessonModel[] = []
  private lessonsToAdd : LessonModel[] = [];
  private lessonsToEdit : LessonModel[] = [];
  private backupLessons : LessonModel[] = [];

  // Methods
  public async ngOnInit(): Promise<void> {
    // Fetch lessons
    this.lessons.set(await this.lessonService.getLessonsByCourseId(this.courseId));

    this.backupLessons = structuredClone(this.lessons());
  }

  public deleteLesson(lesson: LessonModel): void {
    // Don't add to remove list if it's a dynamically added lesson (since it doesn't exist in the DB anyway)
    if (this.lessonsToAdd.some(l => l.title === lesson.title)) {
      this.lessonsToAdd = this.lessonsToAdd.filter(l => l.title !== lesson.title);
    }
    else if(lesson.id != undefined)
      this.lessonsToDelete.push(lesson);

    // Update displayed list
    this.lessons.set(this.lessons().filter(l => l.title !== lesson.title));
  }

  public addCreateLessonRow() : void {
    this.isCreateLesson = true;
  }

  private validateUrl(url: string) : boolean {
    // Validate using url RegEx from back-end
    const urlRegex = new RegExp(/^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/);

    return urlRegex.test(url);
  }

  public addLesson() : void {
    // Fail if bad URL
    if (!this.validateUrl(this.createLessonUrl)) {
      this.snackbarService.showError("The videoUrl must be in a URL format.");
      return;
    }
    // Add logic (No DB) | Give temporary ID for Differ tracking
    const lesson : LessonModel =  {id: crypto.randomUUID(), title: this.createLessonTitle, videoUrl: this.createLessonUrl, courseId: this.courseId};

    this.lessons.set([...this.lessons(), lesson]); // Display the lesson with a temporary id
    this.lessonsToAdd.push( lesson );

    this.createLessonTitle = "";
    this.createLessonUrl = "";
    this.isCreateLesson = false;
  }

  public resetChanges(): void {
    // Close new lesson panel
    this.isCreateLesson = false;

    // Close edit lesson panel
    this.editLesson = new LessonModel();

    // Reset lessons signal
    this.lessons.set(structuredClone(this.backupLessons));

    // Clear delete lessons list
    this.lessonsToDelete = [];

    // Clear add lessons list
    this.lessonsToAdd = [];

    // Clear edit lessons list
    this.lessonsToEdit = [];
  }

  // Return true if changes were made
  public async saveChanges() : Promise<boolean> {
    try {
      let isChange = false;

      // Update edited lessons
      if (this.lessonsToEdit.length > 0) {
        this.lessonService.updateLessons(this.lessonsToEdit);
        isChange = true;
      }

      // Apply lesson addition / deletion changes
      const lessonIds : string [] = this.lessonsToDelete.map(lesson => lesson.id);
      if (lessonIds.length > 0) {
        await this.lessonService.removeLessons(lessonIds);
      }

      if (this.lessonsToAdd.length > 0) {
        await this.lessonService.addLessons(this.lessonsToAdd);
      }

      // Reach here after successful push to DB
      if (this.lessonsToDelete.length > 0 || this.lessonsToAdd.length > 0)
        isChange = true;

      return isChange;
    }
    catch (err: any) {
      this.snackbarService.showError(err.message);
      return false;
    }
    finally {
      this.lessonsToDelete = [];
      this.lessonsToEdit = [];
      this.lessonsToAdd = [];
      this.backupLessons = structuredClone(this.lessons());
    }
  }

  // Start editing a lesson
  public startEditLesson(lesson: LessonModel) : void {
    this.editLesson = lesson;
  }

  public saveEditLesson() {
    // Fail if bad URL
    if (!this.validateUrl(this.editLesson.videoUrl)) {
      this.snackbarService.showError("The videoUrl must be in a URL format.");
      return;
    }

    // Add to list of lessons to update when changes are saved
    if (!this.lessonsToEdit.some(l => l.id === this.editLesson.id)
        && !this.lessonsToAdd.some(l => l.id === this.editLesson.id))
      this.lessonsToEdit.push(this.editLesson);

    this.editLesson = new LessonModel();
  }
}
