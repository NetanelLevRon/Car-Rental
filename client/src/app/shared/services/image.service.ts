import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class UploadImageService {

  public imageUrlPrefix: string = "http://localhost:53312/Image/";
  public defaultUserImg: string = "../assets/images/defaultUserPic.png";
  public defaultCarImg: string = "../assets/images/default-cars.jpeg";

  constructor(private http: HttpClient) { }

  postFile(caption: string, fileToUpload: File) {
    const serverUrl = 'http://localhost:53312/api/UploadImage';
    const formData: FormData = new FormData();
    formData.append('Image', fileToUpload/* , fileToUpload.name */);
    formData.append('ImageCaption', caption);
    return this.http.post(serverUrl, formData);
  }

}