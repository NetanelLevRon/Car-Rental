import { Component, OnInit } from '@angular/core';
import { FullCar } from '../shared/models/fullCar.model';
import { FullCarService } from '../shared/services/fullCar.service';
import { UserService } from '../shared/services/user.service';
import { User } from '../shared/models/user.model';
import { OrderService } from '../shared/services/order.service';
import { Order } from '../shared/models/order.model';
import { CarService } from '../shared/services/car.service';
import { OrderStore } from '../shared/models/order-store.model';
import { Car } from '../shared/models/car.model';

@Component({
  selector: 'app-car-order',
  templateUrl: './car-order.component.html',
  styleUrls: ['./car-order.component.css']
})
export class CarOrderComponent implements OnInit {

  public user: User = new User();
  public currentCar: FullCar = new FullCar();
  public rentalStart: number;
  public rentalEnd: number;
  public finelPrice: number; // for the html
  public dayLateCost: number; // for the html
  public finlePriceEndDayLate: string = "Finle price:"; // for the html
  public rentalStartInMs: number;
  public rentalEndInMs: number;
  public oneDayInMs: number = 24 * 60 * 60 * 1000; // 1 day in ms
  public inCorrectFdtMsg: string; // for the html
  public inCorrectSdtMsg: string; // for the html
  public currentDate: Date = new Date();
  public currentDateInMs: number = new Date(this.currentDate).valueOf();
  public order: Order = new Order();
  public actionMsg: string = "NOT APPROVE YET";
  public actionMsgForUpdateCar: string; // for the html
  public allOpenOrders: OrderStore = new OrderStore();
  public inValidOrderFdMsg: string; // for first date input
  public inValidOrderSdMsg: string; // for second date input
  public car: Car = new Car();
  public userOrders: OrderStore;

  constructor(private _userService: UserService, private _fullCarService: FullCarService,
    private _orderService: OrderService, private _carService: CarService) { }

  ngOnInit() {
    this.setUser();
    this.currentCar = this._fullCarService.fullCar; // the current car that preview. delivered through 'fullCarService' when choose car's card
    this.insertRelevantOrders();
  }

  /**
    * set the user for gurds and for authorization
    */
  setUser() {
    setTimeout(() => {
      if (this._userService.user.UserRole != undefined) {
        this.user = this._userService.user;
      }
      else {
        this._userService.defaultUser();
        this.setUser();
      };
    }, 50);
  }

  /** 
  * get the current car from car service for edit with the new order
  */
  setCar() { // (the 'currentCar' is from type 'fullCar')  
    console.log("%c in setCar() this.order.CarID = " + this.order.CarID + "\nthis.user.UserName: " + this.user.UserName + "\nthis.user.Password: " + this.user.Password, 'background: pink');

    this._carService.getCar(this.order.CarID, this.user.UserName, this.user.Password);

    setTimeout(() => {
      if (this._carService.car.CurrentMileage) { // if the car return from the server
        if (this._carService.car.CarID == this.order.CarID) { // if the car arrive
          this.car = this._carService.car;
          if (this._orderService.isTheSameDay(this.currentDate, new Date(this.rentalStart))) { // if the order start from now set it as not available otherwise it will be done automatically when the date arrive (in fullCar service line 179), and so when the the rental will over (if not the eployee return it manually)
            this.currentCar.IsAvailable = false; // type 'fullCar' => for preview to the user
            this.car.IsAvailable = false; // type 'Car' => for edit and update in server
          }
        }
        else {
          this.setCar();
        }
      }
      else {
        this.setCar();
      }
    }, 1000)
  }

  makeOrder() { // add the order to db trough server and to all the relevant places. called when user executing order (click)

    this._orderService.userOrderInfo = new OrderStore(); // for avoiding repited order
    this.actionMsg = "NOT APPROVE YET";  // for avoiding repited order
    let callback = (bool: boolean) => { this.actionMsg = (bool) ? "action success" : "action fail"; }
    let callbackForUpdateCar = (bool: boolean) => { this.actionMsgForUpdateCar = (bool) ? "out of available list" : "action fail"; }
    let curentOrder: Array<Order> = new Array<Order>();

    this.order.UserID = this.user.UserID;
    this.order.CarID = this.currentCar.CarID;
    this.order.RentalStart = new Date(this.rentalStart);
    this.order.RentalEnd = new Date(this.rentalEnd);

    this._orderService.addOrder(this.order, callback, this.user.UserName, this.user.Password);
    this.getCurrentOrderAndSetToPreview(curentOrder, callbackForUpdateCar); // get the inserted order (by 'addOrder') from server and set for preview

  }

