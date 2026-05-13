import { Component } from '@angular/core';

@Component({
  selector: 'app-app-download-section',
  standalone: true,
  template: `
    <section class="download-section">
      <div class="download-copy">
        <p class="eyebrow">Book faster, get notified for best deals!</p>
        <h2>Experience seamless travel planning</h2>
        <p>See what others are saying about the ease and convenience of booking with the SkyBooker app.</p>

        <div class="store-row">
          <span class="store-badge">App Store</span>
          <span class="store-badge">Google Play</span>
        </div>
      </div>

      <div class="download-visual">
        <div class="phone-glow"></div>
        <img
          src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=700&q=80"
          alt="Travel app on mobile"
        />
      </div>
    </section>
  `
})
export class AppDownloadSectionComponent {}
