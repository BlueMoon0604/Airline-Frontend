import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AppStateService } from '../../../app-state.service';

@Component({
  selector: 'app-marketing-topbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <header class="marketing-topbar">
      <a routerLink="/" class="brand-lockup">
        <span class="brand-lockup__mark">✈</span>
        <span class="brand-lockup__text">SkyBooker</span>
      </a>

      <div class="marketing-pill">
        Need help? Call us 24/7
        <strong>+91 523-125-1578</strong>
      </div>

      <nav class="marketing-nav">
        <a routerLink="/search">Flights</a>
        <a routerLink="/booking">Booking</a>
        <a routerLink="/account">Account</a>

        <a *ngIf="state.loggedIn; else authCta" routerLink="/account" class="marketing-nav__user">
          <span class="marketing-nav__user-label">Signed in</span>
          <strong>{{ state.accountDisplayName }}</strong>
        </a>

        <ng-template #authCta>
          <a routerLink="/auth" class="marketing-nav__cta">Sign up / Login</a>
        </ng-template>
      </nav>
    </header>
  `
})
export class MarketingTopbarComponent {
  constructor(public readonly state: AppStateService) {}
}
