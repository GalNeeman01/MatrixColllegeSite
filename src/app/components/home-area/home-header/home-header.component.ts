import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home-header',
  imports: [MatButtonModule, RouterLink],
  templateUrl: './home-header.component.html',
  styleUrl: './home-header.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeHeaderComponent {

}
