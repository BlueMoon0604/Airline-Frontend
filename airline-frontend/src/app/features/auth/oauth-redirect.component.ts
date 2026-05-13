import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AppStateService } from '../../app-state.service';

@Component({
  selector: 'app-oauth-redirect',
  template: `
    <section class="auth-page">
      <div class="auth-panel auth-panel--forms" style="min-height: 60vh; display: grid; place-items: center;">
        <div class="auth-card" style="max-width: 520px; width: 100%; text-align: center;">
          <p class="eyebrow">Google OAuth</p>
          <h2>Signing you in...</h2>
          <span>We are securely completing your login and redirecting you to flight search.</span>
        </div>
      </div>
    </section>
  `
})
export class OauthRedirectComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);

  constructor(private readonly state: AppStateService) {}

  ngOnInit(): void {
    const params = this.route.snapshot.queryParamMap;

    this.state.completeOauthLogin({
      accessToken: params.get('accessToken'),
      refreshToken: params.get('refreshToken'),
      email: params.get('email'),
      role: params.get('role')
    });
  }
}
