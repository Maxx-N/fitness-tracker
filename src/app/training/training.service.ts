import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, Subject, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { UiService } from '../shared/ui.service';
import { Exercise } from './exercise.model';
import * as subHelpers from 'src/app/shared/subscription.helpers';
import * as fromRoot from 'src/app/app.reducer';
import * as UI from 'src/app/shared/ui.actions';

@Injectable()
export class TrainingService {
  runningExerciseChanged = new Subject<Exercise>();
  availableExercisesChanged = new Subject<Exercise[]>();
  pastExercisesChanged = new Subject<Exercise[]>();
  private runningExercise: Exercise;
  private availableExercises: Exercise[];
  private firebaseSubscriptions: Subscription[] = [];

  constructor(
    private db: AngularFirestore,
    private uiService: UiService,
    private store: Store<fromRoot.State>
  ) {}

  fetchAvailableExercises(): void {
    this.store.dispatch(new UI.StartLoading());
    this.firebaseSubscriptions.push(
      this.db
        .collection('availableExercises')
        .snapshotChanges()
        .pipe(
          map((resultArray) => {
            return resultArray.map((result) => {
              return {
                id: result.payload.doc.id,
                ...(result.payload.doc.data() as {
                  name: string;
                  duration: number;
                  calories: number;
                }),
              };
            });
          })
        )
        .subscribe({
          next: (exercises: Exercise[]) => {
            this.store.dispatch(new UI.StopLoading());

            this.availableExercises = exercises;
            this.availableExercisesChanged.next([...this.availableExercises]);
          },
          error: () => {
            this.store.dispatch(new UI.StopLoading());
            this.uiService.showSnackbar(
              'Fetching exercises failed. Please try again later.',
              null,
              3000
            );
            this.availableExercisesChanged.next(null);
          },
        })
    );
  }

  fetchPastExercises(): void {
    this.firebaseSubscriptions.push(
      this.db
        .collection('finishedExercises')
        .valueChanges()
        .pipe(
          map((exercises: any[]) => {
            return exercises.map((exercise) => {
              return {
                ...exercise,
                date: new Date(exercise.date),
              };
            });
          })
        )
        .subscribe((exercises: Exercise[]) => {
          this.pastExercisesChanged.next(exercises);
        })
    );
  }

  getRunningExercise(): Exercise {
    return { ...this.runningExercise };
  }

  startExercise(selectedId: string): void {
    this.runningExercise = this.availableExercises.find(
      (exercise: Exercise) => {
        return exercise.id === selectedId;
      }
    );
    this.runningExerciseChanged.next({ ...this.runningExercise });
  }

  completeExercice(): void {
    this.addDataToDatabase({
      ...this.runningExercise,
      date: new Date(),
      state: 'completed',
    });
    this.runningExercise = null;
    this.runningExerciseChanged.next(null);
  }

  cancelExercice(progress: number): void {
    this.addDataToDatabase({
      ...this.runningExercise,
      duration: this.runningExercise.duration * (progress / 100),
      calories: this.runningExercise.calories * (progress / 100),
      date: new Date(),
      state: 'cancelled',
    });
    this.runningExercise = null;
    this.runningExerciseChanged.next(null);
  }

  cancelSubscriptions(): void {
    subHelpers.unsubscribeIfExist(...this.firebaseSubscriptions);
  }

  private addDataToDatabase(exercise: Exercise) {
    this.db
      .collection('finishedExercises')
      .add({ ...exercise, date: exercise.date.toISOString() });
  }
}
