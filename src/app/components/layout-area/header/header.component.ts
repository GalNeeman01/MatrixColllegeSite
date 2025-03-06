import { Component } from '@angular/core';
import { LogoComponent } from "../logo/logo.component";
import { NavigationComponent } from "../navigation/navigation.component";
import { UserInfoComponent } from "../user-info/user-info.component";
import {MatToolbarModule} from '@angular/material/toolbar';

@Component({
  selector: 'app-header',
  imports: [LogoComponent, NavigationComponent, UserInfoComponent, MatToolbarModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

}
