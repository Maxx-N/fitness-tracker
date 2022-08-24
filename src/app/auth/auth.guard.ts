import { Injectable } from '@angular/core';
import {
  CanLoad,
  Route,
  Router, UrlSegment,
  UrlTree
} from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanLoad {
  constructor(private authService: AuthService, private router: Router) {}


  canLoad(route: Route, segments: UrlSegment[]): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    if (this.authService.isAuth()) {
      return true;
    } else {
      this.router.navigate(['login']);
      return false;
    }
  }
}
