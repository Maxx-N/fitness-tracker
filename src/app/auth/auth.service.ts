import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

import { TrainingService } from '../training/training.service';
import { AuthData } from './auth-data.model';

@Injectable()
export class AuthService {
  authChange = new Subject<boolean>();
  private isAuthenticated: boolean = false;

  constructor(
    private router: Router,
    private auth: AngularFireAuth,
    private trainingService: TrainingService,
    private snackBar: MatSnackBar
  ) {}

  initAuthListener(): void {
    this.auth.authState.subscribe((user) => {
      if (user) {
        this.isAuthenticated = true;
        this.authChange.next(true);
        this.router.navigate(['training']);
      } else {
        this.trainingService.cancelSubscriptions();
        this.isAuthenticated = false;
        this.authChange.next(false);
        this.router.navigate(['login']);
      }
    });
  }

  registerUser(authData: AuthData): void {
    this.auth
      .createUserWithEmailAndPassword(authData.email, authData.password)
      .catch((error) => {
        this.snackBar.open(error.message, null, {
          duration: 3000,
        });
      });
  }

  login(authData: AuthData): void {
    this.auth
      .signInWithEmailAndPassword(authData.email, authData.password)
      .catch((error) => {
        this.snackBar.open(error.message, null, {
          duration: 3000,
        });
      });
  }

  logout(): void {
    this.auth.signOut();
  }

  isAuth(): boolean {
    return this.isAuthenticated;
  }
}
