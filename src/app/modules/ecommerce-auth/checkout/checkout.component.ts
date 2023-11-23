import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CartService } from '../../ecommerce-guest/_services/cart.service';
import { EcommerceAuthService } from '../_services/ecommerce-auth.service';

declare function alertDanger([]):any;
declare function alertWarning([]):any;
declare function alertSuccess([]):any;

declare var paypal:any;



@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  // esto hace referencia al div que se encuentra en la plantilla html
  @ViewChild('paypal',{static: true}) paypalElement?: ElementRef;

  listAddressClient:any = [];
  name:any = null;
  surname:any = null;
  address:any = null;
  region:any = null;
  ciudad:any = null;
  telefono:any = null;
  email:any = null;
  nota:any = null;
  pais:any = null;
  referencia:any = null;

  address_client_selected:any = null;

  listCarts:any = [];
  totalCarts:any = 0;
  constructor(
    public authEcommerce: EcommerceAuthService,
    public cartService: CartService
  ) { }

  ngOnInit(): void {
    console.log("esto es "+this.authEcommerce.authService.user._id)
    this.authEcommerce.listAddressClient(this.authEcommerce.authService.user._id).subscribe((resp:any) => {
      console.log(resp);
      this.listAddressClient = resp.address_client;
    })

    this.cartService.currentDataCart$.subscribe((resp:any) => {
        //llenamos el listado con los productos del carro
        this.listCarts = resp;
        this.totalCarts = this.listCarts.reduce((sum:any,item:any) => sum + item.total, 0);
    })

    // RELACION CON PAYPAL
    paypal.Buttons({
      // optional styling for buttons
      // https://developer.paypal.com/docs/checkout/standard/customize/buttons-style-guide/
      style: {
        color: "gold",
        shape: "rect",
        layout: "vertical"
      },

      // set up the transaction
      createOrder: (data:any, actions:any) => {
          // pass in any options from the v2 orders create call:
          // https://developer.paypal.com/api/orders/v2/#orders-create-request-body

          const createOrderPayload = {
            purchase_units: [
              {
                amount: {
                    description: "COMPRAR POR EL ECOMMERCE",
                    value: 50
                }
              }
            ]
          };

          return actions.order.create(createOrderPayload);
      },

      // finalize the transaction
      onApprove: async (data:any, actions:any) => {
          
          let Order = await actions.order.capture();
  
  // Order.purchase_units[0].payments.captures[0].id

         // return actions.order.capture().then(captureOrderHandler);
      },

      // handle unrecoverable errors
      onError: (err:any) => {
          console.error('An error prevented the buyer from checking out with PayPal');
      }
      }).render(this.paypalElement?.nativeElement);
  }

  store(){
    if(this.address_client_selected){
      this.updateAddress();
    }else{
      this.registerAddress()
    }
  }

  registerAddress(){

    if(!this.name ||
      !this.surname ||
      !this.pais ||
      !this.address ||
      !this.region ||
      !this.ciudad ||
      !this.telefono ||
      !this.email){
      alertDanger("NECESITAS INGRESAR LOS CAMPOS OBLIGATORIOS DE LA DIRECCION");
      return;
    }

    let data = {
      client: this.authEcommerce.authService.user._id,
      name: this.name,
      surname: this.surname,
      pais: this.pais,
      address: this.address,
      referencia: this.referencia,
      region: this.region,
      ciudad: this.ciudad,
      telefono: this.telefono,
      email: this.email,
      nota: this.nota,
    }
    this.authEcommerce.registerAddressClient(data).subscribe((resp:any) => {
      console.log(resp);
      this.listAddressClient.push(resp.address_client);
      alertSuccess(resp.message);
      this.resetFormulario();
    
    })
  }

  updateAddress(){
    if(!this.name ||
      !this.surname ||
      !this.pais ||
      !this.address ||
      !this.region ||
      !this.ciudad ||
      !this.telefono ||
      !this.email){
      alertDanger("NECESITAS INGRESAR LOS CAMPOS OBLIGATORIOS DE LA DIRECCION");
      return;
    }

    let data = {
      _id: this.address_client_selected._id,
      client: this.authEcommerce.authService.user._id,
      name: this.name,
      surname: this.surname,
      pais: this.pais,
      address: this.address,
      referencia: this.referencia,
      region: this.region,
      ciudad: this.ciudad,
      telefono: this.telefono,
      email: this.email,
      nota: this.nota,
    }
    this.authEcommerce.updateAddressClient(data).subscribe((resp:any) => {
      console.log(resp);
      // al ser un update cambia esta parte en relacion al register
      let INDEX = this.listAddressClient.findIndex(item => item._id == this.address_client_selected._id);
      this.listAddressClient[INDEX] = resp.address_client;
      alertSuccess(resp.message);
    })
  }

  resetFormulario(){
    this.name = null;
    this.surname = null;
    this.pais = null;
    this.address = null;
    this.referencia = null;
    this.region = null;
    this.ciudad = null;
    this.telefono = null;
    this.email = null;
    this.nota = null;
  }

  newAddress(){
    this.resetFormulario();
    this.address_client_selected = null;
  }

  addressClientSelected(list_address:any){
    this.address_client_selected = list_address;
    this.name = this.address_client_selected.name;
    this.surname = this.address_client_selected.surname;
    this.pais = this.address_client_selected.pais;
    this.address = this.address_client_selected.address;
    this.referencia = this.address_client_selected.referencia;
    this.region = this.address_client_selected.region;
    this.ciudad = this.address_client_selected.ciudad;
    this.telefono = this.address_client_selected.telefono;
    this.email = this.address_client_selected.email;
    this.nota = this.address_client_selected.nota;
    
  }

}
