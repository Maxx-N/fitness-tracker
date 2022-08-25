import { AuthAction, AuthActionsEnum } from './auth.actions';

export interface State {
  isAuthenticated: boolean;
}

const initialState: State = {
  isAuthenticated: false,
};

export function authReducer(
  state: State = initialState,
  action: AuthAction
): State {
  switch (action.type) {
    case AuthActionsEnum.SET_AUTHENTICATED:
      return { isAuthenticated: true };
    case AuthActionsEnum.SET_UNAUTHENTICATED:
      return { isAuthenticated: false };
    default:
      return state;
  }
}

export const getIsAuthenticated = (state: State) => {
  return state.isAuthenticated;
};
