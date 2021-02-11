import { Component, OnInit } from '@angular/core';
import { FullCarService } from '../shared/services/fullCar.service';
import { FullCar } from '../shared/models/fullCar.model';
import { UploadImageService } from '../shared/services/image.service';

@Component({
  selector: 'app-order-preview',
  templateUrl: './order-preview.component.html',
  styleUrls: ['./order-preview.component.css']
})
export class OrderPreviewComponent implements OnInit {

  public currentCar: FullCar = new FullCar();

  constructor(private _fullCarService: FullCarService,
    private _imageService: UploadImageService) { } // _imageService for the default car pic in the html

  ngOnInit() {
    this.currentCar = this._fullCarService.fullCar;
  }

}