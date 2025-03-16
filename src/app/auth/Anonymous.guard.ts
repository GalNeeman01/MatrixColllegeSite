import { inject, Injectable } from "@angular/core";
import { CanActivate, GuardResult, MaybeAsync, Router } from "@angular/router";
import { UserService } from "../services/user.service";

@Injectable({
  providedIn: 'root'
})
export class AnonymousGuard implements CanActivate {

  private userService = inject(UserService);
  private router = inject(Router);

  // Only allow guest users
  canActivate(): MaybeAsync<GuardResult> {
    if (this.userService.isLoggedIn()) {
      this.router.navigateByUrl("home");
      return false;
    }

    return true;
  }
}