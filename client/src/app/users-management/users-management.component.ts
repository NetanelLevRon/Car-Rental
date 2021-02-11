import { Component, OnInit } from '@angular/core';
import { UserStore } from '../shared/models/user-store.model';
import { UserService } from '../shared/services/user.service';
import { User } from '../shared/models/user.model';
import { UploadImageService } from '../shared/services/image.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-users-management',
  templateUrl: './users-management.component.html',
  styleUrls: ['./users-management.component.css']
})
export class UsersManagementComponent implements OnInit {

  public currentUser: User;
  public users: UserStore = new UserStore();
  public userId: number;
  public imageUrl: string = "";
  public fileToUpload: File = null;
  public actionMsg: string;
  public editUser: User = new User();
  public idForErr: number;
  public idForActionMsg: number;
  public isSuccess: boolean;
  public fullNameErrMsg: string;
  public idErrMsg: string;
  public userNameErrMsg: string;
  public emailErrMsg: string;
  public passwordErrMsg: string;
  public isDelete: boolean = false;
  public isIdPast: boolean = true;
  public isUserNamePast: boolean = true;
  public tempId: string;
  public tempUserName: string;
  public filtersUsers: UserStore;
  public form: NgForm; // for after delete

  /* -------------- varibles for editing -------------- */

  public birthDate: Date = new Date();
  public email: string;
  public fullName: string;
  public gender: boolean;
  public id: string;
  public password: string;
  public userName: string;
  public userRole: string;
  public image: string;

  /* -------- varible for filtering ---------------- */

  public FreeText: string;
  public BirthDate: number;
  public Email: string;
  public FullName: string;
  public Gender: boolean;
  public ID: string;
  public Password: string;
  public UserName: string;
  public UserRole: string;

  constructor(private _userService: UserService, private _imageService: UploadImageService) { }

  ngOnInit() {

    this.setUser();
    this.isSuccess = false; // after adit it call "getUser" and set to true to prevent calling the function twice
    this._userService.userForEdit = new User(); //Initial it for every singel edding. because i use it to chack
    // if the order allready back from server and it can contain the last data (of the former edit)
    this.setUsersInfo(); // set and insert the info with the relevant format. call it until it arrive

  }

  /**
* set the user for gurds and for authorization
*/
  setUser() {
    setTimeout(() => {
      if (this._userService.user.UserRole != undefined) {
        this.currentUser = this._userService.user;
      }
      else {
        this._userService.defaultUser();
        this.setUser();
      };
    }, 1000);
  }

  setUsersInfo() {

    this.users.userList = this._userService.getUsers();
    let index: number = 0;
    let imgtemp: string;
    let tempDay: number;

    if (this.users.userList[0]) {
      if (this.users.userList[0].FullName) {

        for (let x of this.users.userList) {

          if (x.Image != undefined) {
            imgtemp = x.Image;
            if (x.Image.toLowerCase().indexOf("http") == -1) { // mean that it's not the allrady saved with the server path
              this.users.userList[index].Image = this._imageService.imageUrlPrefix + imgtemp;
            }
          }
          else {
            this.users.userList[index].Image = this._imageService.defaultUserImg;
          }

          tempDay = new Date(x.BirthDate).getUTCDate() + 1;
          x.BirthDate = x.BirthDate ? new Date(x.BirthDate).setUTCDate(tempDay) : x.BirthDate;
          this.users.userList[index].BirthDate = x.BirthDate ? new Date(x.BirthDate).toISOString().split('T')[0] : x.BirthDate; // for previewing it as initial value on edit state

          index++;
        }
      }
      else {
        setTimeout(() => {
          this.setUsersInfo();
        }, 1000);
      }
    }
    else {
      setTimeout(() => {
        this.setUsersInfo();
      }, 1000);
    }

  }

