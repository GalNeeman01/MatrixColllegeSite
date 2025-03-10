import { ChangeDetectionStrategy, Component, EventEmitter, inject, OnInit, Output, signal } from '@angular/core';
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
export class UserBadgeComponent implements OnInit {
  private userService = inject(UserService);
  private router = inject(Router);

  public userInitials = signal<string>("");
  public userEmail = signal<string>("");

  ngOnInit(): void {
    this.userInitials.set(this.userService.getUsername()[0].toUpperCase());
    this.userEmail.set(this.userService.getEmail());
  }

  public logout(): void {
    this.userService.logout();
    this.router.navigateByUrl('home');
  }
}
