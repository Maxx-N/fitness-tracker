import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

import { UiService } from 'src/app/shared/ui.service';
import { AuthService } from '../auth.service';
import * as subHelpers from 'src/app/shared/subscription.helpers';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit, OnDestroy {
  maxDate: Date;
  isLoading = false;
  private loadingSubsciption: Subscription;

  constructor(private authService: AuthService, private uiService: UiService) {}

  ngOnInit(): void {
    this.loadingSubsciption = this.uiService.loadingStateChanged.subscribe(
      (result) => {
        this.isLoading = result;
      }
    );
    this.maxDate = new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
  }

  ngOnDestroy(): void {
    subHelpers.unsubscribeIfExist(this.loadingSubsciption);
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      this.authService.registerUser({
        email: form.value.email,
        password: form.value.password,
      });
    }
  }
}
