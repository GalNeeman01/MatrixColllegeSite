import { Component, inject, OnInit } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { RouterOutlet } from '@angular/router';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-layout',
  imports: [HeaderComponent, RouterOutlet],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
})
export class LayoutComponent implements OnInit {
  private userService = inject(UserService);

  ngOnInit(): void {
    this.userService.checkLoggedIn();
  }
}
