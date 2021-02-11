import { Injectable } from "@angular/core";
import { FullCar } from "../models/fullCar.model";
import { FullCarStore } from "../models/fullCar-store.model";
import { Car } from "../models/car.model";
import { CarService } from "./car.service";
import { CarTypeService } from "./carType.service";
import { OrderService } from "./order.service";
import { BranchService } from "./branch.service";
import { CarStore } from "../models/car-store.model";
import { CarTypeStore } from "../models/carType-store.model";
import { BranchStore } from "../models/branch-store.model";
import { OrderStore } from "../models/order-store.model";
import { Order } from "../models/order.model";
import { CarType } from "../models/carType.model";
import { Branch } from "../models/branch.model";


@Injectable()
export class FullCarService {

    public urlPrefix: string = "http://localhost:53312/Image/";
    public fullCar: FullCar = new FullCar();
    public fullCarInfo: FullCarStore = new FullCarStore();
    public isServicesSet: boolean; // used from 'home' component for pull and set the information after change when needed
    public actionMsgForUpdateCar: string;
    public isInChildView: boolean = false; // indicate wether the view is of the component or of the child (for cars component)

    private carInfo: CarStore = new CarStore();
    private carTypeInfo: CarTypeStore = new CarTypeStore();
    private branchInfo: BranchStore = new BranchStore();
    private orderInfo: OrderStore = new OrderStore();
    private currentDate: Date = new Date();
    private currentDateInMs: number = new Date().valueOf();
    private currentDay: number = new Date().getDay();

    onInit() {
        console.log("%c start setCarServices..", 'background: silver; color: red;');
        this._carService.getCars();
        this._carTypeService.getCarTyps();
        this._branchService.getBranchs();
        this._orderService.getOrders();

        this.setAllServices();

        setInterval(() => { // every switched day check and set availability if needed
            let formerDay: number = this.currentDay;
            this.currentDay = new Date().getDay();

            if (!(this.currentDay == formerDay)) {
                let i: number = 0;
                for (let car of this.carInfo.carList) {
                    if (car.CarID == this.fullCarInfo.fullCarList[i].CarID) {
                        this.setAvailabilityCarsInDB(car, this.fullCarInfo.fullCarList[i]);
                    }
                    i++;
                }
            }
        }, 1000)
    }

    constructor(private _carService: CarService, private _carTypeService: CarTypeService,
        private _orderService: OrderService, private _branchService: BranchService) { }

    // most of the function on this service are depending on each other and the divide is mostly for more readable code and understending

    setAllServices() {

        if (this._carService.carInfo.carList[0] != undefined) { // '.carList[0] != ..' because compiler can not read '[0]...' of undefined as in the next check (and so every check as this)

            if (this._carService.carInfo.carList[0].LicensePlate != undefined &&
                this._carTypeService.carTypeInfo.carTypeList[0].DayCost != undefined
                && this._branchService.branchInfo.branchList[0].BranchName != undefined
                && this._orderService.orderInfo.orderList[0].RentalEnd != undefined) { // 'LicensePlate,DayCost ..' -> random choises for checking if the info already arrive

                this.carInfo.carList = this._carService.carInfo.carList;
                this.carTypeInfo.carTypeList = this._carTypeService.carTypeInfo.carTypeList;
                this.branchInfo.branchList = this._branchService.branchInfo.branchList;
                this.orderInfo.orderList = this._orderService.orderInfo.orderList;

                this.isServicesSet = true; // mean that all the information been pulled from data base

                this.setAllInfo();
            }
            else {
                setTimeout(() => {
                    this.setAllServices();
                    console.log("%c from setAllServices - not pulled the info successfuly yet..: " + this.carInfo.carList[0].LicensePlate, 'background: silver; color: green');
                }, 1000);
            }
        }
        else {
            setTimeout(() => {
                this.setAllServices();
                console.log("%c from setAllServices - before carInfo defined: " + this.carInfo.carList[0], 'background: silver; color: green');
            }, 1000);
        }
    }

    /**
     *  Enter all the data in one full car 
     */
    setAllInfo() {

        console.log("setAllInfo call + branchID = " + this.carInfo.carList[0].BranchID); //console

        let i: number = 0;

        for (let car of this.carInfo.carList) {

            console.log("let car of this.carInfo.carList x.CarTypeID = " + car.CarTypeID); // console
            for (let carType of this.carTypeInfo.carTypeList) {

                console.log("let carType of this.carTypeInfo.carTypeList y.CarTypeID= " + carType.CarTypeID); // console
                if (car.CarTypeID == carType.CarTypeID) {

                    console.log("car.CarTypeID == carType.CarTypeID = " + car.CarTypeID + "," + carType.CarTypeID); // console
                    for (let branch of this.branchInfo.branchList) {

                        if (car.CarTypeID == carType.CarTypeID && car.BranchID == branch.BranchID) { // on this point => car, carType and branch are conected tables in the data base and aimed to the same car

                            this.setDataInFullCar(i, car, carType, branch);
                            this.setAvailabilityCarsInDB(car, this.fullCarInfo.fullCarList[i]); // called every day (when the day changed) //this.currentCar?
                        }

                    } console.log("console.log(carType.Transmission);: " + carType.Transmission);
                }
            }
            i++;
        }

    }

