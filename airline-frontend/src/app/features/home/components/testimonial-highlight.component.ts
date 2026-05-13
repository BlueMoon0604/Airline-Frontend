import { Component } from '@angular/core';

@Component({
  selector: 'app-testimonial-highlight',
  standalone: true,
  template: `
    <section class="home-section">
      <div class="section-title centered">
        <p class="eyebrow">Traveller love SkyBooker</p>
        <h2>Trusted for smarter booking choices</h2>
        <span>Read traveller testimonials and platform wins</span>
      </div>

      <div class="feature-mosaic">
        <article class="mosaic-card mosaic-card--quote">
          <div class="mosaic-topline">
            <div class="mini-brand">skybooker</div>
            <span class="mosaic-dot"></span>
          </div>

          <div class="mosaic-panel">
            <div class="mosaic-copy">
              <h3>Why travellers choose us</h3>
              <p>
                Transparent fares, clean booking flow, and faster confirmations across airlines and routes.
              </p>
            </div>
          </div>

          <div class="mosaic-points mosaic-points--stacked">
            <span>Instant confirmations</span>
            <span>Transparent pricing</span>
            <span>Smooth seat selection</span>
          </div>

          <div class="mosaic-user-card">
            <div class="mosaic-user">
              <img src="https://i.pravatar.cc/64?img=12" alt="Traveller avatar" />
              <div>
                <strong>Alex Smith</strong>
                <span>Frequent flyer</span>
              </div>
            </div>
            <small>“Booking feels cleaner and more trustworthy than most travel sites.”</small>
          </div>
        </article>

        <article class="mosaic-card mosaic-card--compact">
          <div class="mosaic-panel">
            <h4>Great deals everyday</h4>
            <p>Live fare comparisons help travellers catch lower prices across routes.</p>
          </div>
          <div class="mosaic-note">
            <small>Smart comparisons across popular domestic and international sectors.</small>
          </div>
        </article>

        <article class="mosaic-card mosaic-card--compact">
          <div class="mosaic-panel">
            <h4>Price match promise</h4>
            <p>Simple value-first experience for domestic and international bookings.</p>
          </div>
          <div class="stat-block stat-block--boxed">
            <div class="big-stat">20%</div>
            <small>average savings on selected routes</small>
          </div>
        </article>

        <article class="mosaic-card mosaic-card--image">
          <div class="mosaic-image-overlay">
            <span class="mosaic-image-chip">Available airlines</span>
            <div class="big-stat light">500+</div>
            <p>Available airlines and curated route offers</p>
          </div>
        </article>
      </div>
    </section>
  `
})
export class TestimonialHighlightComponent {}
