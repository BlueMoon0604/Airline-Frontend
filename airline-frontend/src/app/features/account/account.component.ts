import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppStateService } from '../../app-state.service';

@Component({
  selector: 'app-account',
  imports: [CommonModule, FormsModule],
  templateUrl: './account.component.html'
})
export class AccountComponent implements OnInit {
  constructor(public state: AppStateService) {}

  ngOnInit(): void {
    this.state.initializeAccountPage();
  }
}
