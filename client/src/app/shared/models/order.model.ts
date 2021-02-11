export class Order {

    OrderID?: number;

    RentalStart: any; // the reason it is 'any' and not 'Date' is for preview it as default value for 'input type date'
                     // which accept only 'yyyy-MM-dd' format that can be only in type string - (in 'order-view-manager') 
    RentalEnd: any;

    ActualRentalEnd: any;

    UserID: number;

    CarID: number;
}