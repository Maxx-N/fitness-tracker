import { Injectable } from '@angular/core';
import { CanLoad, Route, Router, UrlSegment, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, tap } from 'rxjs';

import * as fromRoot from 'src/app/app.reducer';

@Injectable()
export class AuthGuard implements CanLoad {
  constructor(private store: Store<fromRoot.State>, private router: Router) {}

  canLoad(
    route: Route,
    segments: UrlSegment[]
  ):
    | boolean| UrlTree| Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return this.store.select(fromRoot.getIsAuthenticated)
      .pipe(
        tap((isAuth) => {
          if(!isAuth) {
            this.router.navigate(['login']);
          }
        })
      );
  }
}
