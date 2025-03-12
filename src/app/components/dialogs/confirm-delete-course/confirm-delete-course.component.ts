import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-delete-course',
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './confirm-delete-course.component.html',
  styleUrl: './confirm-delete-course.component.css'
})
export class ConfirmDeleteCourseComponent {

}
