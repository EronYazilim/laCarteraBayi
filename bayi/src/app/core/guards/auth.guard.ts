import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthenticationService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private auth: AuthenticationService
  ) { }

  
  canActivate() {    
    if (this.auth.authenticated) {
      return true;
    } else {
      this.router.navigateByUrl('/giris');
    }
  }
}

