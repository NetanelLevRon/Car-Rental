import { Component, OnInit } from '@angular/core';
import { UserService } from '../shared/services/user.service';
import { User } from '../shared/models/user.model';
import { FullCarService } from '../shared/services/fullCar.service';
import { FullCarStore } from '../shared/models/fullCar-store.model';
import { FullCar } from '../shared/models/fullCar.model';
import { UploadImageService } from '../shared/services/image.service';

@Component({
  selector: 'app-car-preview',
  templateUrl: './car-preview.component.html',
  styleUrls: ['./car-preview.component.css']
})
export class CarPreviewComponent implements OnInit {

  public user: User = new User();
  public fullCarInfo : FullCarStore = new FullCarStore();
  public currentCar : FullCar = new FullCar();

  constructor(private _userServise : UserService, private _fullCarService : FullCarService,
     private _imageService: UploadImageService) { } // _imageService for the default car pic in the html

  ngOnInit() {
    this.setUser(); 
    this.currentCar = this._fullCarService.fullCar;
  }

 /**
   * set the user for gurds and for authorization
   */
  setUser() {
    setTimeout(() => {
      if (this._userServise.user.UserRole != undefined) {
        this.user = this._userServise.user;
      }
      else {
        this._userServise.defaultUser();
        this.setUser();
      };
    }, 50);
  }
  
}
