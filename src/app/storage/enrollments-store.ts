import { patchState, signalStore, withComputed, withMethods, withState } from "@ngrx/signals";
import { EnrollmentModel } from "../models/enrollment.model";
import { CourseModel } from "../models/course.model";
import { computed } from "@angular/core";

export type EnrollmentState = {
    enrollments: EnrollmentModel[];
}

const initialState: EnrollmentState = {
    enrollments: []
};

export const EnrollmentStore = signalStore(
    // Defining EnrollmentStore as an injectable singleton service
    { providedIn: "root"},

    // Initial state
    withState(initialState),

    withMethods(store => ({
        initEnrollments(enrollments: EnrollmentModel[]) : void {
            patchState(store, currentState => ({enrollments}));
        },

        addEnrollment(enrollment: EnrollmentModel) : void {
            patchState(store, currentState => ({ enrollments: [...currentState.enrollments, enrollment] }));
        },

        deleteEnrollment(id: string) : void {
            patchState(store, currentState => ({enrollments: currentState.enrollments.filter(e => e.id !== id)}));
        },

        clearEnrollments(): void {
            patchState(store, currentState => ({enrollments: [] as EnrollmentModel[]}));
        }
    })),
)