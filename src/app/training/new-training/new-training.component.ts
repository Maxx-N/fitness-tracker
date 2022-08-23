import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { NgForm } from '@angular/forms';
import { map, Observable } from 'rxjs';

import { Exercise } from '../exercise.model';
import { TrainingService } from '../training.service';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.scss'],
})
export class NewTrainingComponent implements OnInit {
  availableExercises: Observable<Exercise[]>;
  selectedExerciseId: string;

  constructor(
    private trainingService: TrainingService,
    private db: AngularFirestore
  ) {}

  ngOnInit(): void {
    this.availableExercises = this.db
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
      );
    this.availableExercises.subscribe((res) => console.log(res));
  }

  onStartTraining(form: NgForm) {
    if (form.valid) {
      this.trainingService.startExercise(form.value.exerciseId);
    }
  }
}
