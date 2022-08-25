import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Exercise } from './exercise.model';
import { TrainingAction, TrainingActionsEnum } from './training.actions';
import * as fromRoot from 'src/app/app.reducer';

export interface TrainingState {
  availableExercises: Exercise[];
  finishedExercises: Exercise[];
  activeTraining: Exercise;
}

export interface State extends fromRoot.State {
  training: TrainingState;
}

const initialState: TrainingState = {
  availableExercises: [],
  finishedExercises: [],
  activeTraining: null,
};

export function trainingReducer(
  state: TrainingState = initialState,
  action: TrainingAction
): TrainingState {
  switch (action.type) {
    case TrainingActionsEnum.SET_AVAILABLE_EXERCISES:
      return {
        ...state,
        availableExercises: action.payload,
      };
    case TrainingActionsEnum.SET_FINISHED_EXERCISES:
      return { ...state, finishedExercises: action.payload };
    case TrainingActionsEnum.START_TRAINING:
      return {
        ...state,
        activeTraining: state.availableExercises.find(
          (ex) => ex.id === action.payload
        ),
      };
    case TrainingActionsEnum.STOP_TRAINING:
      return { ...state, activeTraining: null };
    default:
      return state;
  }
}

export const getTrainingState = createFeatureSelector('training');

export const getAvailableExercices = createSelector(
  getTrainingState,
  (state: TrainingState) => state.availableExercises
);
export const getFinishedExercises = createSelector(
  getTrainingState,
  (state: TrainingState) => state.finishedExercises
);
export const getActiveTraining = createSelector(
  getTrainingState,
  (state: TrainingState) => state.activeTraining
);
export const getIsTrainingActive = createSelector(
  getTrainingState,
  (state: TrainingState) => !!state.activeTraining
);
