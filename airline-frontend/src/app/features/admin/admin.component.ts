import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppStateService } from '../../app-state.service';

@Component({
  selector: 'app-admin',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html'
})
export class AdminComponent implements OnInit, AfterViewInit {
  constructor(public state: AppStateService) {}

  ngOnInit(): void {
    this.state.initializeAdminPage();
  }

  ngAfterViewInit(): void {
    window.setTimeout(() => {
      this.state.loadAdminDashboard(false);
    }, 250);
  }
}
