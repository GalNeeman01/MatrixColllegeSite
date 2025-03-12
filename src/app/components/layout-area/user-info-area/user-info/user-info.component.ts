import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { UserService } from '../../../../services/user.service';
import { UserBadgeComponent } from "../user-badge/user-badge.component";

@Component({
  selector: 'app-user-info',
  imports: [MatButtonModule, MatIconModule, 
            RouterModule, UserBadgeComponent],
  templateUrl: './user-info.component.html',
  styleUrl: './user-info.component.css'
})
export class UserInfoComponent {
  public userService = inject(UserService);
}
