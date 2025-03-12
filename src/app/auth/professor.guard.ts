import { inject, Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from "@angular/router";
import { UserService } from "../services/user.service";
import { Roles } from "../utils/types";

@Injectable({
  providedIn: 'root'
})
export class ProfessorGuard implements CanActivate {
  
  private userService = inject(UserService);
  private router = inject(Router);

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult> {
    if (!this.userService.isLoggedIn() || this.userService.getUserRole() !== Roles.Professor) {
      this.router.navigateByUrl("home");
      return false;
    }

    return true;
  }
}