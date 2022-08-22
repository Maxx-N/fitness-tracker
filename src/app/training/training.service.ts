import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Exercise } from './exercise.model';

@Injectable()
export class TrainingService {
  private availableExercises: Exercise[] = [
    { id: 'crunches', name: 'Crunches', duration: 30, calories: 8 },
    { id: 'touch-toes', name: 'Touch Toes', duration: 180, calories: 15 },
    { id: 'side-lunges', name: 'Side Lunges', duration: 120, calories: 18 },
    { id: 'burpees', name: 'Burpees', duration: 60, calories: 8 },
  ];
  private runningExercise: Exercise;
  exerciseChanged = new Subject<Exercise>();

  getAvailableExercises(): Exercise[] {
    return [...this.availableExercises];
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
    this.exerciseChanged.next({ ...this.runningExercise });
  }
}
