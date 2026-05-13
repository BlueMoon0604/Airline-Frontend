import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-site-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="site-footer">
      <div class="site-footer__hero">
        <div class="site-footer__hero-copy">
          <p class="eyebrow">SkyBooker website</p>
          <h3>Plan your next journey with a cleaner flight booking experience.</h3>
          <span>Search routes, complete bookings, manage trips, and move from payment to travel documents in one place.</span>
        </div>
        <div class="site-footer__hero-visual">
          <img
            src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1400&q=80"
            alt="Airplane at dusk"
          />
        </div>
      </div>

      <div class="site-footer__grid">
        <div>
          <h4>SkyBooker</h4>
          <a routerLink="/search">Search flights</a>
          <a routerLink="/booking">Book tickets</a>
          <a routerLink="/account">My trips</a>
        </div>
        <div>
          <h4>Traveller Tools</h4>
          <a routerLink="/lookup">PNR lookup</a>
          <a routerLink="/checkin">Web check-in</a>
          <a routerLink="/payment">Payments</a>
        </div>
        <div>
          <h4>Popular Routes</h4>
          <a>Delhi to Mumbai</a>
          <a>Mumbai to Goa</a>
          <a>Chennai to Kolkata</a>
        </div>
        <div>
          <h4>Support</h4>
          <a>Help centre</a>
          <a>Email support</a>
          <a>Terms & privacy</a>
        </div>
      </div>

      <div class="site-footer__bottom">
        <span>© 2026 SkyBooker. Airline ticket booking system demo website.</span>
      </div>
    </footer>
  `
})
export class SiteFooterComponent {}
