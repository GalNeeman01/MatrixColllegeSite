import { ChangeDetectionStrategy, Component, inject, Input, OnInit, Signal, signal } from '@angular/core';
import { LessonModel } from '../../../models/lesson.model';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-lesson',
  imports: [MatCardModule, MatIconModule, MatButtonModule],
  templateUrl: './lesson.component.html',
  styleUrl: './lesson.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LessonComponent implements OnInit {
    @Input()
    public lesson: LessonModel;

    private userService = inject(UserService);

    public isLoggedIn : Signal<boolean>;

    ngOnInit(): void {
        this.isLoggedIn = signal<boolean>(this.userService.isLoggedIn());
    }
}
