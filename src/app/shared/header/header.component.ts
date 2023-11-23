import { analyzeAndValidateNgModules } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from 'src/app/modules/ecommerce-guest/_services/cart.service';



@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  listCarts:any = [];
  totalCarts:any = 0;

  constructor(
    public router: Router,
    public cartService: CartService
  ) { }

  ngOnInit(): void {
    // esto es por si hay un cambio en la lista del carro
    this.cartService.currentDataCart$.subscribe((resp:any) => {
      console.log(resp);
      this.listCarts = resp;
      this.totalCarts = this.listCarts.reduce((sum:any, item:any) => sum + item.total, 0); 
    })
     // validamos si esta autenticado el usuario
     if(this.cartService._authService.user){
          // llamamos a una función que cargue el carro del usuario por si alguién refresca la página
          this.cartService.listCarts(this.cartService._authService.user._id).subscribe((resp:any) =>{
            console.log(resp);
            //this.listCarts = resp.carts;
            //llamamos al observable para que nos actualice la lista
            resp.carts.forEach((cart:any) => {
              this.cartService.changeCart(cart);
            });

           
          });
      }
  }

  isHome(){
   return this.router.url == "" || this.router.url == "/" ? true : false;
  }

}
