import { Component, OnInit } from '@angular/core';
import { UserService } from '../shared/services/user.service';
import { User } from '../shared/models/user.model';
import { UploadImageService } from '../shared/services/image.service';
import { FullCarService } from '../shared/services/fullCar.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  public selectedUser: User = new User();
  public imgtemp: string;

  constructor(private _userService: UserService, private _imageService: UploadImageService,
    private _fullCarService: FullCarService) { }

  ngOnInit() {
    this.defoultUser();
  }

  defoultUser() {
    this.selectedUser.UserRole = "guest";
    this.selectedUser.Image = "../assets/images/defaultUserPic.png";
    console.log("%c before selectedUser" + this.selectedUser.Image.charAt(0), 'background: yellow; color: white')
  }

  enableCarsPreview(){ // initialize 'isInChildView' with false in order to allow the cars preview
    this._fullCarService.isInChildView = false;
  }

  ngDoCheck() {

    if (this._userService.isLogedOut || this._userService.isLogedIn) {
      this.selectedUser = this._userService.user;
      console.log("%c from header:\n this.selectedUser.UserRole: " + this.selectedUser.UserRole, 'background: yellow')
      this._userService.isLogedOut = false;
      this._userService.isLogedIn = false;

      if (this.selectedUser.Image != undefined && this.selectedUser.Image != "../assets/images/defaultUserPic.png") {
        this.imgtemp = this.selectedUser.Image;
        if (this.selectedUser.Image.toLowerCase().indexOf("http") == -1) { // if 'http' exist that's mean that the url prefix added => to prevant insert repeatedly the url prefix
          this.selectedUser.Image = this._imageService.imageUrlPrefix + this.imgtemp;
        }
      }
      else {
        this.selectedUser.Image = "../assets/images/defaultUserPic.png";
      }
    }
  }
}