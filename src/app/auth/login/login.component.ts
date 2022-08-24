import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { UiService } from 'src/app/shared/ui.service';
import { AuthService } from '../auth.service';
import * as subHelpers from 'src/app/shared/subscription.helpers';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  isLoading = false;
  private loadingSubsciption: Subscription;

  constructor(private authService: AuthService, private uiService: UiService) {}

  ngOnInit(): void {
    this.loadingSubsciption = this.uiService.loadingStateChanged.subscribe(
      (result) => {
        this.isLoading = result;
      }
    );

    this.loginForm = new FormGroup({
      email: new FormControl('', {
        validators: [Validators.required, Validators.email],
      }),
      password: new FormControl('', { validators: [Validators.required] }),
    });
  }

  ngOnDestroy(): void {
    subHelpers.unsubscribeIfExist(this.loadingSubsciption);
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.authService.login({
        email: this.loginForm.value.email,
        password: this.loginForm.value.password,
      });
    }
  }
}
