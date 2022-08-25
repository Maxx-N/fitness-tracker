import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, Subject, Subscription, take } from 'rxjs';
import { Store } from '@ngrx/store';

import { UiService } from '../shared/ui.service';
import { Exercise } from './exercise.model';
import * as subHelpers from 'src/app/shared/subscription.helpers';
import * as UI from 'src/app/shared/ui.actions';
import * as fromTraining from 'src/app/training/training.reducer';
import * as Training from 'src/app/training/training.actions';

@Injectable()
export class TrainingService {
  private firebaseSubscriptions: Subscription[] = [];
  pastExercisesChanged = new Subject<Exercise[]>();

  constructor(
    private db: AngularFirestore,
    private uiService: UiService,
    private store: Store<fromTraining.State>
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
            this.store.dispatch(new Training.SetAvailableExercises(exercises));
          },
          error: () => {
            this.store.dispatch(new UI.StopLoading());
            this.uiService.showSnackbar(
              'Fetching exercises failed. Please try again later.',
              null,
              3000
            );
            this.store.dispatch(new Training.SetAvailableExercises([]));
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

  startExercise(selectedId: string): void {
    this.store.dispatch(new Training.StartTraining(selectedId));
  }

  completeExercice(): void {
    this.store
      .select(fromTraining.getActiveTraining)
      .pipe(take(1))
      .subscribe((activeExercise) => {
        this.addDataToDatabase({
          ...activeExercise,
          date: new Date(),
          state: 'completed',
        });
        this.store.dispatch(new Training.StopTraining());
      });
  }

  cancelExercice(progress: number): void {
    this.store
      .select(fromTraining.getActiveTraining)
      .pipe(take(1))
      .subscribe((activeExercise) => {
        this.addDataToDatabase({
          ...activeExercise,
          duration: activeExercise.duration * (progress / 100),
          calories: activeExercise.calories * (progress / 100),
          date: new Date(),
          state: 'cancelled',
        });
        this.store.dispatch(new Training.StopTraining());
      });
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
