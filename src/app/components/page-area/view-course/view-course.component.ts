import { Component, inject, Input, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CourseModel } from '../../../models/course.model';
import { CourseService } from '../../../services/course.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-view-course',
  imports: [RouterModule, CommonModule],
  templateUrl: './view-course.component.html',
  styleUrl: './view-course.component.css',
})
export class ViewCourseComponent implements OnInit {
    private activatedRoute = inject(ActivatedRoute);
    private courseService = inject(CourseService);

    public courseModel: CourseModel;

    @Input()
    public id : string = "";
  
    public link = '/courses/' + this.id;
    async ngOnInit(): Promise<void> {
        this.id = this.activatedRoute.snapshot.params['id'];
        this.courseModel = await this.courseService.getCourseById(this.id);
    }
}
