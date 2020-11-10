import { AuthService } from './../services/auth.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, Route } from '@angular/router';
import { Observable } from 'rxjs';
import { TokenStorageService } from '../services/token-storage.service';


@Injectable()
export class AuthGuardService implements CanActivate {

  isLoggedIn = false;


  constructor(
    private authService: AuthService, 
    private tokenStorageService: TokenStorageService, 
    private _router: Router) {
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    this.isLoggedIn = !!this.tokenStorageService.getToken();
   
    if (this.isLoggedIn) {
        return true;
    }
    this._router.navigate(['/authentication']);
    return false;
  }

}