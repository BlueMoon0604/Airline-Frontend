import { Component } from '@angular/core';

@Component({
  selector: 'app-why-book-section',
  standalone: true,
  template: `
    <section class="why-book-card">
      <div class="section-title centered">
        <p class="eyebrow">Why book with SkyBooker?</p>
        <h2>Designed for a smooth, premium flight journey</h2>
        <span>From pricing visibility to support access, every part is made to feel calm and trustworthy.</span>
      </div>

      <div class="why-book-grid">
        <article>
          <h3>Real-time price monitoring</h3>
          <p>Track fare movement and search the best times to book with fewer surprises.</p>
        </article>
        <article>
          <h3>Flexible payment options</h3>
          <p>Support for multiple payment choices while keeping the checkout clean and guided.</p>
        </article>
        <article>
          <h3>24/7 expert support</h3>
          <p>Dedicated assistance around the clock for itinerary and booking help.</p>
        </article>
      </div>

      <div class="why-book-image">
        <img
          src="https://images.unsplash.com/photo-1540339832862-474599807836?auto=format&fit=crop&w=1600&q=80"
          alt="Plane in the sky"
        />
        <div class="rating-badge">
          <strong>4.9</strong>
          <span>Average Rating</span>
        </div>
      </div>
    </section>
  `
})
export class WhyBookSectionComponent {}
