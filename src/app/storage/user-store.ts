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
        initUser(user: UserModel) : void {
            patchState(store, currentState => ({ user }));
        },

        logoutUser(): void {
            patchState(store, currentState => ({user: null as UserModel}));
        }
    })),
)