    /**
    *  group all the information from separated tables to one central car & call 'setOrders' function to add the orders too
    */
    setDataInFullCar(index: number, car: Car, carType: CarType, branch: Branch) {

        this.fullCarInfo.fullCarList[index] = new FullCar();
        this.fullCarInfo.fullCarList[index].CarID = car.CarID;
        this.fullCarInfo.fullCarList[index].CarTypeID = carType.CarTypeID;
        this.fullCarInfo.fullCarList[index].BranchID = branch.BranchID;
        this.fullCarInfo.fullCarList[index].IsProper = car.IsProper;
        this.fullCarInfo.fullCarList[index].IsAvailable = car.IsAvailable;
        this.fullCarInfo.fullCarList[index].Image = car.Image.toLowerCase().indexOf("http") == -1 ? this.urlPrefix + car.Image : car.Image; // if 'http' exist that mean that the url of the server address (urlPrefix) already inserted, so do not insert it again
        this.fullCarInfo.fullCarList[index].ManufacturerName = carType.ManufacturerName;
        this.fullCarInfo.fullCarList[index].ManufacturerYear = carType.ManufacturerYear;
        this.fullCarInfo.fullCarList[index].Model = carType.Model;
        this.fullCarInfo.fullCarList[index].Transmission = carType.Transmission;
        this.fullCarInfo.fullCarList[index].DayCost = carType.DayCost;
        this.fullCarInfo.fullCarList[index].DayLateCost = carType.DayLateCost;
        this.fullCarInfo.fullCarList[index].BranchName = branch.BranchName;

        let numOfOrder: number = 0;
        for (let order of this.orderInfo.orderList) { // for seting the orders on the full car 
            if (order.CarID == car.CarID) {  // at this point => the orders belong to the current full cat
                this.setOrders(index, numOfOrder, order);
                numOfOrder++;
            }
        }

    }

    /**
     * insert all the orders that on this car
     * @param index - the index of the current central car - (fullCar)
     * @param indexOfOrder - the index of the order in the current central car - (fullCar)
     * @param order - the current order to insert to the orders array in the current central car - (fullCar)
     */
    setOrders(index: number, indexOfOrder: number, order: Order) {

        this.fullCarInfo.fullCarList[index].OrderID = order.OrderID;

        this.fullCarInfo.fullCarList[index].Orders[indexOfOrder] = new Order();
        this.fullCarInfo.fullCarList[index].Orders[indexOfOrder].RentalStart = order.RentalStart;
        this.fullCarInfo.fullCarList[index].Orders[indexOfOrder].RentalEnd = order.RentalEnd;
        this.fullCarInfo.fullCarList[index].Orders[indexOfOrder].ActualRentalEnd = order.ActualRentalEnd;
        this.fullCarInfo.fullCarList[index].Orders[indexOfOrder].UserID = order.UserID;

    }


    /**
     *  set availability automatically in DB based on the current date. for future orders that began
     * @param car the current car for send to the server for set availability in data base (as car model)
     * @param currentFullCar the extended full car of the car above that contained all the dates of the orders that this car have to check if the car is rented now
     */
    setAvailabilityCarsInDB(car: Car, currentFullCar: FullCar) { 

        let callbackForUpdateCar = (bool: boolean) => { this.actionMsgForUpdateCar = (bool) ? "out of available list" : "action fail"; }

        for (let i: number = 0; i < currentFullCar.Orders.length; i++) { // on every car that contain orders do the next logic

            if ((this.currentDateInMs > new Date(currentFullCar.Orders[i].RentalStart).valueOf()
                && this.currentDateInMs < new Date(currentFullCar.Orders[i].RentalEnd).valueOf()) // if todays date is between the range of start and end rental dates
                || this._orderService.isTheSameDay(new Date(currentFullCar.Orders[i].RentalStart),this.currentDate)  // or on the first day of rental => is right now rented and not available
                ) {
                console.log("%c the car: " + currentFullCar.ManufacturerName + " now rented and not available", 'background: silver; color: yellow');
                if (car.IsAvailable == true) {
                    car.IsAvailable = false;
                    this._carService.editCar(car, car.CarID, callbackForUpdateCar);
                    for(let i = 0; i < this.fullCarInfo.fullCarList.length ; i++){ // update the info here (client side) until it will pulled directly from db
                        if(this.fullCarInfo.fullCarList[i].CarID == currentFullCar.CarID){
                            this.fullCarInfo.fullCarList[i].IsAvailable = false;
                        }
                    }
                    this._carService.carInfo.carList[0].LicensePlate = undefined; // for make sure that the cars pulled again (in the check if the info arrive in 'setAllServices')
                    this._carService.getCars(); // pulling the cars again with the new updated data (isAvailable)
                    console.log("%c after been send to server this.actionMsgForUpdateCar: " + this.actionMsgForUpdateCar, 'background: silver; color: yellow');
                }
                this.actionMsgForUpdateCar = undefined;
                break;
            }
        }
    }

}