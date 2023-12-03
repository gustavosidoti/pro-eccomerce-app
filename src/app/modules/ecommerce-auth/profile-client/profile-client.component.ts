import { Component, OnInit } from '@angular/core';
import { EcommerceAuthService } from '../_services/ecommerce-auth.service';

declare function alertDanger([]):any;
declare function alertWarning([]):any;
declare function alertSuccess([]):any;

@Component({
  selector: 'app-profile-client',
  templateUrl: './profile-client.component.html',
  styleUrls: ['./profile-client.component.css']
})
export class ProfileClientComponent implements OnInit {

  sale_orders:any = [];
  is_detail_sale:any = false;
  order_selected:any = null; 

  //direcciones
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

  // datos del cliente
  name_c:any = null;
  surname_c:any = null;
  email_c:any = null;
  password_c:any = null;
  password_repet_c:any = null;

  // review
  cantidad:any = 0;
  description:any = null;
  sale_detail_selected:any = null;

  constructor(
    public authEcommerceService: EcommerceAuthService,
  ) { }

  ngOnInit(): void {
    this.showProfileClient();

    // parsear los datos de las variables del formulario de datos del cliente
    this.name_c = this.authEcommerceService.authService.user.name;
    this.surname_c =this.authEcommerceService.authService.user.surname;
    this.email_c =this.authEcommerceService.authService.user.email;

  }

  showProfileClient(){
    // nos traemos al usuario registrado
    let data = {
      user_id: this.authEcommerceService.authService.user._id
    }

    // ejecucion de lo que debe traer al cargar
    this.authEcommerceService.showProfileClient(data).subscribe((resp:any) =>{
      console.log(resp);

      // cargamos todas sus ordenes de compra
      this.sale_orders = resp.sale_orders;
      // cargamos sus direcciones
      this.listAddressClient = resp.address_client;

    })
  }

  getDate(date:any){
    let newDate = new Date(date);

    return `${newDate.getFullYear()}/${newDate.getMonth()+1}/${newDate.getDate()}`;
  }

  viewDetailSale(order:any){
    this.is_detail_sale = true;
    this.order_selected = order;
  }

  // funcion del boton para volver atrás
  goHome(){
    this.is_detail_sale = false;
    this.order_selected = null;
  }

  // direcciones

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
      user: this.authEcommerceService.authService.user._id,
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
    this.authEcommerceService.registerAddressClient(data).subscribe((resp:any) => {
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
      user: this.authEcommerceService.authService.user._id,
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
    this.authEcommerceService.updateAddressClient(data).subscribe((resp:any) => {
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

  updateProfileClient(){

    // password repet
    if(this.password_c != this.password_repet_c){
      alertDanger("LAS CONTRASEÑAS NO COINCIDEN");
      return;
    }

    let data = {
      _id: this.authEcommerceService.authService.user._id,
      name:this.name_c,
      surname:this.surname_c,
      email:this.email_c,
      password:this.password_c,
    }

    this.authEcommerceService.updateProfileClient(data).subscribe{(resp:any) => {
      console.log(resp);
      alertSuccess(resp.message)
      if(resp.user){
        localStorage.setItem("user",JSON.stringify(resp.user));
      }
    }}
  }

  // Reseñas
  viewReview(sale_detail:any){
    this.sale_detail_selected = sale_detail;

    // si ese producto ya tiene una review la muestro
    if(this.sale_detail_selected.review){
      this.cantidad = this.sale_detail_selected.review.cantidad;
      this.description = this.sale_detail_selected.review.description;
    }else{
      this.cantidad = null;
      this.description = null;
    }
  }

  goDetail(){
    this.sale_detail_selected = null;
  }

  addCantidad(cantidad:number){
    this.cantidad = cantidad;
  }

  save(){
    if(this.sale_detail_selected.review){
      this.updateReview();
    }else{
      this.saveReview();
    }
  }

  saveReview(){

    // validamos los campos del formulario
    if(!this.cantidad || !this.description){
      alertDanger("COMPLETAR TODOS LOS CAMPOS DE RESEÑA");
      return;
    }

    let data = {
      product: this.sale_detail_selected.product._id,
      sale_detail: this.sale_detail_selected._id,
      user: this.authEcommerceService.authService.user._id,
      cantidad: this.cantidad,
      description: this.description,
    }

    this.authEcommerceService.registerProfileClientReview(data).subscribe((resp:any) =>{
      console.log(resp);
      this.sale_detail_selected.review = resp.review;
      alertSuccess(resp.message);
    })
  }

  updateReview(){
    // validamos los campos del formulario
    if(!this.cantidad || !this.description){
      alertDanger("COMPLETAR TODOS LOS CAMPOS DE RESEÑA");
      return;
    }

    let data = {
      _id: this.sale_detail_selected.review._id,
      product: this.sale_detail_selected.product._id,
      sale_detail: this.sale_detail_selected._id,
      user: this.authEcommerceService.authService.user._id,
      cantidad: this.cantidad,
      description: this.description,
    }

    this.authEcommerceService.updateProfileClientReview(data).subscribe((resp:any) =>{
      console.log(resp);
      this.sale_detail_selected.review = resp.review;
      alertSuccess(resp.message);
    })
  }

  // LOGOUT
  logout(){
    this.authEcommerceService.authService.logOut();
  }

}
