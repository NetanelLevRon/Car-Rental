import { Component, OnInit } from '@angular/core';
import { UserService } from '../shared/services/user.service';
import { User } from '../shared/models/user.model';
import { FullCarService } from '../shared/services/fullCar.service';
import { FullCarStore } from '../shared/models/fullCar-store.model';
import { FullCar } from '../shared/models/fullCar.model';
import { NgForm } from '@angular/forms';
import { Order } from '../shared/models/order.model';

@Component({
  templateUrl: './cars.component.html',
  styleUrls: ['./cars.component.css']
})
export class CarsComponent implements OnInit {

  public user: User = this._userService.user;
  public fullCarInfo: FullCarStore = new FullCarStore();
  public currentCar: FullCar = new FullCar();
  public carsUserInterested: FullCarStore = new FullCarStore();
  public filtersCars: FullCarStore;
  public clock: Date = new Date();
  public rentalStart: number;
  public rentalEnd: number;
  public currentDateInMs: number = new Date().valueOf();
  public oneDayInMs: number = 24 * 60 * 60 * 1000; // 1 day in ms
  public inCorrectFdtMsg: string;
  public inCorrectSdtMsg: string;
  public inValidOrderFdMsg: string;
  public inValidOrderSdMsg: string;


  /** used for idenfier every car by specific key to set and get item from local storage. static for keep increasing and not initialize with every entering to this component */
  public static identifierForKey: number = localStorage.length ? localStorage.length / 6 : 0; // 6 is the number of items on each object; 

  constructor(private _userService: UserService, private _fullCarService: FullCarService) { }

  ngOnInit() {
    
    this.setCarsInfo();

    if (localStorage.length != 0)
      this.getCarsFromLocalStorage();
  }

  setCarsInfo() {

    setTimeout(() => {
      if (this._fullCarService.fullCarInfo.fullCarList[0]) {

        if (this._fullCarService.fullCarInfo.fullCarList[0].DayCost) {

          // for preview all cars that exist remark this 'for' section and unmark the remark line below
          for (let x of this._fullCarService.fullCarInfo.fullCarList) {
            if (x.IsAvailable) {
              this.fullCarInfo.fullCarList.push(x);
            }
          }
          // this.fullCarInfo = this._fullCarService.fullCarInfo;
        }
        else {
          this.setCarsInfo();
        }
      }
      else {
        this.setCarsInfo();
      }

    }, 50)
  }

