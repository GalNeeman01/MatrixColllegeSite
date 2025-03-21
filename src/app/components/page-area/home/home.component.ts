import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { HomeHeaderComponent } from "../../home-area/home-header/home-header.component";
import { LinkCardComponent } from "../../home-area/link-card/link-card.component";
import { CourseCardComponent } from "../../course-area/course-card/course-card.component";
import { CourseModel } from '../../../models/course.model';
import { CourseService } from '../../../services/course.service';
import { CommonModule } from '@angular/common';
import { StudentReviewsComponent } from "../../home-area/student-reviews/student-reviews.component";
import { SnackbarService } from '../../../services/snackbar.service';

@Component({
  selector: 'app-home',
  imports: [HomeHeaderComponent, LinkCardComponent, CourseCardComponent, CommonModule, StudentReviewsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {
    // DI's
    private courseService = inject(CourseService);
    private snackbarService = inject(SnackbarService);

    // Public
    public featuredCourses = signal<CourseModel[]>([]);

    // Methods
    public async ngOnInit() {
        try {
            window.scrollTo(0, 0); // Reset scrolling position
            this.featuredCourses.set((await this.courseService.getAllCourses()).slice(0, 2)); // Grab first 2 courses to display as featured
        }
        catch (err: any)
        {
            this.snackbarService.showError(err.message);
        }
    }
}
