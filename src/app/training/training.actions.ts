import { Action } from '@ngrx/store';

import { Exercise } from './exercise.model';

export enum TrainingActionsEnum {
  SET_AVAILABLE_EXERCISES = '[Training] Set Available Exercises',
  SET_FINISHED_EXERCISES = '[Training] Set Finished Exercises',
  START_TRAINING = '[Training] Start Training',
  STOP_TRAINING = '[Training] Stop Training',
}

export class SetAvailableExercises implements Action {
  readonly type = TrainingActionsEnum.SET_AVAILABLE_EXERCISES;
  constructor(public payload: Exercise[]) {}
}
export class SetFinishedExercises implements Action {
  readonly type = TrainingActionsEnum.SET_FINISHED_EXERCISES;
  constructor(public payload: Exercise[]) {}
}
export class StartTraining implements Action {
  readonly type = TrainingActionsEnum.START_TRAINING;
  constructor(public payload: string) {}
}
export class StopTraining implements Action {
  readonly type = TrainingActionsEnum.STOP_TRAINING;
}

export type TrainingAction =
  | SetAvailableExercises
  | SetFinishedExercises
  | StartTraining
  | StopTraining;
