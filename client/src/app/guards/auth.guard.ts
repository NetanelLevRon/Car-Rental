import { Injectable, OnInit } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../shared/services/user.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private _userService: UserService, private _router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this._userService.user.UserRole == undefined) {
      this._userService.defaultUser();
    }
    if (next.data[0] == this._userService.user.UserRole) { // nexst.data[0] contain the value of  data: ['guest'] or ['customer'] 
      console.log("user.role true 0: " + this._userService.user.UserRole) // ['employee'] and ['admin'] [0], [1], [2] Respectively,
      return true;                                                       // and if the current user role is equal - allow permission 
    }                                                                   // according to the request component (initial in routes.ts)
    else if (next.data[1] == this._userService.user.UserRole) {
      console.log("user.role true 1: " + this._userService.user.UserRole)
      return true
    }
    else if (next.data[2] == this._userService.user.UserRole) {
      console.log("user.role true 2: " + this._userService.user.UserRole)
      return true
    }
    else {
      this._router.navigate(['/home']);
      console.log("user.role false: " + this._userService.user.UserRole)
      return false;
    }
  }

}