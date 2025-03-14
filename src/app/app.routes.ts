import { Routes } from '@angular/router';
import { AnonymousGuard } from './auth/anonymous.guard';
import { ProfessorGuard } from './auth/professor.guard';
import { UserGuard } from './auth/user.guard';
import { CoursesComponent } from './components/page-area/courses/courses.component';
import { HomeComponent } from './components/page-area/home/home.component';
import { CourseResolver } from './resolvers/course.service';
import { CoursesResolver } from './resolvers/courses.service';
import { WatchLessonGuard } from './auth/watch-lesson.guard';

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
        component: CoursesComponent,
        resolve: {
            coursesData: CoursesResolver
        }
    },

    {
        path: "courses/:id", 
        loadComponent: () => import('./components/page-area/view-course/view-course.component').then(m => m.ViewCourseComponent),
        resolve: {
            courseData: CourseResolver
        }
    },

    {
        path: "profile", 
        loadComponent: () => import('./components/page-area/user-profile/user-profile.component').then(m => m.UserProfileComponent),
        canActivate: [UserGuard],
        resolve: {
            coursesData: CoursesResolver
        }
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
        canActivate: [UserGuard, WatchLessonGuard]
    }, // Lazy load

    {
        path: "courses/edit/:id",
        loadComponent: () => import('./components/page-area/edit-course/edit-course.component').then(m => m.EditCourseComponent),
        canActivate: [UserGuard, ProfessorGuard]
    }, // Lazy load

    {path: "**", redirectTo: "home"},
];
