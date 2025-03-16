import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { LessonModel } from '../../../models/lesson.model';
import { SnackbarService } from '../../../services/snackbar.service';

@Component({
  selector: 'app-watch-lesson',
  imports: [CommonModule],
  templateUrl: './watch-lesson.component.html',
  styleUrl: './watch-lesson.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WatchLessonComponent implements OnInit {
  // DI's
  private activatedRoute = inject(ActivatedRoute);
  private sanitizer = inject(DomSanitizer);
  private snackbarService = inject(SnackbarService);
  
  // Public
  public lesson = signal<LessonModel>(undefined);
  public safeUrl : SafeResourceUrl;


  // Methods
  public async ngOnInit(): Promise<void> {
    try {
      // Fetch lesson
      this.lesson.set(this.activatedRoute.snapshot.data['lessonData']);

      // Save safe url
      this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.lesson().videoUrl);
    } 
    catch (err: any) {
      this.snackbarService.showError(err.message);
    }
  }
}
