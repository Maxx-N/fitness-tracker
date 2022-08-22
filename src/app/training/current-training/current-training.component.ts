import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Exercise } from '../exercise.model';
import { TrainingService } from '../training.service';
import { StopTrainingComponent } from './stop-training/stop-training.component';

@Component({
  selector: 'app-current-training',
  templateUrl: './current-training.component.html',
  styleUrls: ['./current-training.component.scss'],
})
export class CurrentTrainingComponent implements OnInit {
  progress = 0;
  timer;
  runningExercise: Exercise;

  constructor(
    private dialog: MatDialog,
    private trainingService: TrainingService
  ) {}

  ngOnInit(): void {
    this.runningExercise = this.trainingService.getRunningExercise();
    this.startOrResumeTimer();
  }

  startOrResumeTimer(): void {
    const step = (this.runningExercise.duration / 100) * 1000;
    this.timer = setInterval(() => {
      this.progress += 1;
      if (this.progress >= 100) {
        clearInterval(this.timer);
        this.trainingService.completeExercice();
      }
    }, step);
  }

  onStop(): void {
    clearInterval(this.timer);

    const dialogRef = this.dialog.open(StopTrainingComponent, {
      data: { progress: this.progress },
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.trainingService.cancelExercice(this.progress);
      } else {
        this.startOrResumeTimer();
      }
    });
  }
}
