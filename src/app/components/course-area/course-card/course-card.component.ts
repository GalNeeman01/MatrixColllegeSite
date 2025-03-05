import { Component, Input } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { CourseModel } from '../../../models/course.model';

@Component({
  selector: 'app-course-card',
  imports: [MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './course-card.component.html',
  styleUrl: './course-card.component.css'
})
export class CourseCardComponent {
  @Input()
  public course : CourseModel;
}
