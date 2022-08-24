import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import * as subHelpers from 'src/app/shared/subscription.helpers';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Output() sidenavToggled = new EventEmitter();
  isAuth: boolean;
  private authSubscription: Subscription;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authSubscription = this.authService.authChange.subscribe(
      (authStatus) => {
        this.isAuth = authStatus;
      }
    );
  }

  ngOnDestroy(): void {
    subHelpers.unsubscribeIfExist(this.authSubscription);
  }

  onToggleSidenav(): void {
    this.sidenavToggled.emit();
  }

  onLogout(): void {
    this.authService.logout();
  }
}
