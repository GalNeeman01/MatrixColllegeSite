import { ChangeDetectionStrategy, Component, inject, Input, OnInit, Signal, signal } from '@angular/core';
import { LessonModel } from '../../../models/lesson.model';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltip, TooltipPosition } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { UserService } from '../../../services/user.service';
import { LessonInfoModel } from '../../../models/lessonInfo.model';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-lesson',
  imports: [MatCardModule, MatIconModule, MatButtonModule, MatTooltip],
  templateUrl: './lesson.component.html',
  styleUrl: './lesson.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LessonComponent implements OnInit{
    @Input()
    public lesson: LessonModel | LessonInfoModel;

    public isLoggedIn: boolean = false;

    public position: { value: TooltipPosition } = { value: 'above' };

    private userService = inject(UserService);

    public ngOnInit(): void {
      this.isLoggedIn = this.userService.isLoggedIn();
    }
}
