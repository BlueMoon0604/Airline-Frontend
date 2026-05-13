import { Component } from '@angular/core';

@Component({
  selector: 'app-reviews-section',
  standalone: true,
  template: `
    <section class="home-section">
      <div class="section-title">
        <p class="eyebrow">See what others are saying</p>
        <h2>Real feedback from frequent travellers</h2>
      </div>

      <div class="review-grid">
        <article class="review-score">
          <strong>4.9</strong>
          <p>People love the clean planning flow and the faster booking experience.</p>
          <button type="button" class="dark-btn">Write a review</button>
        </article>

        <article class="review-card">
          <div class="review-head">
            <img src="https://i.pravatar.cc/48?img=30" alt="Reviewer" />
            <div>
              <strong>Livia Lumina</strong>
              <span>Travel blogger</span>
            </div>
          </div>
          <p>I've booked flights with them multiple times. Great fares and no hidden fees.</p>
        </article>

        <article class="review-card">
          <div class="review-head">
            <img src="https://i.pravatar.cc/48?img=18" alt="Reviewer" />
            <div>
              <strong>Kaci Barron</strong>
              <span>Travel creator</span>
            </div>
          </div>
          <p>I had a smooth booking experience and found a great deal on my flight to Costa Rica.</p>
        </article>

        <article class="review-card">
          <div class="review-head">
            <img src="https://i.pravatar.cc/48?img=23" alt="Reviewer" />
            <div>
              <strong>Zia Montegue</strong>
              <span>Photographer</span>
            </div>
          </div>
          <p>The interface is easy to use, and I appreciate the clear display of flight options.</p>
        </article>
      </div>
    </section>
  `
})
export class ReviewsSectionComponent {}
