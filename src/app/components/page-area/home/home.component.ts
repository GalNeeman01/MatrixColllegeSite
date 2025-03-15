import { Component, inject, OnInit } from '@angular/core';
import { HomeHeaderComponent } from "../../home-area/home-header/home-header.component";
import { LinkCardComponent } from "../../home-area/link-card/link-card.component";
import { CourseCardComponent } from "../../course-area/course-card/course-card.component";
import { CourseModel } from '../../../models/course.model';
import { CourseService } from '../../../services/course.service';
import { CommonModule } from '@angular/common';
import { StudentReviewsComponent } from "../../home-area/student-reviews/student-reviews.component";

@Component({
  selector: 'app-home',
  imports: [HomeHeaderComponent, LinkCardComponent, CourseCardComponent, CommonModule, StudentReviewsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
    private courseService = inject(CourseService);

    public featuredCourses : CourseModel[] = [];

    public async ngOnInit() {
        this.featuredCourses = (await this.courseService.getAllCourses()).slice(0, 2);
    }
}
