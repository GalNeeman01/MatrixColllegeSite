import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { CourseModel } from '../../../models/course.model';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-course-card',
  imports: [MatCardModule, MatButtonModule, MatIconModule, RouterModule],
  templateUrl: './course-card.component.html',
  styleUrl: './course-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CourseCardComponent implements OnInit {
  @Input()
  public course : CourseModel;

  public link : string;

  ngOnInit(): void {
    this.link = `/courses/${this.course.id}`;
  }
}
