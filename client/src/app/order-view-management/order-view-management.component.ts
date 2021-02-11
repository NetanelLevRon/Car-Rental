import { Component, OnInit } from '@angular/core';
import { OrderStore } from '../shared/models/order-store.model';
import { OrderService } from '../shared/services/order.service';
import { Order } from '../shared/models/order.model';
import { UserService } from '../shared/services/user.service';
import { User } from '../shared/models/user.model';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-order-view-management',
  templateUrl: './order-view-management.component.html',
  styleUrls: ['./order-view-management.component.css']
})
export class OrderViewManagementComponent implements OnInit {

  public orders: OrderStore = new OrderStore();
  public user: User = new User();
  public orderId: number;
  public editOrder: Order = new Order();
  public rentalStartErrMsg: string;
  public rentalEndErrMsg: string;
  public actualRentalEndErrMsg: string;
  public actionMsg: string;
  public idForActionMsg: number;
  public isSuccess: boolean;
  public idForErr: number;
  public rentalStartInMs: number;
  public rentalEndInMs: number;
  public actualRentalEndInMs: number;
  public oneDayInMs: number = 24 * 60 * 60 * 1000; // 1 day in ms
  public filtersOrders: OrderStore;
  public form: NgForm; // for after delete

  /* -------- varibles for edit ---------------- */

  public rentalStart: Date = new Date();
  public rentalEnd: Date = new Date();
  public actualRentalEnd: Date = new Date();

  /* -------- varibles for filter ---------------- */

  public RentalStart: number;
  public RentalEnd: number;
  public ActualRentalEnd: number;
  public FreeText: string;

  constructor(private _ordersService: OrderService, private _userService: UserService) { }