  OnSubmit(form: NgForm) {

    if ((form.value.rentalStart && !form.value.rentalEnd) || (form.value.rentalEnd && !form.value.rentalStart)) {
      // if you fill one date you must fill the other
      this.inCorrectFdtMsg = "you must fill date fields both or neither";
      this.inCorrectSdtMsg = "you must fill date fields both or neither";
      this.rentalStart = null;
      this.rentalEnd = null;
    }
    else {// בשני המקרים הנ ל זרוק הודעת שגיאה ואל תעשה דבר עד לתיקון אחרת תמשיך כרגיל

      let fullCar: FullCar = form.value;
      let transmissionTrue: string = "Auto"; // for free text search // manually because it is boolean
      let transmissionFalse: string = "Manual"; // for free text search

      if (form.value.Transmission == "undefined") { // for initial the chices
        fullCar.Transmission = undefined;
      }
      else if (form.value.Transmission == "Auto") { // convet to boolean
        fullCar.Transmission = true;
      }
      else if (form.value.Transmission == "Manual") { // convet to boolean
        fullCar.Transmission = false;
      }

      let freeText: string = form.value.FreeText ? form.value.FreeText.toLowerCase() : undefined;

      this.filtersCars = new FullCarStore(); // in this object the filtered cars inserted

      for (let x of this.fullCarInfo.fullCarList) { // all the cars that has

        let cheacker: number = 0; // if the value is empty or equal to one of the cars value.
        // in both cases count it. alse if there is value and it not match don't preview this car

        console.log(x);
        if (freeText != undefined) {

          if (x.ManufacturerName.toLowerCase().indexOf(freeText) != -1 ||
            x.Model.toLowerCase().indexOf(freeText) != -1 ||
            x.DayCost.toString().indexOf(freeText) != -1 ||
            x.DayLateCost.toString().indexOf(freeText) != -1 ||
            x.ManufacturerYear.toString().indexOf(freeText) != -1 ||
            x.BranchName.toLowerCase().indexOf(freeText) != -1 ||
            (transmissionTrue.toLowerCase().indexOf(freeText) != -1 && x.Transmission == true) ||
            (transmissionFalse.toLowerCase().indexOf(freeText) != -1 && x.Transmission == false)
          ) { // if so that's mean that the free text, inserting by the user, do match 
            // (not case sesative) to some text in the current car
            cheacker++;
          }
        }
        else if (freeText == undefined) {
          cheacker++;
        }

        console.log("fullCar.ManufacturerName: " + fullCar.ManufacturerName)
        if (fullCar.ManufacturerName != undefined && fullCar.ManufacturerName != "") {
          if (x.ManufacturerName.toLowerCase() == fullCar.ManufacturerName.toLowerCase()) {
            console.log("true");
            cheacker++;
          }
        }
        else if (fullCar.ManufacturerName == "" || fullCar.ManufacturerName == undefined) {
          console.log("true");
          cheacker++;
        }

        console.log("fullCar.Model: " + fullCar.Model)
        if (fullCar.Model != undefined && fullCar.Model != "") {
          if (x.Model.toLowerCase() == fullCar.Model.toLowerCase()) {
            console.log("true");
            cheacker++;
          }
        }
        else if (fullCar.Model == "" || fullCar.Model == undefined) {
          console.log("true");
          cheacker++;
        }

        console.log("fullCar.ManufacturerYear: " + fullCar.ManufacturerYear)
        if (x.ManufacturerYear == fullCar.ManufacturerYear) {
          console.log("true");
          cheacker++;
        }
        else if (fullCar.ManufacturerYear == undefined) {
          console.log("true");
          cheacker++;
        }

        console.log("fullCar.Transmission: " + fullCar.Transmission)
        if (x.Transmission == fullCar.Transmission) {
          console.log("true");
          cheacker++;
        }
        else if (fullCar.Transmission == undefined) {
          console.log("true");
          cheacker++;
        }

        console.log(cheacker);

        if (cheacker == 5) { // if it equal to the number of search filds (5 in this case) the car in this iteration previwe
          if (this.rentalStart != undefined) { // meen that the user insert dates
            if (x.Orders[0].RentalStart != undefined) {
              if (this.orderValidation(x.Orders)) {//אם כן true פונקציה שבודקת אם הרכב פנוי בתאריכם הנ"ל ומחזירה 
                this.filtersCars.fullCarList.push(x)
              }
            }
          }
          else {
            console.log("%c on this case it is lass than 5: ", 'background: yellow')
            this.filtersCars.fullCarList.push(x)
          }
        }
        console.log(this.filtersCars.fullCarList);
        console.log(form.value);
      }
    }
  }
  
  deActivateRouter(){ // return the state befote the child rout activate
    this._fullCarService.isInChildView = false;
  }

  pastCurrentCar(car: FullCar) { // delivered through the service to car-price and car-order and preview it insted of the cars preview section
    this._fullCarService.fullCar = car;
    this._fullCarService.isInChildView = true;
  }

  dateValidation() { // operate when date first insert

    let rentalStartInMs = new Date(this.rentalStart).valueOf();
    let rentalEndInMs = new Date(this.rentalEnd).valueOf();

    if (this.rentalStart || this.rentalEnd) { // soon as date initialize valid it for 1: if grater than today
      // 2: if end date grater than the start

      if ((rentalStartInMs + this.oneDayInMs) < this.currentDateInMs && this.rentalStart) { // to able chooseing date from today
        this.inCorrectFdtMsg = "error: must be correct date (today and on)!";
        this.rentalStart = null;
      }
      else if ((rentalStartInMs + this.oneDayInMs) > rentalEndInMs && this.rentalEnd) { // atlist one day rental
        this.inCorrectSdtMsg = "error: must be grater than the start date!";
        this.rentalEnd = null;
        this.inCorrectFdtMsg = "";
      }
      else {
        this.inCorrectSdtMsg = "";
        this.inCorrectFdtMsg = "";
      }

      if ((rentalEndInMs + this.oneDayInMs) < this.currentDateInMs && this.rentalEnd) {
        this.inCorrectSdtMsg = "error: must be grater than today!";
        this.rentalEnd = null;
      }

    }
  }

