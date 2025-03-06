import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CourseCardComponent } from "../../course-area/course-card/course-card.component";
import { CourseModel } from '../../../models/course.model';
import { CourseService } from '../../../services/course.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-courses',
  imports: [CourseCardComponent, CommonModule],
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoursesComponent implements OnInit {
  public courses = signal<CourseModel[]>([]);
  
  private courseService = inject(CourseService);

  public async ngOnInit(): Promise<void> {
    try {
      this.courses.set(await this.courseService.getAllCourses());
    }
    catch (err: any)
    {
      console.log(err.message);
    }
  }

}
