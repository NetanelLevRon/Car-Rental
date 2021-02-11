import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Car } from "../models/car.model";
import { Observable } from "rxjs";
import { CarStore } from "../models/car-store.model";


@Injectable()
export class CarService {
    private link = "http://localhost:53312/api/Car";
    public urlPrefix: string = "http://localhost:53312/Image/";
    public car: Car = new Car();
    public carInfo: CarStore = new CarStore();
    public errMsg: string[] = new Array<string>();

    onInit() { }

    constructor(private myHttpClient: HttpClient) { }


    //GET : get all cars from server (and save the returned value to a property in this service)
    getCars(): Array<Car> {
        this.myHttpClient.get(this.link)
            .subscribe((x: Array<Car>) => { Object.assign(this.carInfo.carList = x); },
                (err: HttpErrorResponse) => { console.log(err); },
                () => { console.log("from car service this.carInfo.carList[0].IsAvailable = " + this.carInfo.carList[0].IsAvailable); }
            );

        return this.carInfo.carList;
    }

    //GET : get a specific car (by id with user name and password for authorization) from server (and save the returned value to a property in this service)
    getCar(id: number, uName: string, psw: string): void { // only customer and admin ca access this function
        this.myHttpClient.get(`${this.link}?id=${id}`, { headers: { "Authorization": `${uName} ${psw}` } })
            .subscribe((x: Car) => { Object.assign(this.car, x); },
                (err: HttpErrorResponse) => { console.log(err); },
                ()=>console.log("from car service this.car.CurrentMileage = " + this.car.CurrentMileage));
    }

    //GET : get a specific car (by license plate with user name and password for authorization as 'employee') for 'employee' to set returned car after rental actual end
    getCarByLicensePlate(licensePlate, uName, psw: string): boolean { 
        this.myHttpClient.get(`${this.link}/GetByLicense/licensePlate/${licensePlate}`, { headers: { "Authorization": `${uName} ${psw}` } })
            .subscribe((x: Car) => { Object.assign(this.car, x); },
                (err: HttpErrorResponse) => { this.errMsg[0] = err.statusText; console.log(err); return false; },
                () => { console.log("%c this.car.BranchID from service: " + this.car.BranchID, 'backgrond: yellow; color: white;'); });

        return true;
    }

    deleteCar(id: number, uName: string, psw: string): Observable<boolean> {
        let apiUrl: string = `${this.link}?id=${id}`;
        return this.myHttpClient.delete<boolean>(apiUrl, { headers: { "Authorization": `${uName} ${psw}` } });
    }

    editCar(car: Car, id: number, callback: (bool: boolean) => void): void { // this function not demand authentication becuase it used for set car avilability automatocally 
        this.myHttpClient.put<boolean>(`${this.link}?id=${id}`, JSON.stringify(car),
            { headers: { "content-type": "application/json" } }).subscribe(() => { this.getCars(); callback(true); },
                () => { callback(false); });
    }


}