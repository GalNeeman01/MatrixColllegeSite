import { Routes } from '@angular/router';
import { HomeComponent } from './components/page-area/home/home.component';

export const routes: Routes = [
    {path: "", redirectTo: "home", pathMatch: "full"},
    {path: "home", component: HomeComponent},
    {path: "courses", loadComponent: () => import('./components/page-area/courses/courses.component').then(m => m.CoursesComponent)}, // Lazy load
    {path: "courses/:id", loadComponent: () => import('./components/page-area/view-course/view-course.component').then(m => m.ViewCourseComponent)}, // Lazy load
    {path: "login", loadComponent: () => import('./components/page-area/login/login.component').then(m => m.LoginComponent)}, // Lazy load
    {path: "register", loadComponent: () => import('./components/page-area/register/register.component').then(m => m.RegisterComponent)}, // Lazy load
    {path: "profile", loadComponent: () => import('./components/page-area/user-profile/user-profile.component').then(m => m.UserProfileComponent)}, // Lazy load
    {path: "watch/:id", loadComponent: () => import('./components/page-area/watch-lesson/watch-lesson.component').then(m => m.WatchLessonComponent)} // Lazy load
];
