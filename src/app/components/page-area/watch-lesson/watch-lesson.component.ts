import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { LessonModel } from '../../../models/lesson.model';
import { LessonService } from '../../../services/lesson.service';
import { SnackbarService } from '../../../services/snackbar.service';

@Component({
  selector: 'app-watch-lesson',
  imports: [CommonModule],
  templateUrl: './watch-lesson.component.html',
  styleUrl: './watch-lesson.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WatchLessonComponent implements OnInit {

  public lesson = signal<LessonModel>(undefined);
  public safeUrl : SafeResourceUrl;

  private activatedRoute = inject(ActivatedRoute);
  private lessonService = inject(LessonService);
  private sanitizer = inject(DomSanitizer);
  private snackbarService = inject(SnackbarService);

  public async ngOnInit(): Promise<void> {
    try {
      const id = this.activatedRoute.snapshot.params['id'];

      // Fetch lesson
      this.lesson.set(await this.lessonService.getLessonById(id));

      // Save safe url
      this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.lesson().videoUrl);
    } 
    catch (err: any) {
      this.snackbarService.showError(err.message);
    }
  }
}
