import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppStateService } from '../../app-state.service';

@Component({
  selector: 'app-checkin',
  imports: [CommonModule, FormsModule],
  templateUrl: './checkin.component.html'
})
export class CheckinComponent implements OnInit {
  constructor(public state: AppStateService) {}

  ngOnInit(): void {
    this.state.initializeCheckinPage();
  }
}
