import { Routes } from '@angular/router';
import { ProfessorGuard } from './auth/professor.guard';
import { UserGuard } from './auth/user.guard';
import { WatchLessonGuard } from './auth/watch-lesson.guard';
import { CoursesComponent } from './components/page-area/courses/courses.component';
import { HomeComponent } from './components/page-area/home/home.component';
import { CoursesResolver } from './resolvers/courses.resolver';
import { EditCourseResolver } from './resolvers/edit-course.resolver';
import { ProfileResolver } from './resolvers/profile.resolver';
import { ViewCourseResolver } from './resolvers/view-course.resolver';
import { WatchLessonResolver } from './resolvers/watch-lesson.resolver';
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
        component: CoursesComponent,
        resolve: {
            coursesData: CoursesResolver
        }
    },

    {
        path: "courses/:id",
        loadComponent: () => import('./components/page-area/view-course/view-course.component').then(m => m.ViewCourseComponent),
        resolve: {
            courseData: ViewCourseResolver
        }
    },

    {
        path: "profile",
        loadComponent: () => import('./components/page-area/user-profile/user-profile.component').then(m => m.UserProfileComponent),
        canActivate: [UserGuard],
        resolve: {
            profileData: ProfileResolver
        }
    },

    {
        path: "login",
        loadComponent: () => import('./components/page-area/login/login.component').then(m => m.LoginComponent),
        canActivate: [AnonymousGuard]
    },

    {
        path: "register",
        loadComponent: () => import('./components/page-area/register/register.component').then(m => m.RegisterComponent),
        canActivate: [AnonymousGuard]
    },

    {
        path: "watch/:id",
        loadComponent: () => import('./components/page-area/watch-lesson/watch-lesson.component').then(m => m.WatchLessonComponent),
        canActivate: [UserGuard, WatchLessonGuard],
        resolve: {
            lessonData: WatchLessonResolver
        }
    },

    {
        path: "courses/edit/:id",
        loadComponent: () => import('./components/page-area/edit-course/edit-course.component').then(m => m.EditCourseComponent),
        canActivate: [UserGuard, ProfessorGuard],
        resolve: {
            courseData: EditCourseResolver
        }
    },

    { path: "**", redirectTo: "home" },
];
