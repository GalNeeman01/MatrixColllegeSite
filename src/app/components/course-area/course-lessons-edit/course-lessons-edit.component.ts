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

  // Private
  private lessonsToDelete : LessonModel[] = []
  private lessonsToAdd : LessonModel[] = [];

  // Methods
  public async ngOnInit(): Promise<void> {
    // Fetch lessons
    this.lessons.set(await this.lessonService.getLessonsByCourseId(this.courseId));
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

  // Return true if changes were made
  public async saveChanges() : Promise<boolean> {
    try {
      let isChange = false;

      // Apply lesson addition / deletion changes
      const lessonIds : GUID [] = this.lessonsToDelete.map(lesson => lesson.id);
      if (lessonIds.length > 0) {
        await this.lessonService.removeLessons(lessonIds);
      }

      if (this.lessonsToAdd.length > 0) {
        const dbLessons : LessonModel[] = await this.lessonService.addLessons(this.lessonsToAdd);
        
        // Remove lessons without IDs from displayed lessons
        this.lessons.set(this.lessons().filter(l => l.id != undefined));
        
        // Add the new lessons with IDs retrieved from back-end
        this.lessons().push(...dbLessons);
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
      this.lessonsToAdd = [];
    }
  }
}
