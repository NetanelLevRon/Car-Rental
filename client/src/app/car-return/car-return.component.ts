import { Component, OnInit } from '@angular/core';
import { OrderService } from '../shared/services/order.service';
import { Car } from '../shared/models/car.model';
import { CarService } from '../shared/services/car.service';
import { Order } from '../shared/models/order.model';
import { CarType } from '../shared/models/carType.model';
import { CarTypeService } from '../shared/services/carType.service';
import { User } from '../shared/models/user.model';
import { UserService } from '../shared/services/user.service';

@Component({
  templateUrl: './car-return.component.html',
  styleUrls: ['./car-return.component.css']
})
export class CarReturnComponent implements OnInit {

  public carLicense: string;
  public errMsg: string; // used on html
  public car: Car = new Car();
  public currentUser: User = new User();
  public order: Order = new Order();
  public carType: CarType = new CarType();
  public finelPrice: number; // used on html
  public callbackMsg: string;

  constructor(private _orderService: OrderService, private _carService: CarService,
    private _carTypeService: CarTypeService, private _userService: UserService) { }

  ngOnInit() {
    this.currentUser = this._userService.user;
  }

  getCarByLicense() {

    if (this.carLicense) {

      let cheakIfNum: number = Number(this.carLicense); // input from client

      if (isNaN(cheakIfNum)) {
        this.errMsg = "please insert only numbers";
        this.carLicense = "";
      }
      else if ((this.carLicense.length != 8 && this.carLicense.length != 7)) {
        this.errMsg = "please insert 7 or 8 digits number";
        this.carLicense = "";
      }
      else {
        this._carService.getCarByLicensePlate(this.carLicense, this.currentUser.UserName, this.currentUser.Password);
        this.setCar();
      }
    }
  }

  setCar() {

    console.log("%c in setCar", 'background: red; color: silver')

    setTimeout(() => {

      if (this._carService.car) {
        if (this._carService.car.LicensePlate == this.carLicense) {
          this.car = this._carService.car;

          console.log("%c this._carService.car.CarID: " + this._carService.car.CarID, 'background: red; color: silver')

          this._orderService.getOrderByCarId(this.car.CarID, this.currentUser.UserName, this.currentUser.Password);
          this.carType = this._carTypeService.getCarType(this.car.CarID, this.currentUser.UserName, this.currentUser.Password);
          this.setOrder();
          if (this.callbackMsg != "action fail") {
            this.setCarTypeAndCal(); // last => for sending order to, for calculate finle price 
          }
          else {
            this.errMsg = "faild load resource to the server";
          }
        }
        else {
          this.setCar();
        }
        this._carService.car = new Car(); // prevent repited car
      }
      else if (this._carService.car == undefined && this._carService.errMsg[0] == undefined) { // not reched from service yet
        this.setCar();
      }
      else if (this._carService.errMsg[0]) {
        this.errMsg = this._carService.errMsg[0] == "Bad Request" ? "error: the license plate number dose not exist!" : this._carService.errMsg[0];
        this._carService.errMsg = new Array<string>(); // prevent repited err
      }
    }, 1000)
  }

  setOrder() {

    let callback = (bool: boolean) => { this.callbackMsg = bool ? "action success" : "action fail"; };

    setTimeout(() => {
      if (this._orderService.order) {
        if (this._orderService.order.OrderID != undefined) {

          this.order = this._orderService.order;
          this.order.ActualRentalEnd = new Date();
          this._orderService.editOrder(this.order, this.order.OrderID, callback, this.currentUser.UserName, this.currentUser.Password);
          if (this.callbackMsg == "action success") {
            this.errMsg = "";
          }
          else {
            this.setOrder();
          }
        }
        else {
          this.setCar();
        }
      }
      else { // repit it until it will reached from server
        this.setOrder();
      }
    }, 1000)
  }

  setCarTypeAndCal() {

    setTimeout(() => {
      if (this.carType.DayCost) {
        this.calculateFinleCost(this.order, this.carType);
      }
      else {
        this.setCarTypeAndCal();
      }
    }, 1000)
  }

  calculateFinleCost(order: Order, currentCar: CarType) {

    if (order) {
      let rentalStartInMs: number = new Date(order.RentalStart).valueOf();
      let rentalEndtInMs: number = new Date(order.RentalEnd).valueOf();
      let currentDay: number = new Date().valueOf();
      let oneDayInMs: number = 60 * 60 * 24 * 1000;
      let diffDays: number = 1 + Math.round(Math.abs((rentalStartInMs - rentalEndtInMs)) / oneDayInMs); // '1 +' => בשביל חישוב גם את אותו היום שההשכרה מתחילה 
      let priceForRegularDays: number = diffDays * currentCar.DayCost; // price for regular rent daye
      let priceForLateDays: number = (Math.round(Math.abs((rentalEndtInMs - currentDay)) / oneDayInMs) - 1) * currentCar.DayLateCost; // '-1' => because the last day rental ends count as regular price

      this.finelPrice = priceForLateDays > 0 ? priceForLateDays + priceForRegularDays : priceForRegularDays;
    }
  }

}