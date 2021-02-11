import { Component, OnInit } from '@angular/core';
import { UserService } from '../shared/services/user.service';
import { User } from '../shared/models/user.model';
import { FullCar } from '../shared/models/fullCar.model';
import { FullCarService } from '../shared/services/fullCar.service';
import { OrderStore } from '../shared/models/order-store.model';
import { Order } from '../shared/models/order.model';
import { UploadImageService } from '../shared/services/image.service';
import { OrderService } from '../shared/services/order.service';

@Component({
  selector: 'app-car-price',
  templateUrl: './car-price.component.html',
  styleUrls: ['./car-price.component.css']
})
export class CarPriceComponent implements OnInit {

  public user: User = new User();
  public currentCar: FullCar = new FullCar();
  public rentalStart: number;
  public rentalEnd: number;
  public finelPrice: number;
  public diffDays: number;
  public rentalStartInMs: number;
  public rentalEndInMs: number;
  public oneDayInMs: number = 24 * 60 * 60 * 1000; // 1 day in ms
  public inCorrectFdtMsg: string;
  public inCorrectSdtMsg: string;
  public currentDate: Date = new Date();
  public currentDateInMs: number = new Date(this.currentDate).valueOf();;
  public allOpenOrders: OrderStore = new OrderStore();
  public inValidOrderFdMsg: string;
  public inValidOrderSdMsg: string;

  constructor(private _userService: UserService, private _fullCarService: FullCarService, private _orderService: OrderService,
     private _imageService: UploadImageService) { } // _imageService for the default car pic in the html) { }

  ngOnInit() {
    this.setUser();
    this.currentCar = this._fullCarService.fullCar;
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
  
  numberOfDays(start: Date, end: Date) { // called from html

    this.diffDays = 1 + Math.round(Math.abs((new Date(this.rentalEnd).valueOf() - new Date(this.rentalStart).valueOf())) / this.oneDayInMs); // '1 +' = > בשביל חישוב גם את אותו היום שההשכרה מתחילה 

    this.finelPrice = this.currentCar.DayCost * this.diffDays;
  }

  dateValidation() {

    if (this.rentalStart || this.rentalEnd) {

      this.rentalStartInMs = new Date(this.rentalStart).valueOf();
      this.rentalEndInMs = new Date(this.rentalEnd).valueOf();

      if ((this.rentalStartInMs + this.oneDayInMs) < this.currentDateInMs && this.rentalStart) { // to able chooseing date from today
        this.inCorrectFdtMsg = "error: must be correct date (today and on)!";
        this.rentalStart = null;
      }
      else if ((this.rentalStartInMs + this.oneDayInMs) > this.rentalEndInMs && this.rentalEnd) { // atlist one day rental
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

    if (this.allOpenOrders.orderList) // do the for loop only when ther's orders for this car
      for (let x of this.allOpenOrders.orderList) {

        console.log("%c from car price: x.RentalStart.toISOString().split('T')[0] " + new Date(x.RentalStart).toISOString().split('T')[0],'background: green' )

        let orderRentalStartInMs: number = new Date(x.RentalStart).valueOf();
        let orderRentalEndInMs: number = new Date(x.RentalEnd).valueOf();
        let oneDayFromStartInMs: number = orderRentalStartInMs + this.oneDayInMs; // for able to rent car until the first day that ordered 
        let oneDayFromEndInMs: number = orderRentalEndInMs + this.oneDayInMs; // for able to return car atlist one day after he's back

        if (this.rentalStart && !this.rentalEnd) {
          if (this.rentalStartInMs > orderRentalStartInMs && this.rentalStartInMs < orderRentalEndInMs
            || (this._orderService.isTheSameDay(this.currentDate, new Date(x.RentalStart)) && this.rentalStartInMs < orderRentalEndInMs)) {
            this.inValidOrderFdMsg = "error: invalid on this date!";
            this.rentalStart = null;
          }
          else {
            this.inValidOrderFdMsg = "";
          }
        }
        if (this.rentalEnd) {
          if (this.rentalEndInMs < oneDayFromEndInMs && this.rentalEndInMs > oneDayFromStartInMs && !this.rentalStart) {
            this.inValidOrderSdMsg = "error: invalid on this date!";
            this.rentalEnd = null;
          }
          else if((this.rentalEndInMs > orderRentalStartInMs && this.rentalEndInMs < orderRentalEndInMs)){
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

deActivateRouter(){ // return the state befote the child rout activate
  this._fullCarService.isInChildView = false;
}

}





