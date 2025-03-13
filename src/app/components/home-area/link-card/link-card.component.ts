import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-link-card',
  imports: [MatIconModule, RouterLink],
  templateUrl: './link-card.component.html',
  styleUrl: './link-card.component.css'
})
export class LinkCardComponent {
    @Input()
    public iconName: string;

    @Input()
    public title: string;

    @Input()
    public text: string;

    @Input()
    public link: string;
}
