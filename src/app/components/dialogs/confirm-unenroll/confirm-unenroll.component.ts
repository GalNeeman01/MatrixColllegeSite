import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-unenroll',
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './confirm-unenroll.component.html',
  styleUrl: './confirm-unenroll.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfirmUnenrollComponent {
}
