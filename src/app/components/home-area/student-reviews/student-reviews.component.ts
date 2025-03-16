import { Component } from '@angular/core';
import { StudentQuoteComponent } from "../student-quote/student-quote.component";

@Component({
  selector: 'app-student-reviews',
  imports: [StudentQuoteComponent],
  templateUrl: './student-reviews.component.html',
  styleUrl: './student-reviews.component.css'
})
export class StudentReviewsComponent {

}
