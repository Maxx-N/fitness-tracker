import { Action } from '@ngrx/store';

export enum AuthActionsEnum {
  SET_AUTHENTICATED = '[Auth] Set Authenticated',
  SET_UNAUTHENTICATED = '[Auth] Set UnAuthenticated',
}

export class SetAuthenticated implements Action {
  readonly type = AuthActionsEnum.SET_AUTHENTICATED;
}

export class SetUnauthenticated implements Action {
  readonly type = AuthActionsEnum.SET_UNAUTHENTICATED;
}

export type AuthAction = SetAuthenticated | SetUnauthenticated;
