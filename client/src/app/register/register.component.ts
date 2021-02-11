import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserStore } from '../shared/models/user-store.model';
import { UserService } from '../shared/services/user.service';
import { User } from '../shared/models/user.model';
import { UploadImageService } from '../shared/services/image.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent {

  urlPrefix: string = "http://localhost:53312/Image/";

  registeredUser: UserStore = new UserStore(); // looks like not needed
  currentUser: User = new User(); // needed only to uploaded instad of "registeredUser"
  actionMsg: string;
  imageUrl: string = "";
  fileToUpload: File = null;
  isSuccess: boolean = false; // if register succeed

  public fullNameErrMsg: string;
  public idErrMsg: string;
  public userNameErrMsg: string;
  public emailErrMsg: string;
  public passwordErrMsg: string;


  constructor(private _userService: UserService, private imageService: UploadImageService,
    private route: Router) { }

  tempUrl: string = "http://localhost:53312/Image/IMG_0172204749062.JPG";

  OnSubmit(form: NgForm) {

    let imageUploadedAnswer: string;
    let errorMsg: string;
    let callback = (bool: boolean) => { this.actionMsg = (bool) ? "action success" : "action fail"; }
    this.registeredUser.singleUser = form.value;
    let isIdIsNumber: number = Number(this.registeredUser.singleUser.ID)

    /* ------------------------- validation --------------------------------------- */

    if (!this.registeredUser.singleUser.FullName) {
      this.fullNameErrMsg = "require field!";
    }
    else if (this.registeredUser.singleUser.FullName.length < 5 || this.registeredUser.singleUser.FullName.length > 30) {
      this.fullNameErrMsg = "this field require at least 5 characters and max of 30 characters!";
    }
    else {
      this.fullNameErrMsg = "";
    }

    if (!isIdIsNumber) {
      this.idErrMsg = "require field and as number!";
    }
    else if (this.registeredUser.singleUser.ID.length != 9) {
      this.idErrMsg = "this field require 9 characters!";
    }
    else {
      this.idErrMsg = "";
    }

    if (!this.registeredUser.singleUser.UserName) {
      this.userNameErrMsg = "require field!";
    }
    else if (this.registeredUser.singleUser.UserName.length > 30 || this.registeredUser.singleUser.UserName.length < 2) {
      this.userNameErrMsg = "this field require at least 2 characters and max of 30 characters!";
    }
    else {
      this.userNameErrMsg = "";
    }

    if (!this.registeredUser.singleUser.Email) {
      this.emailErrMsg = "require field!";
    }
    else if (!this._userService.validateEmail(this.registeredUser.singleUser.Email)) {
      this.emailErrMsg = "incorrect email pattern!";
    }
    else {
      this.emailErrMsg = "";
    }

    if (!this.registeredUser.singleUser.Password) {
      this.passwordErrMsg = "require field!";
    }
    else if (this.registeredUser.singleUser.Password.length > 8 || this.registeredUser.singleUser.Password.length < 4) {
      this.passwordErrMsg = "this field require at least 4 characters and max of 8 characters!";
    }
    else {
      this.passwordErrMsg = "";
    }

    if (!this.passwordErrMsg && !this.emailErrMsg && !this.userNameErrMsg && !this.idErrMsg && !this.fullNameErrMsg) {

      /* ------------------------- validation --------------------------------------- */
      this._userService.errMsg = new Array<string>();

      if (this.fileToUpload) {
        if (this.fileToUpload.name != null) {
          this.imageService.postFile(this.fileToUpload.name, this.fileToUpload)
            .subscribe((data) => {
              imageUploadedAnswer = data.toString();
              console.log("%c imageUploadedAnswer: " + imageUploadedAnswer, 'background: black; color: white')
            },
              (error: any) => { errorMsg = error }, () => {/* when complited */

                this.registeredUser.singleUser.Image = imageUploadedAnswer;
                this.registeredUser.singleUser.UserRole = "customer"; // default value for registers

                this._userService.addUser(this.registeredUser.singleUser, callback);

                this.afterUserRegistered();
              }); 
        }
      }
      else {
        this.registeredUser.singleUser.UserRole = "customer"; // default value for registers

        this._userService.addUser(this.registeredUser.singleUser, callback);

        this.afterUserRegistered();

      }
    }
  }

  afterUserRegistered() {

    if (this.actionMsg == "action success") {
      if (!this.isSuccess) // don't repit "getLoginUser" function twice
        this._userService.getLoginUser(this.registeredUser.singleUser.UserName, this.registeredUser.singleUser.Password);

      if (this._userService.user) {
        if (this._userService.user.FullName) {
          this.route.navigateByUrl('/home');
        }
        else {
          setTimeout(() => {
            this.isSuccess = true; // actionMsg = "action success"
            this.afterUserRegistered();
            console.log("after 'action success' FullName: " + this._userService.user.FullName)
          }, 1000);
        }
      }
    }
    else if (this.actionMsg == "action fail") {
      alert(this.actionMsg + " - " + this._userService.errMsg[0]);
      this.actionMsg = "";
      this._userService.errMsg = new Array<string>();
      this.isSuccess = false;
    }
    else {
      setTimeout(() => {
        this.afterUserRegistered();
        console.log("before 'action success' FullName: " + this._userService.user.FullName)
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

}