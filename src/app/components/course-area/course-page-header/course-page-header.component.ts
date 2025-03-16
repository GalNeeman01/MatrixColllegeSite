import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-course-page-header',
  imports: [],
  templateUrl: './course-page-header.component.html',
  styleUrl: './course-page-header.component.css'
})
export class CoursePageHeaderComponent {
  // Inputs
  @Input()
  public badge: string;

  @Input()
  public title: string;

  @Input()
  public description: string;
}
