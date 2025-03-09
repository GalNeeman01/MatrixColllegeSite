import { patchState, signalStore, withComputed, withMethods, withState } from "@ngrx/signals";
import { UserModel } from "../models/user.model";
import { computed } from "@angular/core";

export type UserState = {
    user: UserModel;
}

const initialState: UserState = {
    user: null
};


export const UserStore = signalStore(
    { providedIn: "root" },

    // Initial state
    withState(initialState),

    withMethods(store => ({
        async initUser(user: UserModel) : Promise<void> {
            await patchState(store, currentState => ({ user }));
        },

        logoutUser(): void {
            patchState(store, currentState => ({user: null as UserModel}));
        }
    })),

    withComputed((store) => ({
        userReady: computed(() => store.user() !== null)
    }))
)