  getCurrentOrderAndSetToPreview(curentOrder: Order[], callbackForUpdateCar: (bool: boolean) => void) {
    setTimeout(() => { // 'getOrdersByUserID' for get the dates from server with the format that return (it's different format than the sended one and couse problems in the validation of the invalid dates)

      this.userOrders = new OrderStore();
      this.userOrders.orderList = new Array<Order>();
      this.userOrders.orderList = this._orderService.getOrdersByUserID(this.user.UserID, this.user.UserName, this.user.Password);

      if (this.userOrders.orderList[0]) {
        if (this.userOrders.orderList[0].RentalEnd) {
          let index: number = (this.userOrders.orderList.length - 1); // the last order (the current order that inserted)
          curentOrder[0] = new Order();
          curentOrder[0].RentalStart = this.userOrders.orderList[index].RentalStart;
          curentOrder[0].RentalEnd = this.userOrders.orderList[index].RentalEnd;
          curentOrder[0].CarID = this.userOrders.orderList[index].CarID;
          curentOrder[0].UserID = this.userOrders.orderList[index].UserID;
          curentOrder[0].OrderID = this.userOrders.orderList[index].OrderID;

          this.setCar();

          if (this.car.CarID == this.currentCar.CarID) {
            this._carService.editCar(this.car, this.car.CarID, callbackForUpdateCar);
          }
          this.setOrdersToPreview(curentOrder);
        }
        else {
          this.getCurrentOrderAndSetToPreview(curentOrder, callbackForUpdateCar);
        }
      }
      else {
        this.getCurrentOrderAndSetToPreview(curentOrder, callbackForUpdateCar);
      }
    }, 1000);
  }

  setOrdersToPreview(curentOrdersArr: Array<Order>) {

    console.log("%c in setOrdersToPreview ", 'background: pink; color: black;');

    setTimeout(() => {
      if (this.actionMsg == "action success") {

        this.currentCar = this._fullCarService.fullCar;

        for (let i: number = 0; i < this._fullCarService.fullCarInfo.fullCarList.length; i++) {

          if (this.car.CarID == this._fullCarService.fullCarInfo.fullCarList[i].CarID) {
            this._fullCarService.setAvailabilityCarsInDB(this.car, this._fullCarService.fullCarInfo.fullCarList[i]); // if the current order starts from now set it as not available
            this._fullCarService.fullCarInfo.fullCarList[i].Orders.push(curentOrdersArr[0]);
            this._fullCarService.fullCar = this._fullCarService.fullCarInfo.fullCarList[i];
            this.currentCar = this._fullCarService.fullCar;
          }
        }

        this.insertRelevantOrders();
        this.rentalStart = null;
        this.rentalEnd = null;
      }
      else if (this.actionMsg == "NOT APPROVE YET") {
        this.setOrdersToPreview(curentOrdersArr);
      }
    }, 1000)
  }

  /**
* insert to 'allOpenOrders' all the current and future order dates of the current car that now preview. for preview these dates to the user and not allow him to select one of these dates. 
*/
  insertRelevantOrders() {

    console.log("%c in insertRelevantOrders", 'background: pink; color: green')

    let i: number = 0;
    for (let order of this.currentCar.Orders) {
      if (order != undefined) {
        if (this.currentDateInMs < new Date(order.RentalEnd).valueOf()) { // if it's current or future order (relevant to preview and validate)
          this.allOpenOrders.orderList[i] = new Order();
          this.allOpenOrders.orderList[i].RentalStart = order.RentalStart;
          this.allOpenOrders.orderList[i].RentalEnd = order.RentalEnd;
          i++;
        }
      }
    }
  }

  /**
   * get the number of days of the current rental, for calculate the finel cost
   */
  numberOfDays() {

    let diffDays: number;
    let oneDay: number = 24 * 60 * 60 * 1000; // 1 day in ms

    diffDays = 1 + Math.round(Math.abs((new Date(this.rentalEnd).valueOf() - new Date(this.rentalStart).valueOf())) / oneDay); // '1 +' = > for calculate the start rental day too

    this.finelPrice = this.currentCar.DayCost * diffDays;

    this.dayLateCost = this.currentCar.DayLateCost;
  }

