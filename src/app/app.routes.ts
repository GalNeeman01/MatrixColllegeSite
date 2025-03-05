import { Routes } from '@angular/router';
import { HomeComponent } from './components/pages-area/home/home.component';
import { CoursesComponent } from './components/pages-area/courses/courses.component';

export const routes: Routes = [
    {path: "", redirectTo: "home", pathMatch: "full"},
    {path: "home", component: HomeComponent},
    {path: "courses", component: CoursesComponent},
];
