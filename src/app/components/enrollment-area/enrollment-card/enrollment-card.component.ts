import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { CourseModel } from '../../../models/course.model';
import { RouterModule } from '@angular/router';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { CourseProgress } from '../../../utils/types';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-enrollment-card',
  imports: [MatCardModule, MatButtonModule, MatIconModule, RouterModule, MatProgressBarModule, CommonModule],
  templateUrl: './enrollment-card.component.html',
  styleUrl: './enrollment-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EnrollmentCardComponent implements OnInit {
  public progressPercent: number;

  @Input()
  public progress: CourseProgress;

  @Input()
  public course : CourseModel; // Receive from parent component

  public async ngOnInit(): Promise<void> {
    try {
      this.progressPercent = (this.progress.completed / this.progress.total) * 100;
    }
    catch (err: any)
    {
      const errMessage = JSON.parse(err.error).errors;

      console.log(errMessage);
    }
  }
}
