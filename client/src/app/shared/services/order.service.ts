import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Order } from "../models/order.model";
import { Observable } from "rxjs";
import { OrderStore } from "../models/order-store.model";


@Injectable()
export class OrderService {
    private link = "http://localhost:53312/api/Order";
    public urlPrefix: string = "http://localhost:53312/Image/";
    public order: Order = new Order();
    public orderInfo: OrderStore = new OrderStore();
    public openOrderInfo: OrderStore = new OrderStore();
    public relevantOpenOrders: OrderStore = new OrderStore(); 
    public userOrderInfo: OrderStore = new OrderStore();


    onInit() { }

    constructor(private myHttpClient: HttpClient) { }


    //GET : get all orders from server (and save the returned value to a property in this service)
    getOrders(): Array<Order> {
        this.myHttpClient.get(this.link)
            .subscribe((x: Array<Order>) => { Object.assign(this.orderInfo.orderList = x); }
            ,(err:HttpErrorResponse)=>{console.log(err); },
            ()=>{ console.log("from car service orderInfo.orderList = " + this.orderInfo.orderList);}
            );
            return this.orderInfo.orderList;
    }

      //GET : get  orders (by 'userId' with user name and password for authorization as customer) for pulling all the orders that this specific customer made
    getOrdersByUserID(userId: number, uName: string, psw: string): Array<Order> {
        this.myHttpClient.get(this.link + "/GetUserOrders/userId/" + userId, { headers: { "Authorization": `${uName} ${psw}` } })
            .subscribe((x: Array<Order>) => { Object.assign(this.userOrderInfo.orderList = x); }
            ,(err:HttpErrorResponse)=>{console.log(err); },
            ()=>{ if(this.userOrderInfo.orderList[0]){console.log("%c from order service userOrderInfo.orderList[0].RentalStart = " + this.userOrderInfo.orderList[0].RentalStart, 'background:red; color:white;');}
    });
            return this.userOrderInfo.orderList;
    }

    //GET : get a specific order (by id with user name and password for authorization) from server (and save the returned value to a property in this service)
    getOrder(id: number, uName, psw : string): Order { // access only by admin for pull order after edited
        this.myHttpClient.get(`${this.link}?id=${id}` , { headers: { "Authorization": `${uName} ${psw}` } } )
            .subscribe((x: Order) => { Object.assign(this.order, x); },
                (err: HttpErrorResponse) => { console.log(err); },
                ()=>{ console.log("%c from sevice: " + this.order.RentalStart ,'bacground: brown')});
                return this.order;
    }

    getOrderByCarId(carId: number, uName, psw : string): boolean { // access only by employee to set returned car after rental actual end
        this.myHttpClient.get(`${this.link}/GetOrderByCarId/carId/${carId}`, { headers: { "Authorization": `${uName} ${psw}` } } )
            .subscribe((x: Order) => { Object.assign(this.order, x); },
                (err: HttpErrorResponse) => { console.log(err);
                return false; } );
        return true;
    }

    deleteOrder(id: number, uName: string, psw: string): Observable<boolean> {
        let apiUrl: string = `${this.link}?id=${id}`;
        return this.myHttpClient.delete<boolean>(apiUrl,{ headers: {"Authorization": `${uName} ${psw}` } });
    }

    addOrder(order: Order, callback: (bool: boolean) => void, uName: string, psw: string): void { // access only by customer
        this.myHttpClient.post<boolean>(this.link, JSON.stringify(order), 
            { headers: { "content-type": "application/json", "Authorization": `${uName} ${psw}` } }).subscribe(() => { callback(true); },
                (err: HttpErrorResponse) => { console.log(err); callback(false) },
                () => { this.getOrders(); });

    }

    editOrder(order: Order, id: number, callback: (bool: boolean) => void, uName, psw : string): void { //  access by employee & admin
        this.myHttpClient.put<boolean>(`${this.link}?id=${id}`, JSON.stringify(order),
            { headers: { "content-type": "application/json", "Authorization": `${uName} ${psw}` } }).subscribe(() => { this.getOrders(); callback(true); },
                () => { callback(false); });
    }

      /**
   * compare two dates return true if the dates are equal
   */
  isTheSameDay(firstDate: Date, secondDate: Date): boolean { // בשימו

    if (firstDate.toLocaleDateString() == secondDate.toLocaleDateString())
      return true;
    return false;
  }

}