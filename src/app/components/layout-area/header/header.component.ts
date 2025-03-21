import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { LogoComponent } from "../logo/logo.component";
import { NavigationComponent } from "../navigation/navigation.component";
import { UserInfoComponent } from "../user-info-area/user-info/user-info.component";

@Component({
  selector: 'app-header',
  imports: [LogoComponent, NavigationComponent, UserInfoComponent, MatToolbarModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
}