  dateValidation() {

    if (this.rentalStart && this.rentalEnd) {
      this.numberOfDays(); // for preview the calculate cost to the client
    }

    if (this.rentalStart || this.rentalEnd) {

      this.rentalStartInMs = new Date(this.rentalStart).valueOf();
      this.rentalEndInMs = new Date(this.rentalEnd).valueOf();
      //this.currentDateInMs = new Date(this.currentDate).valueOf();

      if ((this.rentalStartInMs + this.oneDayInMs) < this.currentDateInMs && this.rentalStart) { // to unable choose past date
        this.inCorrectFdtMsg = "error: must be correct date (today and on)!";
        this.rentalStart = null;
      }
      else if ((this.rentalStartInMs + this.oneDayInMs) > this.rentalEndInMs && this.rentalEnd) { // (atlist one day of rental)
        this.inCorrectSdtMsg = "error: must be grater than the start date!";
        this.rentalEnd = null;
        this.inCorrectFdtMsg = "";
      }
      else {
        this.inCorrectSdtMsg = "";
        this.inCorrectFdtMsg = "";
      }

      if ((this.rentalEndInMs + this.oneDayInMs) < this.currentDateInMs && this.rentalEnd) {
        this.inCorrectSdtMsg = "error: must be grater than today!";
        this.rentalEnd = null;
      }

    }

    if (this.allOpenOrders.orderList) { // if ther's orders for this car
      this.validateOnFutureOrders();
    }

  }

  /**
   * for unable select date that this car alredy ordered
   */
  validateOnFutureOrders() {
    for (let x of this.allOpenOrders.orderList) {
      console.log("%c after: x = " + x, 'background: black; color: white')
      let orderRentalStartInMs: number = new Date(x.RentalStart).valueOf();
      let orderRentalEndInMs: number = new Date(x.RentalEnd).valueOf();
      let oneDayFromStartInMs: number = orderRentalStartInMs + this.oneDayInMs; // for able to rent car until the first day that ordered 
      let oneDayFromEndInMs: number = orderRentalEndInMs + this.oneDayInMs; // for able to return car atlist one day after his back

      if (this.rentalStart && !this.rentalEnd) {
        if ((this.rentalStartInMs > orderRentalStartInMs && this.rentalStartInMs < orderRentalEndInMs)
          || (this._orderService.isTheSameDay(this.currentDate, new Date(x.RentalStart)) && this.rentalStartInMs < orderRentalEndInMs)) {
          this.inValidOrderFdMsg = "error: invalid on this date!";
          console.log("%c after erroe: ", 'background: black; color: white')
          this.rentalStart = null;
        }
        else {
          this.inValidOrderFdMsg = "";
        }
      }

      if (this.rentalEnd) {
        if (this.rentalEndInMs < oneDayFromEndInMs && this.rentalEndInMs > oneDayFromStartInMs && !this.rentalStart
        ) {
          this.inValidOrderSdMsg = "error: invalid on this date!";
          this.rentalEnd = null;
        }
        else if ((this.rentalEndInMs > orderRentalStartInMs && this.rentalEndInMs < orderRentalEndInMs)) {
          this.inValidOrderSdMsg = "error: invalid on this date!";
          this.rentalEnd = null;
        }
        else {
          this.inValidOrderSdMsg = "";
        }
      }

      if (this.rentalEnd && this.rentalStart) {
        if (this.rentalStartInMs > orderRentalStartInMs && this.rentalStartInMs < orderRentalEndInMs
          || (this._orderService.isTheSameDay(this.currentDate, new Date(x.RentalStart)) && this.rentalStartInMs < orderRentalEndInMs)) {
          this.inValidOrderSdMsg = "error: invalid on this date!";
          this.inValidOrderFdMsg = "error: invalid on this date!";
          this.rentalEnd = null;
          this.rentalStart = null;
        }
        else if (this.rentalEndInMs > oneDayFromStartInMs && this.rentalEndInMs < orderRentalEndInMs) {
          this.inValidOrderSdMsg = "error: invalid on this date!";
          this.inValidOrderFdMsg = "error: invalid on this date!";
          this.rentalEnd = null;
          this.rentalStart = null;
        }
        else if (this.rentalStartInMs < orderRentalStartInMs && this.rentalEndInMs > oneDayFromStartInMs) {
          this.inValidOrderSdMsg = "error: invalid on this date!";
          this.inValidOrderFdMsg = "error: invalid on this date!";
          this.rentalEnd = null;
          this.rentalStart = null;
        }
        else {
          this.inValidOrderFdMsg = "";
          this.inValidOrderSdMsg = "";
        }
      }
    }
  }

  deActivateRouter(){ // return the state befote the child rout activate
    this._fullCarService.isInChildView = false;
  }

}