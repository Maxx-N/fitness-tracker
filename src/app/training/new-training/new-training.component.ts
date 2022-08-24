import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

import { UiService } from 'src/app/shared/ui.service';
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
  private loadingSubscription: Subscription;
  isLoading = false;

  constructor(
    private trainingService: TrainingService,
    private uiService: UiService
  ) {}

  ngOnInit(): void {
    this.loadingSubscription = this.uiService.loadingStateChanged.subscribe(
      (result) => (this.isLoading = result)
    );
    this.availableExercisesSubscription =
      this.trainingService.availableExercisesChanged.subscribe(
        (exercises: Exercise[]) => {
          this.availableExercises = exercises;
        }
      );
    this.trainingService.fetchAvailableExercises();
  }

  ngOnDestroy(): void {
    [this.availableExercisesSubscription, this.loadingSubscription].forEach(
      (sub) => {
        sub.unsubscribe();
      }
    );
  }

  onStartTraining(form: NgForm) {
    if (form.valid) {
      this.trainingService.startExercise(form.value.exerciseId);
    }
  }
}
