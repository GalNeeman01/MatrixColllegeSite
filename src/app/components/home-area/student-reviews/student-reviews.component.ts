import { ChangeDetectionStrategy, Component } from '@angular/core';
import { StudentQuoteComponent } from "../student-quote/student-quote.component";

@Component({
  selector: 'app-student-reviews',
  imports: [StudentQuoteComponent],
  templateUrl: './student-reviews.component.html',
  styleUrl: './student-reviews.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StudentReviewsComponent {

}
