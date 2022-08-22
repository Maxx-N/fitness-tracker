import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Subscription } from 'rxjs';

import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.scss'],
})
export class SidenavListComponent implements OnInit, OnDestroy {
  @Output() sidenavClosed = new EventEmitter();
  isAuth: boolean;
  private authsubscription: Subscription;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authsubscription = this.authService.authChange.subscribe(
      (result: boolean) => {
        this.isAuth = result;
      }
    );
  }

  ngOnDestroy(): void {
    this.authsubscription.unsubscribe();
  }

  onCloseSidenav() {
    this.sidenavClosed.emit();
  }

  onLogout(): void {
    this.authService.logout();
    this.sidenavClosed.emit();
  }
}
