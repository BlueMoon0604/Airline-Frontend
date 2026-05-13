import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppStateService } from '../../app-state.service';

@Component({
  selector: 'app-booking',
  imports: [CommonModule, FormsModule],
  templateUrl: './booking.component.html'
})
export class BookingComponent implements OnInit {
  constructor(public state: AppStateService) {}

  ngOnInit(): void {
    this.state.initializeBookingPage();
  }
}
