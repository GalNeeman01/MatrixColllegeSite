import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../../../services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { AddCourseComponent } from '../../../dialogs/add-course/add-course.component';
import { Roles } from '../../../../utils/types';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-badge',
  imports: [MatButtonModule, MatMenuModule, MatIconModule, RouterLink, CommonModule],
  templateUrl: './user-badge.component.html',
  styleUrl: './user-badge.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserBadgeComponent implements OnInit {
  private userService = inject(UserService);
  private router = inject(Router);
  private dialog = inject(MatDialog);

  public userInitials = signal<string>("");
  public userEmail = signal<string>("");
  public isProfessor : boolean = false;

  ngOnInit(): void {
    this.userInitials.set(this.userService.getUsername()[0].toUpperCase());
    this.userEmail.set(this.userService.getEmail());
    this.isProfessor = this.userService.getUserRole() === Roles.Professor;
  }

  public async logout() {
    this.userService.logout();
    await this.router.navigateByUrl('courses'); // Added this navigation to force home to refresh after a logout (to update features courses buttons)
    await this.router.navigateByUrl('home');
  }

  public openDialog() : void {
        this.dialog.open(AddCourseComponent);
  }
}
