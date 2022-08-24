import { Action } from '@ngrx/store';

export enum UiActionsEnum {
  START_LOADING = '[UI] Start Loading',
  STOP_LOADING = '[UI] Stop Loading',
}

export class StartLoading implements Action {
  readonly type = UiActionsEnum.START_LOADING;
}

export class StopLoading implements Action {
  readonly type = UiActionsEnum.STOP_LOADING;
}

export type UiAction = StartLoading | StopLoading;
