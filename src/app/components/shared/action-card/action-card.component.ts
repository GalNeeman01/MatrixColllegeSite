import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-action-card',
  imports: [MatIconModule, MatTooltipModule, MatButtonModule],
  templateUrl: './action-card.component.html',
  styleUrl: './action-card.component.css'
})
export class ActionCardComponent {
    @Input()
    public tooltip: string;

    @Input()
    public iconName: string;

    @Output()
    public actionClicked = new EventEmitter();

    public click() : void {
        this.actionClicked.emit();
    }
}
