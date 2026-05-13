import { Component } from '@angular/core';

@Component({
  selector: 'app-promo-savings',
  standalone: true,
  template: `
    <section class="promo-band">
      <div class="section-title">
        <p class="eyebrow">Last minute travel deals</p>
        <h2>Save more on your next trip</h2>
        <span>Your happy place just got more affordable with flight, hotel and rental combos.</span>
      </div>

      <div class="promo-grid">
        <article class="promo-card">
          <h3>Save up to <span>$40</span> on our fees on flights</h3>
          <p>Cleaner checkout and no manual entry chaos while planning your travel.</p>
          <div class="promo-actions">
            <button type="button" class="ghost-btn">Get Promo Code</button>
            <a>Learn more</a>
          </div>
        </article>

        <article class="promo-card">
          <h3>Save up to <span>$100</span> when booking flight + hotel</h3>
          <p>Bundle your trip into a more premium but still affordable booking experience.</p>
          <div class="promo-actions">
            <button type="button" class="ghost-btn">Get Promo Code</button>
            <a>Learn more</a>
          </div>
        </article>

        <article class="promo-card">
          <h3>Save up to <span>$20</span> on rental deals</h3>
          <p>Keep everything in one clean itinerary with better visibility and lower booking stress.</p>
          <div class="promo-actions">
            <button type="button" class="ghost-btn">Get Promo Code</button>
            <a>Learn more</a>
          </div>
        </article>
      </div>
    </section>
  `
})
export class PromoSavingsComponent {}
