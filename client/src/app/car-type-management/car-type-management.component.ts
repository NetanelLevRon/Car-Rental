import { Component, OnInit } from '@angular/core';
import { CarTypeService } from '../shared/services/carType.service';
import { CarTypeStore } from '../shared/models/carType-store.model';
import { CarType } from '../shared/models/carType.model';
import { NgForm } from '@angular/forms';
import { User } from '../shared/models/user.model';
import { UserService } from '../shared/services/user.service';

@Component({
  selector: 'app-car-type-management',
  templateUrl: './car-type-management.component.html',
  styleUrls: ['./car-type-management.component.css']
})
export class CarTypeManagementComponent implements OnInit {

  public carTypes: CarTypeStore = new CarTypeStore();
  public user: User = new User(); // for authentication purposes
  public carTypeId: number;
  public actionMsg: string;
  public dayCostErrMsg: string;
  public dayLateCostErrMsg: string;
  public manufacturerYearErrMsg: string;
  public manufacturerNameErrMsg: string;
  public modelErrMsg: string;
  public idForErr: number;
  public editCarType: CarType = new CarType();
  public idForActionMsg: number;
  public isSuccess: boolean;
  public filtersCarTypes: CarTypeStore;
  public form: NgForm; // for after delete

  /* -------- varibles for edit ---------------- */
  public dayCost: number;
  public dayLateCost: number;
  public manufacturerName: string;
  public manufacturerYear: number;
  public model: string;
  public transmission: boolean;

  /* -------- varible for filter ---------------- */
  public DayCost: number;
  public DayLateCost: number;
  public ManufacturerName: string;
  public ManufacturerYear: number;
  public Model: string;
  public Transmission: boolean;
  public FreeText: string;

  constructor(private _carTypeService: CarTypeService, private _userService: UserService) { }

