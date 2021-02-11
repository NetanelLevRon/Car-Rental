import { Component, OnInit } from '@angular/core';
import { CarService } from '../shared/services/car.service';
import { CarStore } from '../shared/models/car-store.model';
import { NgForm } from '@angular/forms';
import { UploadImageService } from '../shared/services/image.service';
import { Car } from '../shared/models/car.model';
import { UserService } from '../shared/services/user.service';
import { User } from '../shared/models/user.model';

@Component({
  selector: 'app-car-store-management',
  templateUrl: './car-store-management.component.html',
  styleUrls: ['./car-store-management.component.css']
})
export class CarStoreManagementComponent implements OnInit {

  public user: User = new User(); // for authentication purposes
  public cars: CarStore = new CarStore();
  public filtersCars: CarStore;
  public editCar: Car = new Car();
  public carId: number;
  public imageUrl: string = "";
  public fileToUpload: File = null;
  public actionMsg: string;
  public licensErrMsg: string;
  public mileageErrMsg: string;
  public isSuccess: boolean;
  public idForActionMsg: number;
  public form : NgForm; // for after delete => to send it again with the filtered inputs (inside the 'form')

  /* -------- varibles for edit ---------------- */

  public mileage: number;
  public avalabile: boolean;
  public proper: boolean;
  public license: string;
  public idForErr: number;
  public branch: number;

  /* -------- varibles for filter ---------------- */

  public CurrentMileage: number;
  public IsAvailable: boolean;
  public IsProper: boolean;
  public LicensePlate: string;
  public FreeText: string;
  public Branch: string;

  constructor(private _carService: CarService, private _imageService: UploadImageService, private _userService: UserService) { }

