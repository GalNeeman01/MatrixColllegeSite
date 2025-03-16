import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";
import { ProgressModel } from "../models/progress.model";

export type ProgressState = {
    progresses: ProgressModel[];
}

const initialState: ProgressState = {
    progresses: []
}

export const ProgressStore = signalStore(
    { providedIn: "root" },

    withState(initialState),

    withMethods(store => ({
        initProgresses(progresses: ProgressModel[]): void {
            patchState(store, currentState => ({ progresses }));
        },

        addProgress(progress: ProgressModel): void {
            patchState(store, currentState => ({ progresses: [...currentState.progresses, progress] }));
        },

        clearProgress(): void {
            patchState(store, currentState => ({ progresses: [] as ProgressModel[] }))
        }
    }))
)