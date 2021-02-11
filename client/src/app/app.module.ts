import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { MainComponent } from './main/main.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { CarsComponent } from './cars/cars.component';
import { CarPriceComponent } from './car-price/car-price.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { CarPreviewComponent } from './car-preview/car-preview.component';
import { CarOrderComponent } from './car-order/car-order.component';
import { OrderListComponent } from './order-list/order-list.component';
import { OrderPreviewComponent } from './order-preview/order-preview.component';
import { CarReturnComponent } from './car-return/car-return.component';
import { OrderViewManagementComponent } from './order-view-management/order-view-management.component';
import { CarStoreManagementComponent } from './car-store-management/car-store-management.component';
import { CarTypeManagementComponent } from './car-type-management/car-type-management.component';
import { UsersManagementComponent } from './users-management/users-management.component';
import { UserService } from './shared/services/user.service';
import { UploadImageService } from './shared/services/image.service';
import { CarService } from './shared/services/car.service';
import { CarTypeService } from './shared/services/carType.service';
import { BranchService } from './shared/services/branch.service';
import { OrderService } from './shared/services/order.service';
import { FullCarService } from './shared/services/fullCar.service';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { appRoutes } from './routes';
import { LogoutComponent } from './logout/logout.component';
import { AuthGuard } from './guards/auth.guard';
import { ContactComponent } from './contact/contact.component';
import { EmailService } from './shared/services/email.service';



@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MainComponent,
    FooterComponent,
    HomeComponent,
    RegisterComponent,
    LoginComponent,
    CarsComponent,
    CarPriceComponent,
    PageNotFoundComponent,
    CarPreviewComponent,
    CarOrderComponent,
    OrderListComponent,
    OrderPreviewComponent,
    CarReturnComponent,
    OrderViewManagementComponent,
    CarStoreManagementComponent,
    CarTypeManagementComponent,
    UsersManagementComponent,
    LogoutComponent,
    ContactComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    SlickCarouselModule
  ],
  providers: [
    UserService,
    UploadImageService,
    CarService,
    CarTypeService,
    BranchService,
    OrderService,
    FullCarService,
    AuthGuard,
    EmailService,
    HeaderComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
