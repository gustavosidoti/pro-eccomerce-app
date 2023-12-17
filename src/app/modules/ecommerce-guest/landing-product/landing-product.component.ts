import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EcommerceGuestService } from '../_services/ecommerce-guest.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from '../_services/cart.service';
import * as $ from 'jquery';
//import $ from "jquery";
//import $ = require("jquery");

// funciones de renderizado. Esta función está al final del main.js
declare function LandingProductDetail():any;
declare function ModalProductDetail():any;
declare function alertDanger([]):any;
declare function alertWarning([]):any;
declare function alertSuccess([]):any;
@Component({
  selector: 'app-landing-product',
  templateUrl: './landing-product.component.html',
  styleUrls: ['./landing-product.component.css']
})
export class LandingProductComponent implements OnInit {

  slug:any = null;
  product_selected:any = null;
  product_selected_modal:any = null;
  related_products:any = [];
  variedad_selected:any = null;
  

  discount_id:any;
  SALE_FLASH:any = null;

  REVIEWS: any;
  AVG_REVIEW: any;
  COUNT_REVIEW: any;

  constructor(
    public ecommerce_guest: EcommerceGuestService,
    public router: Router,
    public routerActived: ActivatedRoute,
    public cartService: CartService
  ) { }

  ngOnInit(): void {
    this.routerActived.params.subscribe((resp:any) =>{
      this.slug = resp["slug"];
      
    })

    // extraemos el id del descuento de los parametros de ruta
    this.routerActived.queryParams.subscribe((resp:any) => {
      this.discount_id = resp["_id"];
    })
    

    this.ecommerce_guest.showLandingProduct(this.slug, this.discount_id).subscribe((resp:any) =>{
      console.log(resp);
      this.product_selected = resp.product;
      this.related_products = resp.related_products;
      this.SALE_FLASH = resp.SALE_FLASH;
      this.REVIEWS = resp.REVIEWS;
      this.AVG_REVIEW = resp.AVG_REVIEW;
      this.COUNT_REVIEW = resp.COUNT_REVIEW;
      // para que cargue los estilos
      setTimeout(() => {
        LandingProductDetail()
      }, 50);

    })
  }

  OpenModal(bestProd:any,FlashSale:any = null){
    this.product_selected_modal = null;

    setTimeout(() => {
      this.product_selected_modal = bestProd;
      this.product_selected_modal.FlashSale = FlashSale;
      setTimeout(() => {
        ModalProductDetail();
      }, 50);
    }, 100);

  }

  getCalNewPrice(product:any){
   /* if(this.FlashSale.type_discount == 1){
      return product.price_soles - product.price_soles*this.FlashSale.discount*0.01;
    }else{
      return product.price_soles - this.FlashSale.discount;
    } */
    return 0;
  }

  selectedVariedad(variedad:any){
    this.variedad_selected = variedad;
  }

  getDiscount(){
    let discount = 0;
    if(this.SALE_FLASH){
      if(this.SALE_FLASH.type_discount == 0){
        return this.SALE_FLASH.discount * this.product_selected.priceUSD * 0.01;
      }else{
        return this.SALE_FLASH.discount;
      }
    } 
    // sino viene nada se retorna 0;
   return discount;
  }

  addCart(product:any){
    
    // VALIDACION 1 estar autenticado
    if(!this.cartService._authService.user){

      alertDanger("NECESITAS AUTENTICARTE PARA PODER AGREGAR EL PRODUCTO AL CARRITO")
      return;
    }

    // VALIDACION 2 que haya cantidad seleccionada superior a 0
    if($("#qty-cart").val() == 0){ // obtenemos con jquery el id del input cantidad
      alertDanger("NECESITAS AGREGAR UNA CANTIDAD MAYOR A 0 DEL PRODUCTO")
      return;
    }

    // VALIDACION 3 si se trata de un producto con multiples variedades
    if(this.product_selected.type_inventario == 2){
      
      // VALIDACION 3.1 si no seleccionó variedad
      if(!this.variedad_selected){
        alertDanger("NECESITAS SELECCIONAR UNA VARIEDAD PARA EL PRODUCTO")
        return;
      }

      // VALIDACION 3.2 si la hay stock de la variedad seleccionada
      if(this.variedad_selected){
        if(this.variedad_selected.stock < $("#qty-cart").val()){
          alertDanger("NECESITAS AGREGAR UNA CANTIDAD MENOR PORQUE NO SE TIENE EL STOCK SUFICIENTE")
          return;
        }
      }
    }


    let data:any = {
      user: this.cartService._authService.user._id,
      product: this.product_selected._id,
      type_discount: this.SALE_FLASH ?  this.SALE_FLASH.type_discount : null,
      discount: this.SALE_FLASH ?  this.SALE_FLASH.discount : 0,
      cantidad: $("#qty-cart").val(),
      variedad: this.variedad_selected ? this.variedad_selected._id : null,
      code_cupon: null,
      code_discount: this.SALE_FLASH ? this.SALE_FLASH._id : null,
      price_unitario: this.product_selected.priceUSD,
      subtotal: this.product_selected.priceUSD - this.getDiscount(),
      total: (this.product_selected.priceUSD - this.getDiscount())* (+$("#qty-cart").val()),
    }

    // Registramos el carro
    this.cartService.registerCart(data).subscribe((resp:any) => {
      if(resp.message == 403){
        alertDanger(resp.message_text);
        return;
      }else{
        
        this.cartService.changeCart(resp.cart);
        alertSuccess("EL PRODUCTO SE HA AGREGADO EXITOSAMENTE AL CARRO")
      }
      // SI HAY UN ERROR DE TOKEN NOS SALDRÁ POR AQUÍ
    }, error => {
      console.log(error);
      if(error.error.message == "EL TOKEN NO ES VÁLIDO"){
        this.cartService._authService.logOut();
      }
    })
    //le avisamos al observable que la lista del carro cambió
    this.cartService.changeCart(product);
  }


}
