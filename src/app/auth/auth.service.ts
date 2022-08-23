import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';

import { AuthData } from './auth-data.model';
import { User } from './user.model';

@Injectable()
export class AuthService {
  authChange = new Subject<boolean>();
  private isAuthenticated: boolean = false;

  constructor(private router: Router, private auth: AngularFireAuth) {}

  registerUser(authData: AuthData): void {
    this.auth
      .createUserWithEmailAndPassword(authData.email, authData.password)
      .then((result) => {
        console.log(result);
        this.authSuccessfully();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  login(authData: AuthData): void {
    this.auth
      .signInWithEmailAndPassword(authData.email, authData.password)
      .then((result) => {
        console.log(result);
        this.authSuccessfully();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  logout(): void {
    this.isAuthenticated = false;
    this.authChange.next(false);
    this.router.navigate(['login']);
  }

  isAuth(): boolean {
    return this.isAuthenticated;
  }

  private authSuccessfully(): void {
    this.isAuthenticated = true;
    this.authChange.next(true);
    this.router.navigate(['training']);
  }
}
