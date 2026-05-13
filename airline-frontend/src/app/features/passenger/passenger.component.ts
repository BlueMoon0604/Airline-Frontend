import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppStateService } from '../../app-state.service';

@Component({
  selector: 'app-passenger',
  imports: [CommonModule, FormsModule],
  templateUrl: './passenger.component.html'
})
export class PassengerComponent implements OnInit {
  constructor(public state: AppStateService) {}

  ngOnInit(): void {
    this.state.initializePassengerPage();
  }
}
