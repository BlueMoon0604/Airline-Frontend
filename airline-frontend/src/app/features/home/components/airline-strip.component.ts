import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-airline-strip',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="airline-strip">
      <div class="airline-strip__header">
        <h2>Featured Partners</h2>
        <p>Domestic flight partners for your next trip</p>
      </div>

      <div class="airline-strip__logos airline-strip__logos--visual">
        <div class="partner-logo-card partner-logo-card--airindia">
          <span class="partner-logo-wordmark">Air India</span>
        </div>
        <div class="partner-logo-card partner-logo-card--indigo">
          <span class="partner-logo-wordmark">IndiGo</span>
        </div>
        <div class="partner-logo-card partner-logo-card--nimbus">
          <span class="partner-logo-wordmark">Nimbus</span>
        </div>
        <div class="partner-logo-card partner-logo-card--skyjet">
          <span class="partner-logo-wordmark">SkyJet</span>
        </div>
        <div class="partner-logo-card partner-logo-card--bluewings">
          <span class="partner-logo-wordmark">BlueWings</span>
        </div>
        <div class="partner-logo-card partner-logo-card--zenith">
          <span class="partner-logo-wordmark">Zenith Air</span>
        </div>
      </div>
    </section>
  `
})
export class AirlineStripComponent {}
