import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../Service/authentication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

constructor(private authService :  AuthenticationService ,private router : Router){

}



// enableDisableRule() {
//     this.logged = !this.logged;
// }
   isLoggedIn():boolean{
    return this.authService.isLoggedIn();
}

logout(){
  this.authService.logout();
  this.router.navigate(["/log-in"]);
}

 
}
