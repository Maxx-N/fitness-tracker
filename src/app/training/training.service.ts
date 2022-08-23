import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, Observable, Subject } from 'rxjs';

import { Exercise } from './exercise.model';

@Injectable()
export class TrainingService {
  private availableExercises: Exercise[];
  private runningExercise: Exercise;
  exerciseChanged = new Subject<Exercise>();
  availableExercisesChanged = new Subject<Exercise[]>();
  private pastExercises: Exercise[] = [];

  constructor(private db: AngularFirestore) {}

  fetchAvailableExercises() {
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
        this.availableExercises = exercises;
        this.availableExercisesChanged.next([...this.availableExercises]);
      });

    return this.availableExercises;
  }

  getRunningExercise(): Exercise {
    return { ...this.runningExercise };
  }

  getPastExercises(): Exercise[] {
    return [...this.pastExercises];
  }

  startExercise(selectedId: string): void {
    this.runningExercise = this.availableExercises.find(
      (exercise: Exercise) => {
        return exercise.id === selectedId;
      }
    );
    this.exerciseChanged.next({ ...this.runningExercise });
  }

  completeExercice() {
    this.pastExercises.push({
      ...this.runningExercise,
      date: new Date(),
      state: 'completed',
    });
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  cancelExercice(progress: number) {
    this.pastExercises.push({
      ...this.runningExercise,
      duration: this.runningExercise.duration * (progress / 100),
      calories: this.runningExercise.calories * (progress / 100),
      date: new Date(),
      state: 'cancelled',
    });
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }
}
