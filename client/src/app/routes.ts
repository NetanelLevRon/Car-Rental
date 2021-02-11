import { Routes } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { RegisterComponent } from "./register/register.component";
import { LoginComponent } from "./login/login.component";
import { CarsComponent } from "./cars/cars.component";
import { CarPriceComponent } from "./car-price/car-price.component";
import { CarPreviewComponent } from "./car-preview/car-preview.component";
import { CarOrderComponent } from "./car-order/car-order.component";
import { OrderListComponent } from "./order-list/order-list.component";
import { OrderPreviewComponent } from "./order-preview/order-preview.component";
import { CarReturnComponent } from "./car-return/car-return.component";
import { CarStoreManagementComponent } from "./car-store-management/car-store-management.component";
import { CarTypeManagementComponent } from "./car-type-management/car-type-management.component";
import { OrderViewManagementComponent } from "./order-view-management/order-view-management.component";
import { UsersManagementComponent } from "./users-management/users-management.component";
import { PageNotFoundComponent } from "./page-not-found/page-not-found.component";
import { LogoutComponent } from "./logout/logout.component";
import { AuthGuard } from "./guards/auth.guard";
import { ContactComponent } from "./contact/contact.component";


export const appRoutes : Routes= [
    {
      path:'home', // all
      component:HomeComponent,
      children: [
        { path: 'contact-us', component: ContactComponent },
        { path: '', redirectTo: 'contact-us' , pathMatch: 'full'},
      ]
    },
    {
      path:'register', // only guest
      canActivate: [AuthGuard],
      data: ['guest'],
      component:RegisterComponent
    },
    {
      path:'login', // only guest
      canActivate: [AuthGuard],
      data: ['guest'],
      component:LoginComponent
    },
    {
      path:'logout', // customer, employee, admin
      canActivate: [AuthGuard],
      data: ['customer', 'employee', 'admin'],
      component:LogoutComponent
    },
    {
      path:'cars', // guest, customer
      canActivate: [AuthGuard],
      data: ['guest', 'customer'],
      component:CarsComponent,
      children: [
        { path: 'car-details', component: CarPreviewComponent },
        { path: 'car-price', component: CarPriceComponent },
        {
           path: 'car-order',
           canActivate: [AuthGuard],
           data: ['customer'],
            component: CarOrderComponent },
      ]
    },
    {
      path:'my-orders', // customer
      canActivate: [AuthGuard],
      data: ['customer'],
      component:OrderListComponent
    },
    {
      path:'my-orders/order-preview', // customer
      canActivate: [AuthGuard],
      data: ['customer'],
      component:OrderPreviewComponent
    },
    {
      path:'car-return', // employee
      canActivate: [AuthGuard],
      data: ['employee'],
      component:CarReturnComponent
    },
    {
      path:'car-store', // admin
      canActivate: [AuthGuard],
      data: ['admin'],
      component:CarStoreManagementComponent
    },
    {
      path:'car-type', // admin
      canActivate: [AuthGuard],
      data: ['admin'],
      component:CarTypeManagementComponent
    },
    {
      path:'orders', // admin
      canActivate: [AuthGuard],
      data: ['admin'],
      component:OrderViewManagementComponent
    },
    {
      path:'users', // admin
      canActivate: [AuthGuard],
      data: ['admin'],
      component:UsersManagementComponent
    },
    {
      path:'',
      redirectTo:'home',
      pathMatch:'full'
    },
    {
      path:'**',
      component:PageNotFoundComponent
    }
  
  ];