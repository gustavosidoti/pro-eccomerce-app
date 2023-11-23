import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(public authService: AuthService,
              public router: Router){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      // PRIMERO VERIFICAMOS SI HAY TOKEN O USUARIO EN LOCALSTORAGE
      if(!this.authService.user || !this.authService.token){
        this.router.navigate(['auth/login'])
        return false
      }
      
      // AHORA REVISAMOS SI LA CADUCIDAD ES CORRECTA
      let token = this.authService.token;

      let expiration = (JSON.parse(atob(token.split('.')[1]))).exp; // para obtener solo el campo de expiracion del token

      if(Math.floor((new Date).getTime() / 1000) >= expiration){
        this.authService.logOut();
        return false;
      }
    return true;
  }
  
}
