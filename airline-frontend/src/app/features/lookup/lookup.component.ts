import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppStateService } from '../../app-state.service';

@Component({
  selector: 'app-lookup',
  imports: [CommonModule, FormsModule],
  templateUrl: './lookup.component.html'
})
export class LookupComponent implements OnInit {
  constructor(public state: AppStateService) {}

  ngOnInit(): void {
    this.state.initializeLookupPage();
  }
}
