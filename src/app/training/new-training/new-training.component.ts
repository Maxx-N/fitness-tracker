import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { Exercise } from '../exercise.model';
import { TrainingService } from '../training.service';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.scss'],
})
export class NewTrainingComponent implements OnInit {
  availableExercises: Exercise[] = [];
  selectedExerciseId: string;

  constructor(private trainingService: TrainingService) {}

  ngOnInit(): void {
    this.availableExercises = this.trainingService.getAvailableExercises();
  }

  onStartTraining(form: NgForm) {
    if (form.valid) {
      this.trainingService.startExercise(form.value.exerciseId);
    }
  }
}
