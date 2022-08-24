import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, Subject, Subscription } from 'rxjs';

import { UiService } from '../shared/ui.service';
import { Exercise } from './exercise.model';

@Injectable()
export class TrainingService {
  runningExerciseChanged = new Subject<Exercise>();
  availableExercisesChanged = new Subject<Exercise[]>();
  pastExercisesChanged = new Subject<Exercise[]>();
  private runningExercise: Exercise;
  private availableExercises: Exercise[];
  private firebaseSubscriptions: Subscription[] = [];

  constructor(private db: AngularFirestore, private uiService: UiService) {}

  fetchAvailableExercises(): void {
    this.uiService.loadingStateChanged.next(true);
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
        .subscribe((exercises: Exercise[]) => {
          this.uiService.loadingStateChanged.next(false);
          this.availableExercises = exercises;
          this.availableExercisesChanged.next([...this.availableExercises]);
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
    this.firebaseSubscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
  }

  private addDataToDatabase(exercise: Exercise) {
    this.db
      .collection('finishedExercises')
      .add({ ...exercise, date: exercise.date.toISOString() });
  }
}
