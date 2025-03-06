import { Routes } from '@angular/router';
import { HomeComponent } from './components/page-area/home/home.component';
import { CoursesComponent } from './components/page-area/courses/courses.component';
import { ViewCourseComponent } from './components/page-area/view-course/view-course.component';

export const routes: Routes = [
    {path: "", redirectTo: "home", pathMatch: "full"},
    {path: "home", component: HomeComponent},
    {path: "courses", component: CoursesComponent},
    {path: "courses/:id", component: ViewCourseComponent},
];
