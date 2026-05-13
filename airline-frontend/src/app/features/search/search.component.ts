import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppStateService } from '../../app-state.service';

@Component({
  selector: 'app-search',
  imports: [CommonModule, FormsModule],
  templateUrl: './search.component.html'
})
export class SearchComponent implements OnInit {
  constructor(public state: AppStateService) {}

  ngOnInit(): void {
    this.state.initializeSearchPage();
  }
}
