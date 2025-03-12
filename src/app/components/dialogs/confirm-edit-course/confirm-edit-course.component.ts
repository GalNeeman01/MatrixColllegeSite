import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';


@Component({
  selector: 'app-confirm-edit-course',
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './confirm-edit-course.component.html',
  styleUrl: './confirm-edit-course.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfirmEditCourseComponent {

}