  ngOnInit() {

    this.setUser();
    this.isSuccess = false; // after adit it call "getCar" and set to true for prevent calling the function twice
    this._carService.car = new Car(); //Initial it for every singel edding. because i use it to chack
    // if the order allready back from server and it can contain the last data (of the former edit)
    this.setCarsInfo(); // set insert the info with the relevant format. call it until it arrive
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

  setCarsInfo() {

    this.cars.carList = this._carService.getCars();
    let index: number = 0;
    let imgtemp: string;

    if (this.cars.carList[0]) {
      if (this.cars.carList[0].CarTypeID) {

        for (let x of this.cars.carList) {

          if (x.Image != undefined) {
            imgtemp = x.Image;
            if (x.Image.toLowerCase().indexOf("http") == -1) { // mean that it's not the saved allrady with the server path
              this.cars.carList[index].Image = this._imageService.imageUrlPrefix + imgtemp;
            }
          }
          else {
            this.cars.carList[index].Image = "../assets/images/default-cars.jpeg";
          }
          index++;
        }
      }
      else {
        setTimeout(() => {
          this.setCarsInfo();
        }, 1000);
      }
    }
    else {
      setTimeout(() => {
        this.setCarsInfo();
      }, 1000);
    }

  }

  edit(from: string, car?: Car) {

    if (from == "editBtn") {

      this.mileage = car.CurrentMileage;
      this.avalabile = car.IsAvailable;
      this.proper = car.IsProper;
      this.license = car.LicensePlate;
      this.branch = car.BranchID;
      this.carId = car.CarID;

    }
    if (from == "backBtn") {
      this.carId = null;
      this.imageUrl = "";
      this.licensErrMsg = "";
      this.mileageErrMsg = "";
      this.actionMsg = "";
    }
  }

  OnSubmit(car: Car) {

    let imageUploadedAnswer: string;
    let errorMsg: string;
    let callback = (bool: boolean) => { this.actionMsg = (bool) ? "action success" : "action fail"; }
    let chackIfNum: number = Number(this.license);

    /*  ----------------------------- validation ------------------------------ */

    if (this.mileage < 0 || this.mileage > 999999) {
      if (this.mileage < 0) {
        this.mileageErrMsg = "Mileage must be positive!";
      }

      if (this.mileage > 999999) {
        this.mileageErrMsg = "Mileage can not be milion and above!";
      }

      this.mileage = car.CurrentMileage;
      this.idForErr = car.CarID; // for previewing the err msg only in the current card
    }
    else if ((this.license.length != 7 && this.license.length != 8) || (!chackIfNum) || (chackIfNum < 0)) {
      this.licensErrMsg = "License Plate must be '7' or '8' digits and positive number ";
      this.license = car.LicensePlate;
      this.idForErr = car.CarID; // for previewing the err msg only in the current card
    }
    else {
      this.mileageErrMsg = "";
      this.idForErr = undefined;
      this.licensErrMsg = "";

      /*  ----------------------------- validation ------------------------------ */
      this.editCar = car;
      this.editCar.CurrentMileage = this.mileage;
      this.editCar.IsAvailable = this.avalabile;
      this.editCar.IsProper = this.proper;
      this.editCar.LicensePlate = this.license;

      if (this.fileToUpload != null) {
        if (this.fileToUpload.name != null) {
          this._imageService.postFile(this.fileToUpload.name, this.fileToUpload)
            .subscribe((data) => {
              imageUploadedAnswer = data.toString();
              console.log("%c imageUploadedAnswer: " + imageUploadedAnswer, 'background: black; color: white')
            }, 
            (error: any) => { errorMsg = error },
             () => { // complited =>
                this.editCar.Image = imageUploadedAnswer;
                this._carService.editCar(this.editCar, car.CarID, callback);
                this.afterCarEdited(car.CarID);
              });
        }

      }
      else {
        this._carService.editCar(this.editCar, car.CarID, callback);
        this.afterCarEdited(car.CarID);
      }
    }

  }

  afterCarEdited(id: number) {

    let index: number = 0;
    this.idForActionMsg = id;

    if (this.actionMsg != "action fail") {
      if (!this.isSuccess) // don't repit "getCar" function twice
        this._carService.getCar(id, this.user.UserName, this.user.Password);

      if (this._carService.car) {
        if (this._carService.car.LicensePlate) {
          for (let x of this.cars.carList) {
            if (x.CarID == id) {
              this.cars.carList[index] = this._carService.car;
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
            this.afterCarEdited(id);
          }, 1000);
        }
      }
    }
    else {
      setTimeout(() => {
        this.afterCarEdited(id);
        console.log("before 'action success' LicensePlate: " + this._carService.car.LicensePlate)
      }, 1000);
    }

  }

  handleFileInput(file: FileList) {
    //Save image to the class property
    this.fileToUpload = file.item(0);

    //Show image preview
    let reader = new FileReader();
    reader.onload = (event: any) => { this.imageUrl = event.target.result; }
    reader.readAsDataURL(this.fileToUpload);
  }

  delete(car: Car) {
    if (confirm("are you sure want delete this car?")) {

      let ifSuccess: boolean;
      let index: number = 0;

      this._carService.deleteCar(car.CarID, this.user.UserName, this.user.Password).subscribe(() => {
        ifSuccess = true;
        console.log("deleted seccessfuly!")
      }, (err) => { ifSuccess = false; console.log(err) },
        () => {

          if (ifSuccess)
            for (let x of this.cars.carList) {
              if (x.CarID == car.CarID) {
                this._carService.carInfo.carList.splice(index, 1);

                if(this.form){ // if the preview is fitered
                  this.cars.carList.splice(index, 1);
                  this.filterCars(this.form);
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

  filterCars(form: NgForm) {

    this.form = form; // for after delete

    if (this.CurrentMileage || this.IsAvailable || this.IsProper || this.LicensePlate || this.FreeText || this.Branch) {
      
      let car: Car = form.value;
      let branch2: string = "Center branch"; // for free text search // manually because car contain only 'BranchID' the
      let branch3: string = "North branch"; // id that connect to the table of branchs and there is only two branchs

      if (form.value.IsProper == "undefined") { // for initial as empty the choices of IsProper
        car.IsProper = undefined;
      }
      else if (form.value.IsProper == "true") { // convet to boolean
        car.IsProper = true;
      }
      else if (form.value.IsProper == "false") { // convet to boolean
        car.IsProper = false;
      }


      if (form.value.IsAvailable == "undefined") { // for initial as empty the choices of IsAvailable
        car.IsAvailable = undefined;
      }
      else if (form.value.IsAvailable == "true") { // convet to boolean
        car.IsAvailable = true;
      }
      else if (form.value.IsAvailable == "false") { // convet to boolean
        car.IsAvailable = false;
      }


      if (form.value.Branch == "undefined") { // for initial as empty the choices of IsAvailable
        car.BranchID = undefined;
      }
      else if (form.value.Branch == "2") { // convet to boolean
        car.BranchID = 2;
      }                           
      else if (form.value.Branch == "3") { // convet to boolean
        car.BranchID = 3;
      }

      let freeText: string = form.value.FreeText ? form.value.FreeText.toLowerCase() : undefined;

      this.filtersCars = new CarStore(); // in this object the filtered cars inserted

      for (let x of this.cars.carList) { // all the cars that has

        /**
         *  if the value (on the client input) is empty (not inserted by the client) or equal to one of the cars value.
          if the input do match to the current car in the iteration or an empty filed (there is not resistance)
          count it, and if the number at the end will be equel to the number of the inputs preview this car
          else if there is value but with no match don't preview this car
         */
        let checker: number = 0;

        console.log(x);
        if (freeText != undefined) {
          console.log("%c free text: " + freeText,'background: red; color: white')
          console.log("%c branch2.toLowerCase(): " + branch2.toLowerCase(),'background: red; color: white')
          if (x.CurrentMileage.toString().toLowerCase().indexOf(freeText) != -1 ||
            x.LicensePlate.toLowerCase().indexOf(freeText) != -1 ||
            (branch2.toLowerCase().indexOf(freeText) != -1 && x.BranchID == 2 )||
            (branch3.toLowerCase().indexOf(freeText) != -1  && x.BranchID == 3 )
            
          ) { 
            checker++;
          }
        }
        else if (freeText == undefined) {
          checker++;
        }

        console.log("car.CurrentMileage: " + car.CurrentMileage)
        if (form.value.CurrentMileage != undefined && form.value.CurrentMileage != "") {
          if (x.CurrentMileage.toString() == car.CurrentMileage.toString()) {
            console.log("true");
            checker++;
          }
        }
        else if (form.value.CurrentMileage == "" || car.CurrentMileage == undefined) {
          console.log("true");
          checker++;
        }

        console.log("car.IsAvailable: " + car.IsAvailable)
        if (x.IsAvailable == car.IsAvailable) {
          console.log("true");
          checker++;
        }
        else if (car.IsAvailable == undefined) {
          console.log("true");
          checker++;
        }

        console.log("fullCar.IsProper: " + car.IsProper)
        if (x.IsProper == car.IsProper) {
          console.log("true");
          checker++;
        }
        else if (car.IsProper == undefined) {
          console.log("true");
          checker++;
        }

        console.log("car.BranchID: " + car.BranchID)
        if (x.BranchID == car.BranchID) {
          console.log("true");
          checker++;
        }
        else if (car.BranchID == undefined) {
          console.log("true");
          checker++;
        }

        console.log("car.LicensePlate: " + car.LicensePlate)
        if (x.LicensePlate == car.LicensePlate) {
          console.log("true");
          checker++;
        }
        else if (car.LicensePlate == undefined || car.LicensePlate == "") {
          console.log("true");
          checker++;
        }

        console.log(checker);

        if (checker == 6) { // if it equal to the number of search filds (6 in this case) the car in this iteration will preview

          console.log("%c on this case it is lass than 6: ", 'background: yellow')
          this.filtersCars.carList.push(x)
        }

        console.log(this.filtersCars.carList);
        console.log(form.value);
      }
    }
    else{
      this.filtersCars = null;
    }
  }

}