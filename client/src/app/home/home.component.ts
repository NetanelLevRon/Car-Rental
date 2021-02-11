import { Component, OnInit } from '@angular/core';
import { FullCarService } from '../shared/services/fullCar.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  private Logo: string = "../assets/images/CarRentalLogo.gif";
  private Store: string = "../assets/images/CarRentalStore.jpg";
  
  constructor(private _fullCarService: FullCarService, private activeRouter:ActivatedRoute) { }

  ngOnInit() {
    this.Logo = "../assets/images/CarRentalLogo.gif";
    this.Store = "../assets/images/CarRentalStore.jpg";
    if (!this._fullCarService.isServicesSet) // for loading cars only on the first initiate (and after 'admin' loguot)
    this._fullCarService.onInit(); // get the cars for load them at the start (it's the first landing page component)
  }

}