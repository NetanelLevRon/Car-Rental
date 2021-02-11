import { Component } from '@angular/core';
import { UserService } from '../shared/services/user.service';
import { Router } from '@angular/router';
import { CarsComponent } from '../cars/cars.component';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  private isLogedIn: boolean = false;

  constructor(private _userService: UserService, private route: Router) { }

  OnSubmit(unam: string, psw: string) {

    if (this.isLogedIn == false) {
      this._userService.getLoginUser(unam, psw);
      this.isLogedIn = true;
    }
    if (this._userService.user.FullName) {

      if(this._userService.user.UserRole == 'customer') {// other than 'guest' this role is the only role that 'cars.component' is presented to 
      console.log('from login  \nthis._userService.user.UserRole = ' +  this._userService.user.UserRole);
      localStorage.clear(); // with the entering of the new user clear the storage for new list of cars that this specific user will interesting on
      CarsComponent.identifierForKey = 0; // for local storage uses
      }
      

      this.route.navigateByUrl('/home');
    }
    else
      setTimeout(() => {
        if(this._userService.errMsg){
          if (this._userService.errMsg[0]) {
            alert(this._userService.errMsg[0] + " - Incorrect user name or password!");
            this._userService.errMsg = new Array<string>();
            this.isLogedIn = false;
          }
          else {
            this.OnSubmit(unam, psw);
          }
        }
        else {
          this.OnSubmit(unam, psw);
        }
      }, 1000);
  }

}