import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EcommerceGuestComponent } from './ecommerce-guest.component';
import { FiltersProductsComponent } from './filters-products/filters-products.component';
import { LandingProductComponent } from './landing-product/landing-product.component';

const routes: Routes = [
  {
    path: '',
    component: EcommerceGuestComponent,
    children: [
      {
        path: 'landing-producto/:slug',
        component: LandingProductComponent,
      },
      {
        path: 'filtro-de-productos',
        component: FiltersProductsComponent,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EcommerceGuestRoutingModule { }
