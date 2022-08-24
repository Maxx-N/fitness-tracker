import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import * as fromRoot from 'src/app/app.reducer';
import * as subHelpers from 'src/app/shared/subscription.helpers';
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
  isLoading$: Observable<boolean>;

  constructor(
    private trainingService: TrainingService,
    private store: Store<fromRoot.State>
  ) {}

  ngOnInit(): void {
    this.isLoading$ = this.store.select(fromRoot.getIsLoading);
    this.availableExercisesSubscription =
      this.trainingService.availableExercisesChanged.subscribe(
        (exercises: Exercise[]) => {
          this.availableExercises = exercises;
        }
      );
    this.onFetchExercises();
  }

  ngOnDestroy(): void {
    subHelpers.unsubscribeIfExist(this.availableExercisesSubscription);
  }

  onStartTraining(form: NgForm) {
    if (form.valid) {
      this.trainingService.startExercise(form.value.exerciseId);
    }
  }

  onFetchExercises(): void {
    this.trainingService.fetchAvailableExercises();
  }
}
