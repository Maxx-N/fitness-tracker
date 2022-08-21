import { Subject } from 'rxjs';
import { AuthData } from './auth-data.model';
import { User } from './user.model';

export class AuthService {
  authChange = new Subject<boolean>();
  private user: User;

  registerUser(authData: AuthData): void {
    this.user = {
      email: authData.email,
      userId: Math.round(Math.random() * 10000).toString(),
    };
    this.authChange.next(true);
  }

  login(authData: AuthData): void {
    this.user = {
      email: authData.email,
      userId: Math.round(Math.random() * 10000).toString(),
    };
    this.authChange.next(true);
  }

  logout(): void {
    this.user = null;
    this.authChange.next(false);
  }

  getUser(): User {
    return { ...this.user };
  }

  isAuth(): boolean {
    return !!this.user;
  }
}
