import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Input, OnInit, signal } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { CourseModel } from '../../../models/course.model';
import { SnackbarService } from '../../../services/snackbar.service';
import { UserService } from '../../../services/user.service';
import { Roles } from '../../../utils/types';

@Component({
    selector: 'app-course-card',
    imports: [MatCardModule, MatButtonModule, MatIconModule, RouterModule, 
                DatePipe, MatChipsModule, CommonModule, MatBadgeModule],
    templateUrl: './course-card.component.html',
    styleUrl: './course-card.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CourseCardComponent implements OnInit {
    // Inputs
    @Input()
    public course: CourseModel;

    // Public
    public isEnrolled = signal<boolean>(false);
    public badge = signal<string>("");
    public link: string;
    public isProfessor = false;
    public isLoggedIn = false;
    public isStudent = false;

    // Private
    private isNew: boolean;

    // DI's
    private snackbarService = inject(SnackbarService);
    private userService = inject(UserService);
    private router = inject(Router);

    // Methods
    async ngOnInit(): Promise<void> {
        try {
            this.link = `/courses/${this.course.id}`;

            // Check if the user is logged in
            if (this.userService.isLoggedIn()) {
                // Save logged in
                this.isLoggedIn = true;

                // Assign role
                this.isProfessor = this.userService.getUserRole() === Roles.Professor;
                this.isStudent = this.userService.getUserRole() === Roles.Student;

                // Check if user is enrolled to the course
                this.isEnrolled.set(await this.userService.isEnrolled(this.course.id));
            }

            // Determine whether to show the "NEW" badge or not
            this.isNew = (new Date().getTime()) - (new Date(this.course.createdAt).getTime()) < (7 * 24 * 60 * 60 * 1000);

            if (this.isNew) {
                this.badge.set("NEW");
            }
        }
        catch (err: any) {
            this.snackbarService.showError(err.message);
        }
    }

    public async enroll(): Promise<void> {
        try {
            // Verify that the user is logged in
            if (!this.isLoggedIn) {
                this.snackbarService.showError("You must be logged in to enroll for courses.");
                this.router.navigateByUrl("login");
            }
            else { // Enroll the user in the course
                await this.userService.enrollUser(this.course.id);
                this.snackbarService.showSuccess("Successfully enrolled for course.")
                this.router.navigateByUrl("profile");
            }
        }
        catch (err: any) {
            this.snackbarService.showError(err.message);
        }
    }

    public editCourse(): void {
        this.router.navigateByUrl("courses/edit/" + this.course.id);
    }
}