  ngOnInit() {

    this.setUser();
    this.isSuccess = false; // after adit it call "getCarType" and set to true for prevent calling the function twice
    this._carTypeService.carType = new CarType(); //Initial it for every singel edding. because i use it to chack
    // if the order allready back from server and it can contain the last data (of the former edit)
    this.setCarTypesInfo();  // insert the info. call it until it arrive
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

  setCarTypesInfo() {

    this.carTypes.carTypeList = this._carTypeService.getCarTyps();

    if (this.carTypes.carTypeList[0]) {
      if (this.carTypes.carTypeList[0].CarTypeID) {
        console.log("carTypes.carTypeList info is set!")
      }
      else {
        setTimeout(() => {
          this.setCarTypesInfo();
        }, 1000);
      }
    }
    else {
      setTimeout(() => {
        this.setCarTypesInfo();
      }, 1000);
    }

  }

  edit(from: string, carType?: CarType) {

    if (from == "editBtn") {

      this.dayCost = carType.DayCost;
      this.dayLateCost = carType.DayLateCost;
      this.manufacturerName = carType.ManufacturerName;
      this.manufacturerYear = carType.ManufacturerYear;
      this.model = carType.Model;
      this.transmission = carType.Transmission;

      this.carTypeId = carType.CarTypeID;
    }
    if (from == "backBtn") {
      this.carTypeId = null;
      this.dayCostErrMsg = "";
      this.dayLateCostErrMsg = "";
      this.manufacturerNameErrMsg = "";
      this.manufacturerYearErrMsg = "";
      this.actionMsg = "";
    }
  }

  OnSubmit(carType: CarType) {

    let callback = (bool: boolean) => { this.actionMsg = (bool) ? "action success" : "action fail"; }
    /*  ----------------------------- validation ------------------------------ */

    if (!(this.dayCost < this.dayLateCost) || !(this.manufacturerYear > 1930) || !this.dayLateCost
      || !this.dayCost || !this.manufacturerName || this.dayCost < 0 || !this.model) {

      this.idForErr = carType.CarTypeID; // for previewing the err msg only in the current card

      console.log("%c in the error section", 'background: black; color: white')

      if (!this.dayLateCost || !this.dayCost || this.dayCost < 0) {
        console.log("%c in the error section 2", 'background: black; color: white')
        if (!this.dayCost) {
          this.dayCostErrMsg = "requere filed!";
          this.dayCost = carType.DayCost;
        }
        else if (!this.dayLateCost) {
          this.dayLateCostErrMsg = "requere filed!";
          this.dayLateCost = carType.DayLateCost;
        }
        else if (this.dayCost < 0) {
          this.dayCostErrMsg = "must be positive number!";
          this.dayCost = carType.DayCost;
        }
      }
      else if (this.dayLateCost > this.dayCost) {
        this.dayLateCostErrMsg = "";
        this.dayCostErrMsg = "";
      }
      else {
        this.dayLateCostErrMsg = "must be number grater than day cost!";
        this.dayCostErrMsg = "must be smaler than day late cost!";
        this.dayLateCost = carType.DayLateCost;
        this.dayCost = carType.DayCost;
      }

      if (this.manufacturerYear >= 1930) {
        this.manufacturerYearErrMsg = "";
      }
      else {
        this.manufacturerYearErrMsg = "must be equal or grater than '1930'!";
        this.manufacturerYear = carType.ManufacturerYear;
      }

      if (!this.manufacturerName) {
        this.manufacturerNameErrMsg = "requere filed!";
        this.manufacturerName = carType.ManufacturerName;
      }
      else {
        this.manufacturerNameErrMsg = "";
      }

      if (!this.model) {
        this.modelErrMsg = "requere filed!";
        this.model = carType.Model;
      }
      else {
        this.modelErrMsg = "";
      }
    }
    else {
      this.idForErr = undefined;
      this.dayLateCostErrMsg = "";
      this.dayCostErrMsg = "";
      this.manufacturerYearErrMsg = "";
      this.modelErrMsg = "";

    }


    console.log(this.manufacturerYearErrMsg)
    /*  ----------------------------- validation ------------------------------ */

    if (!this.manufacturerNameErrMsg && !this.manufacturerYearErrMsg && !this.dayCostErrMsg && !this.dayLateCostErrMsg) {

      this.editCarType = carType; // for the forign keys
      this.editCarType.DayCost = this.dayCost;
      this.editCarType.DayLateCost = this.dayLateCost;
      this.editCarType.ManufacturerName = this.manufacturerName;
      this.editCarType.ManufacturerYear = this.manufacturerYear;
      this.editCarType.Model = this.model;
      this.editCarType.Transmission = this.transmission;

      console.log(this.editCarType.ManufacturerYear)

      this._carTypeService.editCarType(this.editCarType, this.editCarType.CarTypeID, callback, this.user.UserName, this.user.Password);

      this.afterCarTypeEdited(carType.CarTypeID);
    }
  }

  afterCarTypeEdited(id: number) {

    let index: number = 0;
    this.idForActionMsg = id;

    if (this.actionMsg != "action fail") {
      if (!this.isSuccess) // don't repit "getCar" function twice
        this._carTypeService.getCarType(id, this.user.UserName, this.user.Password);

      if (this._carTypeService.carType) {
        if (this._carTypeService.carType.DayCost) {
          console.log("supposed to work!!: " + this._carTypeService.carType.DayCost)
          for (let x of this.carTypes.carTypeList) {
            if (x.CarTypeID == id) {
              this.carTypes.carTypeList[index] = this._carTypeService.carType;
              this.ngOnInit();
              break;
            }
            index++;
          }
          this.isSuccess = false;
        }
        else {
          setTimeout(() => {
            this.isSuccess = true; // actionMsg = "action success"
            console.log("after 'action success' LicensePlate: " + this._carTypeService.carType.DayCost)
            this.afterCarTypeEdited(id);
          }, 1000);
        }
      }
    }
    else {
      setTimeout(() => {
        console.log("before 'action success' LicensePlate: " + this._carTypeService.carType.DayCost)
        this.afterCarTypeEdited(id);
      }, 1000);
    }

  }

  delete(carType: CarType) {
    if (confirm("are you sure want delete this carType?")) {

      let ifSuccsess: boolean;
      let index: number = 0;

      this._carTypeService.deleteCarType(carType.CarTypeID, this.user.UserName, this.user.Password).subscribe(() => {
        ifSuccsess = true;
        console.log("deleted seccessfuly!")
      }, (err) => { ifSuccsess = false; console.log(err) },
        () => {

          if (ifSuccsess)
            for (let x of this.carTypes.carTypeList) {
              if (x.CarTypeID == carType.CarTypeID) {
                this._carTypeService.carTypeInfo.carTypeList.splice(index, 1);

                if (this.form) { // if the preview is fitered
                  this.carTypes.carTypeList.splice(index, 1);
                  this.filterCarTypes(this.form);
                  this.form = null;
                }

                this.ngOnInit();
                break;
              }
              index++;
            }

        });
    }
  }

  filterCarTypes(form: NgForm) {

    this.form = form; // for after delete

    console.log("%c in filterCars", 'background:green')

    if (this.DayCost || this.DayLateCost || this.ManufacturerName || this.ManufacturerYear || this.Transmission
      || this.Model || this.FreeText) {

      let carType: CarType = form.value;
      let transmissionTrue: string = "Auto"; // for free text search // manually because it is boolean
      let transmissionFalse: string = "Manual"; // for free text search

      carType.DayCost = Number(this.DayCost) ? Number(this.DayCost) : undefined;
      carType.DayLateCost = Number(this.DayLateCost) ? Number(this.DayLateCost) : undefined;
      carType.ManufacturerName = this.ManufacturerName;
      carType.ManufacturerYear = Number(this.ManufacturerYear) ? Number(this.ManufacturerYear) : undefined;
      carType.Model = this.Model;

      if (form.value.Transmission == "undefined") { // for initial the choices of IsProper
        carType.Transmission = undefined;
      }
      else if (form.value.Transmission == "Auto") { // convet to boolean
        carType.Transmission = true;
      }
      else if (form.value.Transmission == "Manual") { // convet to boolean
        carType.Transmission = false;
      }

      let freeText: string = form.value.FreeText ? form.value.FreeText.toLowerCase() : undefined;

      this.filtersCarTypes = new CarTypeStore(); // in this object the filtered cars inserted

      for (let x of this.carTypes.carTypeList) { // all the cars that has

        let cheacker: number = 0; // if the value is empty or equal to one of the cars value.
        // in both cases count it. alse if there is value and it not match don't preview this car

        console.log(x);
        if (freeText != undefined) {
          console.log("%c free text: " + freeText, 'background: red; color: white')
          console.log("%c x.DayCost.toString(): " + x.DayCost.toString(), 'background: red; color: white')
          if (x.DayCost.toString().indexOf(freeText) != -1 ||
            x.DayLateCost.toString().indexOf(freeText) != -1 ||
            x.ManufacturerName.toLowerCase().indexOf(freeText) != -1 ||
            x.ManufacturerYear.toString().indexOf(freeText) != -1 ||
            x.Model.toLowerCase().indexOf(freeText) != -1 ||
            (transmissionTrue.toLowerCase().indexOf(freeText) != -1 && x.Transmission == true) ||
            (transmissionFalse.toLowerCase().indexOf(freeText) != -1 && x.Transmission == false)
          ) { // if so that's mean that the free text, inserting by the user do match 
            // (not case sesative) to some text in the current car
            cheacker++;
          }
        }
        else if (freeText == undefined) {
          cheacker++;
        }

        console.log("carType.DayCost: " + carType.DayCost)
        if (form.value.DayCost != undefined && form.value.DayCost != "") {
          if (x.DayCost.toString() == carType.DayCost.toString()) {
            console.log("true");
            cheacker++;
          }
        }
        else if (form.value.DayCost == "" || carType.DayCost == undefined) {
          console.log("true");
          cheacker++;
        }

        console.log("carType.DayLateCost: " + carType.DayLateCost)
        if (form.value.DayLateCost != undefined && form.value.DayLateCost != "") {
          if (x.DayLateCost.toString() == carType.DayLateCost.toString()) {
            console.log("true");
            cheacker++;
          }
        }
        else if (form.value.DayLateCost == "" || carType.DayLateCost == undefined) {
          console.log("true");
          cheacker++;
        }

        console.log("ccarTypear.Transmission: " + carType.Transmission)
        if (x.Transmission == carType.Transmission) {
          console.log("true");
          cheacker++;
        }
        else if (carType.Transmission == undefined) {
          console.log("true");
          cheacker++;
        }


        console.log("carType.ManufacturerName: " + carType.ManufacturerName)
        if (x.ManufacturerName == carType.ManufacturerName) {
          console.log("true");
          cheacker++;
        }
        else if (carType.ManufacturerName == undefined) {
          console.log("true");
          cheacker++;
        }

        console.log("carType.ManufacturerYear: " + carType.ManufacturerYear)
        if (form.value.ManufacturerYear != undefined && form.value.ManufacturerYear != "") {
          if (x.ManufacturerYear.toString() == carType.ManufacturerYear.toString()) {
            console.log("true");
            cheacker++;
          }
        }
        else if (form.value.ManufacturerYear == "" || carType.ManufacturerYear == undefined) {
          console.log("true");
          cheacker++;
        }


        console.log("carType.Model: " + carType.Model)
        if (x.Model == carType.Model) {
          console.log("true");
          cheacker++;
        }
        else if (carType.Model == undefined || carType.Model == "") {
          console.log("true");
          cheacker++;
        }

        console.log(cheacker);

        if (cheacker == 7) { // if it equal to the number of search filds (6 in this case) the car in this iteration previwe

          console.log("%c on this case it is 7: ", 'background: yellow')
          this.filtersCarTypes.carTypeList.push(x)
        }

        console.log(this.filtersCarTypes.carTypeList);
        console.log(form.value);
      }
    }
    else {
      this.filtersCarTypes = null;
    }
  }

}