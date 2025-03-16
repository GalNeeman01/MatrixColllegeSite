import { inject, Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router } from "@angular/router";
import { CourseService } from "../services/course.service";
import { UserService } from "../services/user.service";
import { Roles } from "../utils/types";

@Injectable({
    providedIn: 'root'
})
export class WatchLessonGuard implements CanActivate {
    private userService = inject(UserService);
    private courseService = inject(CourseService);
    private router = inject(Router);

    // Only allow enrolled users or professors to watch
    public async canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
        if (this.userService.getUserRole() === Roles.Professor)
            return true; // Always allow professors in

        const lessonId = route.paramMap.get('id');
        if (!lessonId) {
            this.router.navigateByUrl('home');
            return false;
        }

        // Retrieve data for if user is enrolled
        const course = await this.courseService.getCourseByLessonId(lessonId);
        const isEnrolled = await this.userService.isEnrolled(course.id);

        if (!course || !isEnrolled) {
            this.router.navigateByUrl("home");
            return false;
        }

        return true;
    }
}
