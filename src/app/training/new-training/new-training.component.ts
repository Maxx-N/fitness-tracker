import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

import { Exercise } from '../exercise.model';
import { TrainingService } from '../training.service';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.scss'],
})
export class NewTrainingComponent implements OnInit, OnDestroy {
  availableExercises: Exercise[];
  selectedExerciseId: string;
  private availableExercisesSubscription: Subscription;

  constructor(private trainingService: TrainingService) {}

  ngOnInit(): void {
    this.availableExercisesSubscription =
      this.trainingService.availableExercisesChanged.subscribe(
        (exercises: Exercise[]) => {
          this.availableExercises = exercises;
        }
      );
    this.trainingService.fetchAvailableExercises();
  }

  ngOnDestroy(): void {
    this.availableExercisesSubscription.unsubscribe();
  }

  onStartTraining(form: NgForm) {
    if (form.valid) {
      this.trainingService.startExercise(form.value.exerciseId);
    }
  }
}
