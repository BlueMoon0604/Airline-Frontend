import { CommonModule } from '@angular/common';
import { AfterViewInit, Component } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';

import { AppStateService } from './app-state.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements AfterViewInit {
  currentUrl = '/';
  viewReady = false;
  private readonly immersiveRoutes = new Set(['/', '/auth']);

  navItems = [
    { label: 'Home', path: '/' },
    { label: 'Search', path: '/search' },
    { label: 'My Trips', path: '/account' }
  ];

  exploreItems = [
    { label: 'Booking', path: '/booking' },
    { label: 'Payment', path: '/payment' },
    { label: 'PNR Lookup', path: '/lookup' },
    { label: 'Check-in', path: '/checkin' }
  ];

  get visibleNavItems(): Array<{ label: string; path: string }> {
    return this.navItems.filter((item) => {
      if (this.currentUrl === '/' && item.path === '/') {
        return false;
      }

      if (this.state.isAdmin && item.path === '/search') {
        return false;
      }

      return true;
    });
  }

  get visibleExploreItems(): Array<{ label: string; path: string }> {
    return this.exploreItems;
  }

  get showAdminNavLink(): boolean {
    return this.state.isAdmin;
  }

  get showStaffNavLink(): boolean {
    return this.state.isStrictAirlineStaff;
  }

  get showAppHeader(): boolean {
    return !this.immersiveRoutes.has(this.currentUrl);
  }

  get isImmersiveLayout(): boolean {
    return this.immersiveRoutes.has(this.currentUrl);
  }

  constructor(public state: AppStateService, private readonly router: Router) {
    this.currentUrl = this.router.url;

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.currentUrl = (event as NavigationEnd).urlAfterRedirects;

        if (this.immersiveRoutes.has(this.currentUrl)) {
          this.state.stopAutoRefresh();
        }
      });
  }

  ngAfterViewInit(): void {
    window.setTimeout(() => {
      this.viewReady = true;
    });
  }
}


