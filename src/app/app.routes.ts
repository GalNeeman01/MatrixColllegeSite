import { Routes } from '@angular/router';
import { HomeComponent } from './components/page-area/home/home.component';
import { UserProfileComponent } from './components/page-area/user-profile/user-profile.component';
import { CoursesComponent } from './components/page-area/courses/courses.component';
import { ViewCourseComponent } from './components/page-area/view-course/view-course.component';

export const routes: Routes = [
    {path: "", redirectTo: "home", pathMatch: "full"},
    {path: "home", component: HomeComponent},
    {path: "courses", component: CoursesComponent},
    {path: "courses/:id", component: ViewCourseComponent},
    {path: "profile", component: UserProfileComponent},
    {path: "login", loadComponent: () => import('./components/page-area/login/login.component').then(m => m.LoginComponent)}, // Lazy load
    {path: "register", loadComponent: () => import('./components/page-area/register/register.component').then(m => m.RegisterComponent)}, // Lazy load
    {path: "watch/:id", loadComponent: () => import('./components/page-area/watch-lesson/watch-lesson.component').then(m => m.WatchLessonComponent)} // Lazy load
];