  ngOnInit() {

    this.setUser();
    this.isSuccess = false; // after adit it call "getOrder" and set to true for prevent calling the function twice
    this._ordersService.order = new Order(); //Initial it for every singel edding. because i use it to chack
    // if the order allready back from server and it can contain the last data (of the former edit)
    this.setOrdersInfo();  // set insert the info with the relevant format. call it until it arrive

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

  setOrdersInfo() {

    this.orders.orderList = this._ordersService.getOrders();
    let index: number = 0;
    let tempDay: number;

    if (this.orders.orderList[0]) {
      if (this.orders.orderList[0].OrderID) {

        for (let x of this.orders.orderList) {
          console.log("%c befor ISO: " + this.orders.orderList[index].RentalStart, 'background: black; color: white;')
          tempDay = new Date(x.RentalStart).getUTCDate() + 1;
          x.RentalStart = new Date(x.RentalStart).setUTCDate(tempDay);
          tempDay = new Date(x.RentalEnd).getUTCDate() + 1;
          x.RentalEnd = new Date(x.RentalEnd).setUTCDate(tempDay);
          tempDay = new Date(x.ActualRentalEnd).getUTCDate() + 1;
          x.ActualRentalEnd = x.ActualRentalEnd ? new Date(x.ActualRentalEnd).setUTCDate(tempDay) : x.ActualRentalEnd;
          this.orders.orderList[index].RentalStart = new Date(x.RentalStart).toISOString().split('T')[0];
          this.orders.orderList[index].RentalEnd = new Date(x.RentalEnd).toISOString().split('T')[0];
          this.orders.orderList[index].ActualRentalEnd = x.ActualRentalEnd ? new Date(x.ActualRentalEnd).toISOString().split('T')[0] : null;
          console.log("%c after ISO: " + this.orders.orderList[index].RentalStart, 'background: black; color: white;')
          index++;
        }
      }
      else {
        setTimeout(() => {
          this.setOrdersInfo();
        }, 1000);
      }
    }
    else {
      setTimeout(() => {
        this.setOrdersInfo();
      }, 1000);
    }

  }

  edit(from: string, order?: Order) { // set the varible from the html

    if (from == "editBtn") {

      this.rentalStart = order.RentalStart;
      this.rentalEnd = order.RentalEnd;
      this.actualRentalEnd = order.ActualRentalEnd;

      this.orderId = order.OrderID;
    }
    if (from == "backBtn") {
      this.orderId = null;
      this.rentalStartErrMsg = "";
      this.rentalEndErrMsg = "";
      this.actualRentalEndErrMsg = "";
      this.actionMsg = "";
    }
  }

  OnSubmit(order: Order) {

    let errorMsg: string;
    let callback = (bool: boolean) => { this.actionMsg = (bool) ? "action success" : "action fail"; }
    this.rentalStartInMs = new Date(this.rentalStart).valueOf();
    this.rentalEndInMs = new Date(this.rentalEnd).valueOf();
    this.actualRentalEndInMs = new Date(this.actualRentalEnd).valueOf();

    /*  ----------------------------- validation ------------------------------ */

    if (!this.rentalStart || !this.rentalEnd) {
      this.idForErr = order.OrderID; // for previewing the err msg only in the current card

      if (!this.rentalStart) {
        this.rentalStartErrMsg = "required filed!";
      }

      if (!this.rentalEnd) {
        this.rentalEndErrMsg = "required filed!";
      }

      this.rentalStart = order.RentalStart;
      this.rentalEnd = order.RentalEnd;
    }
    else if ((this.rentalStartInMs + this.oneDayInMs) > this.rentalEndInMs && this.rentalEnd) { // atlist one day rental
      this.idForErr = order.OrderID; // for previewing the err msg only in the current card
      this.rentalEndErrMsg = "error: must be grater than the start date!";
      this.rentalEnd = order.RentalEnd;
      this.rentalStartErrMsg = "";
    }
    else {
      this.rentalStartErrMsg = "";
      this.idForErr = undefined;
      this.rentalEndErrMsg = "";
    }

    if (this.actualRentalEndInMs) {
      if (this.actualRentalEndInMs < this.rentalStartInMs) {
        this.idForErr = order.OrderID;
        this.actualRentalEndErrMsg = "error! can not be lass than start date!";
      }
      else {
        this.actualRentalEndErrMsg = "";
        this.idForErr = undefined;
      }
    }
    /*  ----------------------------- validation ------------------------------ */

    if (!this.actualRentalEndErrMsg && !this.rentalEndErrMsg && !this.rentalStartErrMsg) {

      this.editOrder = order;
      this.editOrder.RentalStart = this.rentalStart;
      this.editOrder.RentalEnd = this.rentalEnd;
      this.editOrder.ActualRentalEnd = this.actualRentalEnd;

      console.log("%c RentalStart: " + order.RentalStart + "\nRentalEnd: " + order.RentalEnd + "\nActualRentalEnd: " + order.ActualRentalEnd, 'background: yellow;')

      this._ordersService.editOrder(this.editOrder, this.editOrder.OrderID, callback, this.user.UserName, this.user.Password);

      this.afterOrderEdited(order.OrderID);
    }

  }

  afterOrderEdited(id: number) {

    let index: number = 0;
    this.idForActionMsg = id;

    if (this.actionMsg != "action fail") {
      if (!this.isSuccess) // don't repit "getOrder" function twice
        this._ordersService.getOrder(id, this.user.UserName, this.user.Password);

      if (this._ordersService.order) {
        if (this._ordersService.order.RentalStart) {
          for (let x of this.orders.orderList) {
            if (x.OrderID == id) {
              this.orders.orderList[index] = this._ordersService.order;
              this.ngOnInit();
              break;
            }
            index++;
          }
        }
        else {
          setTimeout(() => {
            this.isSuccess = true; // actionMsg = "action success"
            this.afterOrderEdited(id);
          }, 1000);
        }
      }
    }
    else {
      setTimeout(() => {
        this.afterOrderEdited(id);
        console.log("before 'action success' RentalStart: " + this._ordersService.order.RentalStart)
      }, 1000);
    }

  }

  delete(order: Order) {
    if (confirm("are you sure want delete this order?")) {

      let ifSuccess: boolean;
      let index: number = 0;

      console.log("%c this.user.UserName: " + this.user.UserName + "\n this.user.UserRole" + this.user.UserRole, 'background: purple')
      this._ordersService.deleteOrder(order.OrderID, this.user.UserName, this.user.Password).subscribe(() => {
        ifSuccess = true;
        console.log("deleted seccessfuly!")
      }, (err) => { ifSuccess = false; console.log(err) },
        () => {

          if (ifSuccess) {
            for (let x of this.orders.orderList) {
              if (x.OrderID == order.OrderID) {
                this._ordersService.orderInfo.orderList.splice(index, 1);
                if (this.form) { // if the preview is fitered
                  this.orders.orderList.splice(index, 1);
                  this.filterOrders(this.form);
                  this.form = null;
                }
                this.ngOnInit();
                break;
              }
              index++;
            }
          }

        });
    }
  }

  filterOrders(form: NgForm) {

    this.form = form; // for after delete

    console.log("%c in filterCars", 'background:green')

    if (this.RentalStart || this.RentalEnd || this.ActualRentalEnd || this.FreeText) {

      let order: Order = form.value;

      order.RentalStart = this.RentalStart;
      order.RentalEnd = this.RentalEnd;
      order.ActualRentalEnd = this.ActualRentalEnd;

      let freeText: string = form.value.FreeText ? form.value.FreeText : undefined; // 

      if ((freeText && freeText.indexOf("/") != -1)) { // for searching purposes: this.RentalStart is in format of yyyy-mm-dd and preview as dd/mm/yyyy so the serch is also in dd/mm/yyyy format as it presented to the client 
        let day: string = freeText.split("/")[0] ? freeText.split("/")[0] : "";
        let month: string = freeText.split("/")[1] ? freeText.split("/")[1] : "";
        let year: string = freeText.split("/")[2] ? freeText.split("/")[2] : "";

        if (day != "" && month != "" && year != "") {
          freeText = year + "-" + month + "-" + day;
        } // if not contain year it dose not metter because in any case there is '-' (or '/' in our case) after month
        else if (day != "") {
          freeText = month + "-" + day;
        }
      }

      this.filtersOrders = new OrderStore(); // in this object the filtered cars inserted

      for (let x of this.orders.orderList) { // all the cars that has

        let cheacker: number = 0; // if the value is empty or equal to one of the cars value.
        // in both cases count it. alse if there is value and it not match don't preview this car

        console.log(x);
        if (freeText != undefined) {
          console.log("%c free text: " + freeText, 'background: red; color: white')
          console.log("%c x.RentalStart.toString(): " + x.RentalStart.toString(), 'background: red; color: white')
          if ((x.RentalStart && x.RentalStart.toString().indexOf(freeText) != -1) ||
            (x.RentalEnd && x.RentalEnd.toString().indexOf(freeText) != -1) ||
            (x.ActualRentalEnd && x.ActualRentalEnd.toString().indexOf(freeText) != -1)
          ) { // if so that's mean that the free text, inserting by the user, do match 
            // (not case sesative) to some text in the current car
            cheacker++;
          }
        }
        else if (freeText == undefined) {
          cheacker++;
        }

        console.log("order.RentalStart: " + order.RentalStart)
        if (form.value.RentalStart != undefined && form.value.RentalStart != "") {
          if (x.RentalStart.toString() == order.RentalStart.toString()) {
            console.log("true");
            cheacker++;
          }
        }
        else if (form.value.RentalStart == "" || order.RentalStart == undefined) {
          console.log("true");
          cheacker++;
        }

        console.log("order.RentalEnd: " + order.RentalEnd)
        if (form.value.RentalEnd != undefined && form.value.RentalEnd != "") {
          if (x.RentalEnd.toString() == order.RentalEnd.toString()) {
            console.log("true");
            cheacker++;
          }
        }
        else if (form.value.RentalEnd == "" || order.RentalEnd == undefined) {
          console.log("true");
          cheacker++;
        }

        console.log("order.ActualRentalEnd: " + order.ActualRentalEnd)
        if (form.value.ActualRentalEnd != undefined && form.value.ActualRentalEnd != "" && x.ActualRentalEnd != null) { // 'x.ActualRentalEnd' is property that can be null
          if (x.ActualRentalEnd.toString() == order.ActualRentalEnd.toString()) {
            console.log("true");
            cheacker++;
          }
        }
        else if (form.value.ActualRentalEnd == "" || order.ActualRentalEnd == undefined) {
          console.log("true");
          cheacker++;
        }

        console.log(cheacker);

        if (cheacker == 4) { // if it equal to the number of search filds (4 in this case) the order in this iteration previwe

          console.log("%c on this case it is 4: ", 'background: yellow')
          this.filtersOrders.orderList.push(x)
        }
        console.log("this.filtersOrders.orderList: " + this.filtersOrders.orderList);
        console.log("form: " + form.value);
      }
    }
    else {
      this.filtersOrders = null;
    }
  }

}