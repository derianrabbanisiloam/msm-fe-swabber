import { Injectable, Inject } from '@angular/core';
import { ActivatedRouteSnapshot, 
  RouterStateSnapshot, 
  UrlTree, 
  CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  )
  { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

      if(isPlatformBrowser(this.platformId)){
        const key = localStorage.getItem('key');
        
        if(key) {
          return true;
        }else {
          return this.router.navigate(['login'], { queryParams: { returnUrl: state.url } });
        }
      }
  }

  isLoggedIn() {
    if(isPlatformBrowser(this.platformId)){
      const key = localStorage.getItem('key');

      if(key) {
        return true;
      }else {
        return false;
      }
    }
  }
}
