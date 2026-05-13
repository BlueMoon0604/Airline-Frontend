import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { AppStateService } from '../../app-state.service';
import { MarketingTopbarComponent } from './components/marketing-topbar.component';
import { HomeHeroComponent } from './components/home-hero.component';
import { AirlineStripComponent } from './components/airline-strip.component';
import { TestimonialHighlightComponent } from './components/testimonial-highlight.component';
import { WhyBookSectionComponent } from './components/why-book-section.component';
import { DestinationsShowcaseComponent } from './components/destinations-showcase.component';
import { ReviewsSectionComponent } from './components/reviews-section.component';
import { SiteFooterComponent } from './components/site-footer.component';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    MarketingTopbarComponent,
    HomeHeroComponent,
    AirlineStripComponent,
    TestimonialHighlightComponent,
    WhyBookSectionComponent,
    DestinationsShowcaseComponent,
    ReviewsSectionComponent,
    SiteFooterComponent
  ],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  constructor(public state: AppStateService) {}

  ngOnInit(): void {
    this.state.initializeHomePage();
  }
}
