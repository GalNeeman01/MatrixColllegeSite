import { ChangeDetectionStrategy, Component, EventEmitter, inject, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { UserService } from '../../../../services/user.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-user-badge',
  imports: [MatButtonModule, MatMenuModule, MatIconModule, RouterLink],
  templateUrl: './user-badge.component.html',
  styleUrl: './user-badge.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserBadgeComponent {
  private userService = inject(UserService);
  private router = inject(Router);

  public userInitials = this.userService.getUsername()[0].toUpperCase();

  public logout(): void {
    this.userService.logout();
    this.router.navigateByUrl('home');
  }
}
