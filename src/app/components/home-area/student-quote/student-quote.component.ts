import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-student-quote',
  imports: [],
  templateUrl: './student-quote.component.html',
  styleUrl: './student-quote.component.css'
})
export class StudentQuoteComponent {
    @Input()
    public quote: string;

    @Input()
    public studentName: string;
}