  edit(from: string, user?: User) { // enable to temporary editing and keep to the former values if not saved (by click on 'back' button). 

    if (from == "editBtn") {
      this.birthDate = user.BirthDate;
      this.email = user.Email;
      this.fullName = user.FullName;
      this.gender = user.Gender;
      this.id = user.ID;
      this.password = user.Password;
      this.userName = user.UserName;
      this.userRole = user.UserRole;
      this.image = user.Image;
      this.userId = user.UserID;
    }
    if (from == "backBtn") {
      this.userId = null;
      this.imageUrl = "";
      this.fullNameErrMsg = "";
      this.passwordErrMsg = "";
      this.emailErrMsg = "";
      this.userNameErrMsg = "";
      this.idErrMsg = "";
      this.actionMsg = "";
      this._userService.errMsg = undefined;

      if (!this.isIdPast) { // if the id (of the user) syntax wrong it return the former value (the value that was befor it been sened to the server).
        this.id = this.tempId;
        user.ID = this.tempId;
        this.isIdPast = true;
      }
      if (!this.isUserNamePast) { // if the user name not unique it return the former value (the value that was befor it been sened to the server).
        this.UserName = this.tempUserName;
        user.UserName = this.tempUserName;
        this.isUserNamePast = true;
      }
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

  OnSubmit(user: User) {

    let imageUploadedAnswer: string; // for the name the server saved the image (after user updated)
    let callback = (bool: boolean) => { this.actionMsg = (bool) ? "action success" : "action fail"; }

    /*  ----------------------------- validation ------------------------------ */

    if (!this.fullName) {
      this.fullName = user.FullName;
      this.fullNameErrMsg = "require field!";
    }
    else if (this.fullName.length < 5 || this.fullName.length > 30) {
      this.fullName = user.FullName;
      this.fullNameErrMsg = "this field require at least 5 characters and max of 30 characters!";
    }
    else {
      this.fullNameErrMsg = "";
    }

    if (!this.id) {
      this.id = user.ID;
      this.idErrMsg = "require field!";
      console.log("%c id id err", 'background: black; color: white')
    }
    else if (this.id.length != 9) {
      this.id = user.ID;
      this.idErrMsg = "this field require 9 characters!";
    }
    else {
      this.idErrMsg = "";
    }

    if (!this.userName) {
      this.userName = user.UserName;
      this.userNameErrMsg = "require field!";
    }
    else if (this.userName.length > 30 || this.userName.length < 2) {
      this.userName = user.UserName;
      this.userNameErrMsg = "this field require at least 2 characters and max of 30 characters!";
    }
    else {
      this.userNameErrMsg = "";
    }

    if (!this.email) {
      this.email = user.Email;
      this.emailErrMsg = "require field!";
    }
    else if (!this._userService.validateEmail(this.email)) {
      this.email = user.Email;
      this.emailErrMsg = "incorrect email pattern!";
    }
    else {
      this.emailErrMsg = "";
    }

    if (!this.password) {
      this.password = user.Password;
      this.passwordErrMsg = "require field!";
    }
    else if (this.password.length > 8 || this.password.length < 4) {
      this.password = user.Password;
      this.passwordErrMsg = "this field require at least 4 characters and max of 8 characters!";
    }
    else {
      this.passwordErrMsg = "";
    }

    if (this.passwordErrMsg || this.emailErrMsg || this.userNameErrMsg || this.idErrMsg || this.fullNameErrMsg) {
      this.idForErr = user.UserID; // for previewing the err msg only in the current card
    }
    else {
      this.idForErr = undefined;
    }

    /*  ----------------------------- validation ends ------------------------------ */

    if (this.idForErr == undefined) { // only when it's valid and there is no err maseges
      this.tempId = user.ID; // for wrong id syntax
      this.tempUserName = user.UserName; // for not unique user name
      this.editUser = user; // for the 'id' and all the 'not tuch' fields

      this.editUser.BirthDate = this.birthDate;
      this.editUser.Email = this.email;
      this.editUser.FullName = this.fullName;
      this.editUser.Gender = this.gender;
      this.editUser.ID = this.id;
      this.editUser.Password = this.password
      this.editUser.UserName = this.userName;
      this.editUser.UserRole = this.userRole;

      if (this.fileToUpload != null) {
        if (this.fileToUpload.name != null) {
          this._imageService.postFile(this.fileToUpload.name, this.fileToUpload)
            .subscribe((data) => {
              imageUploadedAnswer = data.toString();
              console.log("imageUploadedAnswer: " + imageUploadedAnswer)
            },
              (error: any) => { /* console.log("error: " + error) */ },
              () => { // complited =>
                this.editUser.Image = imageUploadedAnswer;
                this._userService.editUser(this.editUser, this.editUser.UserID, callback, this.currentUser.UserName, this.currentUser.Password);
                this.afterUserEdited(user);
              });
        }
        this.fileToUpload = null; // initialize to avoid sending the image again with the next edited user
      }
      else if(this.editUser.Image == this._imageService.defaultUserImg) { // don't save the default image
        this.editUser.Image = null;
        this._userService.editUser(this.editUser, this.editUser.UserID, callback, this.currentUser.UserName, this.currentUser.Password);
        this.afterUserEdited(user);
      }
      else {
        this._userService.editUser(this.editUser, this.editUser.UserID, callback, this.currentUser.UserName, this.currentUser.Password);
        this.afterUserEdited(user);
      }
    }

  }

  afterUserEdited(user: User) {

    let index: number = 0;

    this.idForActionMsg = user.UserID;
    if (this.actionMsg != "action fail" && this.actionMsg) {
      if (!this.isSuccess) // don't repit "getUser" function twice
        this._userService.getUser(user.UserID, this.currentUser.UserName, this.currentUser.Password);

      if (this._userService.userForEdit) {
        if (this._userService.userForEdit.FullName) {
          for (let x of this.users.userList) {
            if (x.UserID == user.UserID) {
              this.users.userList[index] = this._userService.userForEdit; 
              this.ngOnInit();
              break;
            }
            index++;
          }
        }
        else {
          setTimeout(() => {
            this.isSuccess = true; // actionMsg = "action success"
            this.afterUserEdited(user);
            console.log("after 'action success' FullName: " + this._userService.user.FullName)
          }, 1000);
        }
      }
    }
    else if (this.actionMsg == "action fail") { // if the id syntax incorrect
      if (this._userService.errMsg[0].indexOf('id') != -1) { // it is incorrect id syntax
        this.actionMsg = this._userService.errMsg[0];
        this.isIdPast = false;
      }
      if (this._userService.errMsg[0].indexOf('user name') != -1) { // it is not unique user name
        this.actionMsg = this._userService.errMsg[0];
        this.isUserNamePast = false;
      }
    }
    else {
      setTimeout(() => {
        this.afterUserEdited(user);
        console.log("before 'action success' FullName: " + this._userService.user.FullName)
      }, 1000);
    }

  }

  delete(user: User) {
    if (confirm("are you sure want delete this user?")) {
      this._userService.errMsg = new Array<string>();
      let callback = (bool: boolean) => { this.actionMsg = (bool) ? "action success" : "action fail"; }
      this._userService.deleteUser(user.UserID, callback, this.currentUser.UserName, this.currentUser.Password);
      this.afterDeleted(user.UserID);
    }
  }

  afterDeleted(id: number) {

    let index: number = 0;
    this.idForActionMsg = id;

    if (this.actionMsg == "action success") {
      this.idForActionMsg = undefined;
      for (let x of this.users.userList) {
        if (x.UserID == id) {
          this._userService.userInfo.userList.splice(index, 1);

          if (this.form) { // if the preview is fitered
            this.users.userList.splice(index, 1);
            this.filterUsers(this.form);
            this.form = null;
          }

          this.ngOnInit();
        }
        index++;
      }
    }
    else if (this.actionMsg == "action fail") {
      this.actionMsg = this._userService.errMsg[0];
    }
    else {
      setTimeout(() => {
        this.afterDeleted(id);
        console.log("before 'action success' delete: ")
      }, 1000);
    }
  }

  filterUsers(form: NgForm) { // when search users by fileds

    this.form = form; // for after delete

    console.log("%c in filterUsers", 'background:green')

    console.log("%c this.BirthDate: " + this.BirthDate, 'background:green');

    let user: User = form.value;

    if (form.value.Gender == "undefined") { // for initial the choices of Gender
      user.Gender = undefined;
    }
    else if (form.value.Gender == "Male") { // convet to boolean
      user.Gender = true;
    }
    else if (form.value.Gender == "Female") { // convet to boolean
      user.Gender = false;
    }

    if (form.value.UserRole == "undefined") { // for initial the choices of UserRole
      user.UserRole = undefined;
    }
    else if (form.value.UserRole == "Customer") {
      user.UserRole = "Customer";
    }
    else if (form.value.UserRole == "Employee") {
      user.UserRole = "Employee";
    }
    else if (form.value.UserRole == "Admin") {
      user.UserRole = "Admin";
    }

    if (this.BirthDate || this.Email || this.FullName || this.Gender ||
      this.ID || this.Password || this.UserName || this.UserRole || this.FreeText) {

      let genderTrue: string = "Male"; // for free text search // manually because it is boolean
      let genderFalse: string = "Female"; // for free text search

      let freeText: string = form.value.FreeText ? form.value.FreeText.toLowerCase() : undefined;

      if ((freeText && freeText.indexOf("/") != -1)) { // for searching purposes: this.BirthDate is in format of yyyy-mm-dd and preview as dd/mm/yyyy so the serch is also in dd/mm/yyyy format as it presented to the client 
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

      this.filtersUsers = new UserStore(); // in this object the users that filtered inserted to

      for (let x of this.users.userList) { // all the users that has

        let cheacker: number = 0; // if the value is empty or equal to one of the cars value.
        // in both cases count it. alse if there is value and it not match don't preview this car

        console.log(x);
        if (freeText != undefined) {
          console.log("%c free text: " + freeText, 'background: red; color: white')
          if (x.BirthDate != null) {
            console.log("%c x.BirthDate.toString(): " + x.BirthDate.toString(), 'background: red; color: white')
          }
          if ((x.BirthDate && x.BirthDate.toString().indexOf(freeText) != -1) ||
            (x.Email && x.Email.toLowerCase().indexOf(freeText) != -1) ||
            (x.FullName && x.FullName.toLowerCase().indexOf(freeText) != -1) ||
            (x.ID && x.ID.indexOf(freeText) != -1) ||
            (x.Password && x.Password.toLowerCase().indexOf(freeText) != -1) ||
            (x.UserName && x.UserName.toLowerCase().indexOf(freeText) != -1) ||
            (x.UserRole && x.UserRole.toLowerCase().indexOf(freeText) != -1) ||
            (genderTrue.toLowerCase().indexOf(freeText) != -1 && x.Gender == true) ||
            (genderFalse.toLowerCase().indexOf(freeText) != -1 && x.Gender == false)
          ) { // if so that's mean that the free text, inserting by the user, do match 
            // (not case sesative) to some text in the current car
            cheacker++;
          }
        }
        else if (freeText == undefined || freeText == "") {
          cheacker++;
        }

        console.log("user.BirthDate: " + user.BirthDate)
        if (form.value.BirthDate != null && form.value.BirthDate != "") {
          if (x.BirthDate != null && user.BirthDate != null) {
            if (x.BirthDate.toString() == user.BirthDate.toString()) {
              console.log("true");
              cheacker++;
            }
          }
        }
        else if (form.value.BirthDate == null || user.BirthDate == undefined || user.BirthDate == "") {
          console.log("true");
          cheacker++;
        }

        console.log("user.Email: " + user.Email)
        if (x.Email != undefined && user.Email != undefined) { // for toLowerCase function
          if (x.Email.toLowerCase() == user.Email.toLowerCase()) {
            console.log("true");
            cheacker++;
          }
        }
        else if (user.Email == undefined) {
          console.log("true");
          cheacker++;
        }

        console.log("user.FullName: " + user.FullName)
        if (x.FullName != undefined && user.FullName != undefined) { // for toLowerCase function
          if (x.FullName.toLowerCase() == user.FullName.toLowerCase()) {
            console.log("true");
            cheacker++;
          }
        }
        else if (user.FullName == undefined) {
          console.log("true");
          cheacker++;
        }

        console.log("user.Gender: " + user.Gender) // boolean
        if (x.Gender == user.Gender) {
          console.log("true");
          cheacker++;
        }
        else if (user.Gender == undefined) {
          console.log("true");
          cheacker++;
        }

        console.log("user.ID: " + user.ID)
        if (x.ID == user.ID) {
          console.log("true");
          cheacker++;
        }
        else if (user.ID == undefined) {
          console.log("true");
          cheacker++;
        }

        console.log("user.Password: " + user.Password)
        if (user.Password != undefined) {  // for toLowerCase function
          if (x.Password.toLowerCase() == user.Password.toLowerCase()) {
            console.log("true");
            cheacker++;
          }
        }
        else if (user.Password == undefined) {
          console.log("true");
          cheacker++;
        }

        console.log("user.UserName: " + user.UserName)
        if (user.UserName != undefined) { // for toLowerCase function
          if (x.UserName.toLowerCase() == user.UserName.toLowerCase()) {
            console.log("true");
            cheacker++;
          }
        }
        else if (user.UserName == undefined) {
          console.log("true");
          cheacker++;
        }

        console.log("user.UserRole: " + user.UserRole)
        if (user.UserRole != undefined) { // for toLowerCase function
          if (x.UserRole.toLowerCase() == user.UserRole.toLowerCase()) {
            console.log("true");
            cheacker++;
          }
        }
        else if (user.UserRole == undefined) {
          console.log("true");
          cheacker++;
        }

        console.log(cheacker);

        if (cheacker == 9) { // if it equal to the number of search filds (9 in this case) the user on this iteration previwe

          console.log("%c on this case it is 9: ", 'background: yellow')
          this.filtersUsers.userList.push(x)
        }
        console.log("this.filtersUsers.userList: " + this.filtersUsers.userList);
        console.log("form: " + form.value);
      }
    }
    else {
      this.filtersUsers = null;
    }
  }

}