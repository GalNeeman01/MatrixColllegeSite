import { Routes } from '@angular/router';
import { HomeComponent } from './components/page-area/home/home.component';
import { UserProfileComponent } from './components/page-area/user-profile/user-profile.component';
import { CoursesComponent } from './components/page-area/courses/courses.component';
import { ViewCourseComponent } from './components/page-area/view-course/view-course.component';
import { UserGuard } from './auth/user.guard';
import { ProfessorGuard } from './auth/professor.guard';
import { AnonymousGuard } from './auth/Anonymous.guard';

export const routes: Routes = [
    {
        path: "", 
        redirectTo: "home", 
        pathMatch: "full"
    },

    {
        path: "home",
        component: HomeComponent
    },

    {
        path: "courses", 
        component: CoursesComponent
    },

    {
        path: "courses/:id", 
        component: ViewCourseComponent
    },

    {
        path: "profile", component: UserProfileComponent,
        canActivate: [UserGuard]
    },

    {
        path: "login", 
        loadComponent: () => import('./components/page-area/login/login.component').then(m => m.LoginComponent),
        canActivate: [AnonymousGuard]
    }, // Lazy load

    {
        path: "register", 
        loadComponent: () => import('./components/page-area/register/register.component').then(m => m.RegisterComponent),
        canActivate: [AnonymousGuard]
    }, // Lazy load

    {
        path: "watch/:id", 
        loadComponent: () => import('./components/page-area/watch-lesson/watch-lesson.component').then(m => m.WatchLessonComponent),
        canActivate: [UserGuard]
    }, // Lazy load

    {
        path: "courses/edit/:id",
        loadComponent: () => import('./components/page-area/edit-course/edit-course.component').then(m => m.EditCourseComponent),
        canActivate: [UserGuard, ProfessorGuard]
    }, // Lazy load

    {path: "**", redirectTo: "home"},
];
