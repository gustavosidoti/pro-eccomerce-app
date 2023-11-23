import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient} from '@angular/common/http'
import { catchError, map} from 'rxjs/operators';
import { of } from 'rxjs';

// propios
import { URL_SERVICIOS } from '../../../config/config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user:any = null;
  token:any = null;

  constructor( private http: HttpClient,
                private router: Router) 
                { 
                  this.getLocalStorage()
                }

  getLocalStorage(){
    if(localStorage.getItem("token")){
      this.token = localStorage.getItem("token");
      this.user = JSON.parse(localStorage.getItem("user") ?? '');
    }else{
      this.token = null;
      this.user = null;   
    }
  }

  login(email: string, password: string){
    let URL = URL_SERVICIOS + "users/login"
    return this.http.post(URL,{email, password}).pipe(
      map((resp:any) =>{
        if(resp.USER_FRONTEND && resp.USER_FRONTEND.token){
          // SI TRAE TOKEN LO ALMACENAMOS EN LOCALSTORAGE
          return this.localStorageSave(resp.USER_FRONTEND);
        }else{
          // DEVUELVE EL STATUS
          return resp;
        }
      }),
      catchError((err:any)=>{
        console.log(err);
        return of(err);
      })
    )
  }


  localStorageSave( USER_FRONTEND: any){
    localStorage.setItem('token', USER_FRONTEND.token);
    localStorage.setItem('user', JSON.stringify(USER_FRONTEND.user));
    return true;
  }

  registro(data: any){
    let URL = URL_SERVICIOS + 'users/register';
    return this.http.post(URL, data);
  }

  logOut(){
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    this.router.navigate(["auth/login"])
  }


}
