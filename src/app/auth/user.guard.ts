import { inject, Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from "@angular/router";
import { UserService } from "../services/user.service";

@Injectable({
  providedIn: 'root'
})
export class UserGuard implements CanActivate {

  private userService = inject(UserService);
  private router = inject(Router);

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult> {
    if (!this.userService.isLoggedIn()) {
      this.router.navigateByUrl("home");
      return false;
    }

    return true;
  }
}