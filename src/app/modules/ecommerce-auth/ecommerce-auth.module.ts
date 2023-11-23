import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EcommerceAuthRoutingModule } from './ecommerce-auth-routing.module';
import { EcommerceAuthComponent } from './ecommerce-auth.component';
import { ListCartsComponent } from './list-carts/list-carts.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { CheckoutComponent } from './checkout/checkout.component';


@NgModule({
  declarations: [EcommerceAuthComponent, ListCartsComponent, CheckoutComponent],
  imports: [
    CommonModule,
    EcommerceAuthRoutingModule,
    //
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    SharedModule
  ]
})
export class EcommerceAuthModule { }
