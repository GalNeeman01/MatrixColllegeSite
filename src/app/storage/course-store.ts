import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";
import { CourseModel } from "../models/course.model";


export type CourseState = {
    courses: CourseModel[];
}

const initialState: CourseState = {
    courses: []
};

export const CourseStore = signalStore(
    // Defining CourseStore as an injectable singleton service
    { providedIn: "root" },

    // Initial state
    withState(initialState),

    withMethods(store => ({
        initCourses(courses: CourseModel[]): void {
            patchState(store, currentState => ({ courses }));
        },

        addCourse(course: CourseModel): void {
            patchState(store, currentState => ({ courses: [...currentState.courses, course] }));
        },

        updateCourse(course: CourseModel): void {
            patchState(store, currentState => ({ courses: currentState.courses.map(c => c.id === course.id ? course : c) }));
        },

        deleteCourse(id: string): void {
            patchState(store, currentState => ({ courses: currentState.courses.filter(c => c.id !== id) }));
        }
    }))
);