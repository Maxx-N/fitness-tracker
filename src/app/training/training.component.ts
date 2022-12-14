import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { Exercise } from './exercise.model';
import { TrainingService } from './training.service';
import * as subHelpers from 'src/app/shared/subscription.helpers';

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.scss'],
})
export class TrainingComponent implements OnInit, OnDestroy {
  ongoingTraining = false;
  private exerciseSubscription: Subscription;

  constructor(private trainingService: TrainingService) {}

  ngOnInit(): void {
    this.exerciseSubscription =
      this.trainingService.runningExerciseChanged.subscribe(
        (exercise: Exercise) => {
          if (!!exercise) {
            this.ongoingTraining = true;
          } else {
            this.ongoingTraining = false;
          }
        }
      );
  }

  ngOnDestroy(): void {
    subHelpers.unsubscribeIfExist(this.exerciseSubscription);
  }
}
