import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { LessonModel } from '../models/lesson.model';
import { LessonService } from '../services/lesson.service';
import { SnackbarService } from '../services/snackbar.service';

@Injectable({
    providedIn: 'root'
})
export class WatchLessonResolver implements Resolve<LessonModel> {
    private lessonService = inject(LessonService);
    private snackbarService = inject(SnackbarService);

    resolve(route: ActivatedRouteSnapshot): Promise<LessonModel> {
        try {
            const id = route.paramMap.get('id');
            return this.lessonService.getLessonById(id)
        }
        catch (err: any) {
            this.snackbarService.showError(err.message);
            return undefined;
        }
    }
}
