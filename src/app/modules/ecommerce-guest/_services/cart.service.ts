import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../../auth-profile/_services/auth.service';
import { HttpClient, HttpHandler, HttpHeaders } from '@angular/common/http';
import { URL_SERVICIOS } from '../../../config/config';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  // creamos observable para que este pendiente de los productos seleccionados para el carro
  public cart = new BehaviorSubject<Array<any>>([]);
  public currentDataCart$ = this.cart.asObservable();
  
  constructor(
    public _authService: AuthService,
    public http: HttpClient
  ) { }

  changeCart(DATACART:any){
    let listCart = this.cart.getValue(); // obtenemos el cars del observable

    // buscamos si hay un carro con ese indice
    let INDEX = listCart.findIndex((item:any) => item._id == DATACART._id);
    if(INDEX != -1){
      // si hay carro lo actualizamos
      listCart[INDEX] = DATACART; 
    }else{
      // si no hay carro se agrega al comienzo
      listCart.unshift(DATACART);
    }
    // le avisamos al observable que cart ha cambiado
    this.cart.next(listCart);
  }

  resetCart(){
    let listCart:any = [];
    // le avisamos al observable que cart ha cambiado
    this.cart.next(listCart);
  }

  removeItemCart(DATACART:any){
    let listCart = this.cart.getValue(); // obtenemos el cars del observable

      // buscamos si hay un carro con ese indice
      let INDEX = listCart.findIndex((item:any) => item._id == DATACART._id);
      if(INDEX != -1){
        // si hay carro lo eliminamos
        listCart.splice(INDEX, 1)
      
      // le avisamos al observable que cart ha cambiado
      this.cart.next(listCart);
      }
  }

  registerCart(data:any){
    let headers = new HttpHeaders({'token': this._authService.token});
    let URL = URL_SERVICIOS+"cart/register";
    return this.http.post(URL,data,{headers: headers});
  }

  listCarts(user_id:any){
    let headers = new HttpHeaders({'token': this._authService.token});
    let URL = URL_SERVICIOS+"cart/list?user_id="+user_id;
    return this.http.get(URL,{headers: headers});
  }

  updateCart(data:any){
    let headers = new HttpHeaders({'token': this._authService.token});
    let URL = URL_SERVICIOS+"cart/update";
    return this.http.put(URL,data,{headers: headers});
  }

  deleteCart(cart_id:any){
    let headers = new HttpHeaders({'token': this._authService.token});
    let URL = URL_SERVICIOS+"cart/delete/"+cart_id;
    return this.http.delete(URL,{headers: headers});
  }

  aplicarCupon(data:any){
    let headers = new HttpHeaders({'token': this._authService.token});
    let URL = URL_SERVICIOS+"cart/aplicar_cupon";
    return this.http.post(URL,data,{headers: headers});
  }

}
