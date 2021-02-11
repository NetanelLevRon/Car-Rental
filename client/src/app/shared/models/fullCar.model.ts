import { Order } from "./order.model";

export class FullCar {

    CarID?: number;
    CarTypeID?: number;
    OrderID?: number;
    BranchID?: number;
    UserID?: number; 

    Orders?: Array<Order> = new Array<Order> ();
    ManufacturerName: string;
    Model: string;
    DayCost: number;
    DayLateCost: number;
    ManufacturerYear: number;
    Transmission: boolean;
    BranchName: string;
    IsProper: boolean;
    IsAvailable: boolean;
    Image: string;
}