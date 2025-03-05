import { Component } from '@angular/core';
import {MatButtonModule} from '@angular/material/button'
import {MatIconModule} from '@angular/material/icon'

@Component({
  selector: 'app-user-info',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './user-info.component.html',
  styleUrl: './user-info.component.css'
})
export class UserInfoComponent {
  public loggedIn: boolean = false;
}
