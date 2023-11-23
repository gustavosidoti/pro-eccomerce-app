import { Component, OnInit } from '@angular/core';

/*declare var $:any;
declare function homeTemplate([]):any;*/
declare function sideOffcanvasToggle([],[]):any; // parche para que se abra el carro
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'eccomerce';
  ngOnInit(): void {
    /*setTimeout(() =>{
      homeTemplate($);
    }, 50);*/

    setTimeout(() => {
      sideOffcanvasToggle('.cart-dropdown-btn','#cart-dropdown');
    }, 50);
    
  }
}
