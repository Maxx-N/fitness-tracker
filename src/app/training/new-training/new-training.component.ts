import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

import { Exercise } from '../exercise.model';
import { TrainingService } from '../training.service';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.scss'],
})
export class NewTrainingComponent implements OnInit {
  availableExercises: Observable<any[]>;
  selectedExerciseId: string;

  constructor(
    private trainingService: TrainingService,
    private db: AngularFirestore
  ) {}

  ngOnInit(): void {
    // this.availableExercises = this.trainingService.getAvailableExercises();
    this.availableExercises = this.db
      .collection('availableExercises')
      .valueChanges();
  }

  onStartTraining(form: NgForm) {
    if (form.valid) {
      this.trainingService.startExercise(form.value.exerciseId);
    }
  }
}
