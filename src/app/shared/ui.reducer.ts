import { UiAction, UiActionsEnum } from './ui.actions';

export interface State {
  isLoading: boolean;
}

const initialState: State = { isLoading: false };

export function uiReducer(
  state: State = initialState,
  action: UiAction
): State {
  switch (action.type) {
    case UiActionsEnum.START_LOADING:
      return {
        isLoading: true,
      };
    case UiActionsEnum.STOP_LOADING:
      return { isLoading: false };
    default:
      return state;
  }
}

export const getIsLoading = (state: State) => {
  return state.isLoading;
};
