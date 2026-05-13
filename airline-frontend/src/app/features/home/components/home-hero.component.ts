import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AppStateService } from '../../../app-state.service';

@Component({
  selector: 'app-home-hero',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="hero-banner">
      <div class="hero-copy">
        <p class="eyebrow">Smart travel booking platform</p>
        <h1>Book cheap flights on 500+ airlines</h1>
        <p class="hero-copy__sub">Compare • Choose • Fly</p>

        <div class="hero-tags">
          <span>Save more on every trip</span>
          <span>Flexible booking tools</span>
          <span>Best price guaranteed</span>
        </div>

        <div class="hero-plane-badges">
          <div class="hero-plane-badge">Save more on flights</div>
          <div class="hero-plane-badge">Best price guaranteed</div>
        </div>
      </div>

      <div class="hero-visual-spacer"></div>

      <div class="booking-panel booking-panel--bottom">
        <div class="booking-panel__tabs">
          <button type="button" class="is-active">Flights</button>
        </div>

        <div class="booking-panel__modes">
          <label><input type="radio" [checked]="!state.searchData.isRoundTrip" (change)="state.setTripMode(false)" /> One way</label>
          <label><input type="radio" [checked]="state.searchData.isRoundTrip" (change)="state.setTripMode(true)" /> Round-trip</label>
        </div>

        <div class="booking-panel__grid">
          <label>
            From
            <input [(ngModel)]="state.searchData.originAirportCode" placeholder="Enter city 1" />
          </label>

          <label>
            To
            <input [(ngModel)]="state.searchData.destinationAirportCode" placeholder="Enter city 2" />
          </label>

          <label>
            Departure
            <input [(ngModel)]="state.searchData.departureDate" type="date" />
          </label>

          <label *ngIf="state.searchData.isRoundTrip">
            Return
            <input [(ngModel)]="state.searchData.returnDate" type="date" />
          </label>

          <label>
            Travellers
            <select [ngModel]="state.searchData.passengers" (ngModelChange)="state.setPassengerCount(+$event)">
              <option [ngValue]="1">1 Traveller</option>
              <option [ngValue]="2">2 Travellers</option>
              <option [ngValue]="3">3 Travellers</option>
              <option [ngValue]="4">4 Travellers</option>
            </select>
          </label>

          <button type="button" class="booking-panel__search" (click)="goToSearch()">
            Search Flights
          </button>
        </div>
      </div>
    </section>
  `
})
export class HomeHeroComponent {
  constructor(public state: AppStateService, private readonly router: Router) {}

  goToSearch(): void {
    this.router.navigateByUrl('/search');
  }
}
