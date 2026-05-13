import { Component } from '@angular/core';

@Component({
  selector: 'app-destinations-showcase',
  standalone: true,
  template: `
    <section class="destination-layout">
      <aside class="destination-copy">
        <p class="eyebrow">Recommended for your next trip</p>
        <h2>See what travellers are planning next</h2>
        <span>
          Discover routes and destinations inspired by the most popular domestic trips on SkyBooker.
        </span>
        <div class="destination-copy__action">
          <button type="button">Explore all</button>
        </div>
      </aside>

      <div class="destination-cards">
        <article class="destination-card">
          <img src="https://images.unsplash.com/photo-1595658658481-d53d3f999875?auto=format&fit=crop&w=900&q=80" alt="Mumbai skyline" />
          <div class="destination-card__body">
            <small>Delhi → Mumbai</small>
            <h3>DEL to BOM</h3>
            <p>₹5,400 <span>₹6,100</span></p>
          </div>
        </article>

        <article class="destination-card">
          <img src="https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=900&q=80" alt="Goa coast" />
          <div class="destination-card__body">
            <small>Mumbai → Goa</small>
            <h3>BOM to GOI</h3>
            <p>₹3,200 <span>₹3,850</span></p>
          </div>
        </article>

        <article class="destination-card destination-card--wide">
          <img src="https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1600&q=80" alt="Kochi waterfront" />
          <div class="destination-card__body">
            <small>Chennai → Kolkata</small>
            <h3>MAA to CCU</h3>
            <p>₹4,800 <span>₹5,350</span></p>
          </div>
        </article>
      </div>
    </section>
  `
})
export class DestinationsShowcaseComponent {}
