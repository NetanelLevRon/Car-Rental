import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CarType } from "../models/carType.model";
import { Observable } from "rxjs";
import { CarTypeStore } from "../models/carType-store.model";


@Injectable()
export class CarTypeService {
    private link = "http://localhost:53312/api/CarType";
    public urlPrefix: string = "http://localhost:53312/Image/";
    public carType: CarType = new CarType();
    public carTypeInfo: CarTypeStore = new CarTypeStore();


    onInit() { }

    constructor(private myHttpClient: HttpClient) { }


    //GET : get all carTypes from server (and save the returned value to a property in this service)
    getCarTyps(): Array<CarType> {
        this.myHttpClient.get(this.link)
            .subscribe((x: Array<CarType>) => { Object.assign(this.carTypeInfo.carTypeList = x); }
            ,(err:HttpErrorResponse)=>{console.log(err)},
            ()=>{ console.log("from car service carTypeInfo.carTypeList[0].ManufacturerName = " + this.carTypeInfo.carTypeList[0].ManufacturerName);}
                );
            return this.carTypeInfo.carTypeList;
    }

    //GET : get a specific carType (by id with user name and password for authorization) from server and save the returned value to a property in this service
    getCarType(id: number, uName: string, psw: string): CarType { // only admin and eployee authenticate can access this function
        this.myHttpClient.get(`${this.link}?id=${id}` , { headers: { "Authorization": `${uName} ${psw}` } } )
            .subscribe((x: CarType) => { Object.assign(this.carType, x); },
                (err: HttpErrorResponse) => { console.log(err); });
        return this.carType;
    }

    deleteCarType(id: number, uName: string, psw: string): Observable<boolean> { // only admin can access this. function
        let apiUrl: string = `${this.link}?id=${id}`;
        return this.myHttpClient.delete<boolean>(apiUrl, { headers: { "Authorization": `${uName} ${psw}` } });
    }

    editCarType(carType: CarType, id: number, callback: (bool: boolean) => void, uName: string, psw: string): void { // only admin can access this function
        this.myHttpClient.put<boolean>(`${this.link}?id=${id}`, JSON.stringify(carType),
            { headers: { "content-type": "application/json", "Authorization": `${uName} ${psw}` } }).subscribe(() => { this.getCarTyps(); callback(true); },
                () => { callback(false); });
    }


}