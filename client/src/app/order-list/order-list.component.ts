import { Component, OnInit } from '@angular/core';
import { OrderService } from '../shared/services/order.service';
import { UserService } from '../shared/services/user.service';
import { FullCarService } from '../shared/services/fullCar.service';
import { FullCar } from '../shared/models/fullCar.model';
import { User } from '../shared/models/user.model';
import { OrderStore } from '../shared/models/order-store.model';
import { Order } from '../shared/models/order.model';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit {

  public currentDate: Date = new Date();
  public user: User = new User();
  public currentCars: Array<FullCar> = new Array<FullCar>();
  public pastOrders: Array<FullCar> = new Array<FullCar>();
  public futureOrders: Array<FullCar> = new Array<FullCar>();
  public currentUserOreders: OrderStore = new OrderStore();
  private lengthForLoop: number;

  constructor(private _orderService: OrderService, private _userService: UserService,
    private _fullCarService: FullCarService) { }

  ngOnInit() {

    this.setUser();
    this.setOrdersCall();
    this.setUserOrdersInfo();
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
    }, 1000);
  }

  setOrdersCall(): Boolean {
    console.log("%c second", 'background: black; color: white');
    if (this._userService.user) {
      this.user = this._userService.user;
      if (this.user.UserID) {
        this._orderService.getOrdersByUserID(this.user.UserID, this.user.UserName, this.user.Password); // initialize userOrderInfo.orderList in Order Service with all current user orders
        return true;
      }
      else {
        setTimeout(() => {
          this.setOrdersCall();
        }, 1000);
      }
    }
    else {
      setTimeout(() => {
        this.setOrdersCall();
      }, 1000);
    }
  }

  setUserOrdersInfo() { // orders that belongs to the current user

    let i: number = 0;

    if (this._orderService.userOrderInfo.orderList[0]) {

      if (this._orderService.userOrderInfo.orderList[0].CarID) {
        this.currentUserOreders = this._orderService.userOrderInfo;

        for (let car of this._fullCarService.fullCarInfo.fullCarList) { // all cars

          for (let order of car.Orders) {

            if (this.user.UserID == order.UserID) { // the order is from the client (current user) orders

              this.currentCars[i] = new FullCar();
              this.currentCars[i].ManufacturerName = car.ManufacturerName;
              this.currentCars[i].Model = car.Model;
              this.currentCars[i].Image = car.Image;
              this.currentCars[i].Orders[0] = new Order();
              this.currentCars[i].Orders[0].RentalStart = order.RentalStart;
              this.currentCars[i].Orders[0].RentalEnd = order.RentalEnd;
              this.currentCars[i].Orders[0].ActualRentalEnd = order.ActualRentalEnd;
              this.currentCars[i].Orders[0].UserID = order.UserID;
              i++;
            }
          }

        }

      }
      else {
        setTimeout(() => {
          this.setUserOrdersInfo();
        }, 1000);
      }
    }
    else {
      setTimeout(() => {
        this.setUserOrdersInfo();
      }, 1000);
    }
    this.lengthForLoop = this.currentCars.length - 1
    this.setOrdersFromLastToNew();
  }

  setOrdersFromLastToNew() { // recursive function the sort the orders in increasing order by boble sort

    let tempCar: FullCar = new FullCar();

    for (let i = 0; i < this.lengthForLoop; i++) {

      if (new Date(this.currentCars[i].Orders[0].RentalStart).valueOf() >=
        new Date(this.currentCars[i + 1].Orders[0].RentalStart).valueOf()) {
        tempCar = this.currentCars[i];
        this.currentCars[i] = this.currentCars[i + 1];
        this.currentCars[i + 1] = tempCar;
      }
    }
    while (this.lengthForLoop > 0) {
      this.lengthForLoop -= 1;
      this.setOrdersFromLastToNew();
    }
    this.setOrdersToPastAndFuture();
  }

  setOrdersToPastAndFuture() { // classified the orders that sorted in the above, to past and futuere. for preview it in different section on the web page

    let j: number = 0;

    for (let i = 0; i < this.currentCars.length; i++) {

      if (new Date(this.currentCars[i].Orders[0].RentalStart).valueOf() < this.currentDate.valueOf()) {
        this.pastOrders[i] = this.currentCars[i];
      }
      else {
        this.futureOrders[j] = this.currentCars[i];
        j++;
      }
    }
  }

  pastCurrentCar(car: FullCar) { // delivered through service to car-price and car-order

    this._fullCarService.fullCar = car;
  }

}
