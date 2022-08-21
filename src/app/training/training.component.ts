import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.scss'],
})
export class TrainingComponent implements OnInit {
  ongoingTraining = false;
  constructor() {}

  ngOnInit(): void {}

  startTraining() {
    this.ongoingTraining = true;
  }

  stopTraining() {
    this.ongoingTraining = false;
  }
}
