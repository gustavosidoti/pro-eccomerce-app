import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../_services/auth.service';

declare function alertDanger([]):any;
declare function alertWarning([]):any;
declare function alertSuccess([]):any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email: string = '';
  password: string = '';

  constructor( public authService:AuthService,
              public router: Router) { }

  ngOnInit(): void {
    //console.log(this.authService.user);
    // SI HAY UN USUARIO LOGUEADO REDIRIGE AL HOME Y NO MUESTRA EL LOGIN
    if(this.authService.user){
      this.router.navigate(['/']);
    }
  }

  login(){

    if(!this.email){
      alertDanger('ES NECESARIO INGRESAR EL EMAIL')
    }

    if(!this.password){
      alertDanger('ES NECESARIO INGRESAR UNA CONTRASEÑA')
    }

    this.authService.login(this.email, this.password).subscribe((resp: any) => {
      console.log(resp);

      if(!resp.error){
        // EL USUARIO INGRESÓ CON EXITO
        this.router.navigate(["/"]);
      }else{
        alertDanger(resp.error.message)
      }
      
    })
  }

}
