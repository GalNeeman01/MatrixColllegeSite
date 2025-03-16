import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-student-quote',
  imports: [],
  templateUrl: './student-quote.component.html',
  styleUrl: './student-quote.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StudentQuoteComponent {
  // Inputs
  @Input()
  public quote: string;

  @Input()
  public studentName: string;
}