  orderValidation(carOrders: Array<Order>): boolean { // operate after search butten been push // check if valid on the given dates

    for (let o of carOrders) {

      if (this.currentDateInMs < new Date(o.RentalEnd).valueOf()) { // בדיקת זמינות רק לתאריכים עתידיים -> מה שרלוונטי

        let rentalStartInMs = new Date(this.rentalStart).valueOf(); // date that the user insert
        let rentalEndInMs = new Date(this.rentalEnd).valueOf(); // date that the user insert

        let orderRentalStartInMs: number = new Date(o.RentalStart).valueOf(); // date in the car/s that fits the filtering
        let orderRentalEndInMs: number = new Date(o.RentalEnd).valueOf(); // date in the car/s that fits the filtering

        if (rentalStartInMs > orderRentalStartInMs && rentalStartInMs < orderRentalEndInMs) {
          return false;
        }
        if (rentalEndInMs < orderRentalEndInMs && rentalEndInMs > orderRentalEndInMs) {
          return false;
        }
      }
    }
    return true;
  }
  /* ---------------------------- LocalStorage - section -----------------------------------  */
  setCarsToLocalStorage(car: FullCar) {

    let isAlreadyInStorage: boolean = false;

    for (let i = 0; i <= CarsComponent.identifierForKey; i++) {
      if (car.CarID.toString() == localStorage.getItem(i.toString() + "Id")) {
        isAlreadyInStorage = true
      }
    }

    if (isAlreadyInStorage == false) {
      localStorage.setItem(CarsComponent.identifierForKey.toString() + "Manufacturer", car.ManufacturerName);
      localStorage.setItem(CarsComponent.identifierForKey.toString() + "Model", car.Model);
      localStorage.setItem(CarsComponent.identifierForKey.toString() + "Year", car.ManufacturerYear.toString());
      localStorage.setItem(CarsComponent.identifierForKey.toString() + "Transmission", car.Transmission.toString());
      localStorage.setItem(CarsComponent.identifierForKey.toString() + "Image", car.Image);
      localStorage.setItem(CarsComponent.identifierForKey.toString() + "Id", car.CarID.toString());

      this.getCarsFromLocalStorage(CarsComponent.identifierForKey.toString());
      
      CarsComponent.identifierForKey++;

    }
    //   localStorage.clear();
  }

  getCarsFromLocalStorage(place?: string) {

    if(place){
        let car: FullCar = new FullCar();
        car.ManufacturerName = localStorage.getItem(place + "Manufacturer"); // string
        car.Model = localStorage.getItem(place + "Model"); // string
        car.ManufacturerYear = parseInt(localStorage.getItem(place + "Year")); // number
        car.Transmission = localStorage.getItem(place + "Transmission").indexOf('Auto') != -1 ? true : false; // string
        car.Image = localStorage.getItem(place + "Image"); // string
        this.carsUserInterested.fullCarList.push(car);
    }
    else{
      for (let i = 0; i < CarsComponent.identifierForKey; i++) {
        let car: FullCar = new FullCar();
        car.ManufacturerName = localStorage.getItem(i.toString() + "Manufacturer"); // string
        car.Model = localStorage.getItem(i.toString() + "Model"); // string
        car.ManufacturerYear = parseInt(localStorage.getItem(i.toString() + "Year")); // number
        car.Transmission = localStorage.getItem(i.toString() + "Transmission").indexOf('Auto') != -1 ? true : false; // string
        car.Image = localStorage.getItem(i.toString() + "Image"); // string
        this.carsUserInterested.fullCarList.push(car);
      }
    }
  }

}