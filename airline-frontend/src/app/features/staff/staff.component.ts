import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppStateService } from '../../app-state.service';

@Component({
  selector: 'app-staff',
  imports: [CommonModule, FormsModule],
  templateUrl: './staff.component.html'
})
export class StaffComponent implements OnInit {
  constructor(public state: AppStateService) {}

  ngOnInit(): void {
    this.state.initializeStaffPage();
  }
}
