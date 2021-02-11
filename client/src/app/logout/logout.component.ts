import { Component } from '@angular/core';
import { UserService } from '../shared/services/user.service';
import { Router } from '@angular/router';
import { FullCarService } from '../shared/services/fullCar.service';
import { CarsComponent } from '../cars/cars.component';

@Component({
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent {

  constructor(private _userService: UserService, private route: Router, private _fullCarService: FullCarService) { }

  OnLogout(){
      this._fullCarService.isServicesSet = false // for enable re-load all the info 
      
    this._userService.defaultUser();
    localStorage.clear();// with the exit of the user clear the storage (with the data of the cars he interesting on)
    CarsComponent.identifierForKey = 0; // for local storage uses
    this.route.navigateByUrl('/home');
    //localStorage.removeItem('token'); // remove the 'CARS YOU INTERSTING' from localStorage
  }

}