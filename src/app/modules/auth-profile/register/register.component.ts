import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { Router } from '@angular/router';

declare function alertDanger([]):any;
declare function alertWarning([]):any;
declare function alertSuccess([]):any;
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  email:string = "";
  name: string = "";
  surname: string = "";
  password: string = "";
  repeatPassword: string = "";

  constructor(public authService: AuthService,
              public router: Router) { }

  ngOnInit(): void {
    // SI HAY UN USUARIO LOGUEADO REDIRIGE AL HOME Y NO MUESTRA EL REGISTRO
    if(this.authService.user){
      this.router.navigate(['/']);
    }
  }

  registro(){

    if(
      !this.email ||
      !this.name ||
      !this.surname ||
      !this.password ||
      !this.repeatPassword
    ){
      alertDanger('TODOS LOS CAMPOS SON REQUERIDOS')
    }

    if(this.password != this.repeatPassword){
      alertDanger('LAS CONTRASEÑAS NO COINCIDEN')
    }

    let data = {
      email: this.email,
      name: this.name,
      surnamame: this.surname, 
      password: this.password,
      repeatPassword: this.repeatPassword,
      rol: "cliente"
    }

    this.authService.registro(data).subscribe((resp:any) =>{
        console.log(resp);
    })
  }

}
