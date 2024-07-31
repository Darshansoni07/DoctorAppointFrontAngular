import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UserAccountService } from '../service/user-account.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {


  constructor(private router: Router, private accountService: UserAccountService){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      if(this.accountService.isLoggedIn())
      {
        debugger;
        const roles = localStorage.getItem('user_Role');
        const allowedRoles = route.data['roles'] as string[];
        
        if(roles === 'Admin' && allowedRoles.includes('Admin')){
          return true;
        }
        else if(roles === 'Doctor' && allowedRoles.includes('Doctor')){
          return true;
        }
        else if(roles === 'Assistant' && allowedRoles.includes('Assistant')){
          return true;
        }
        else if(roles === 'Client' && allowedRoles.includes('Client')){
          return true;
        }
        else{
          this.router.navigate(['/login']);
          return false;
        }
      }
      else{
        this.router.navigate(['/login']);
        return false;
      }
  }  
}