import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styles: [
  ]
})
export class LoginPageComponent {

    constructor(private authService: AuthService, private ruter: Router){}

    onLogin(): void{
      this.authService.login('','')
      .subscribe( resp => {
        this.ruter.navigate(['/']);
      } );
    }
}
