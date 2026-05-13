import { Routes } from '@angular/router';

import { AccountComponent } from './features/account/account.component';
import { AdminComponent } from './features/admin/admin.component';
import { AuthComponent } from './features/auth/auth.component';
import { OauthRedirectComponent } from './features/auth/oauth-redirect.component';
import { BookingComponent } from './features/booking/booking.component';
import { CheckinComponent } from './features/checkin/checkin.component';
import { HomeComponent } from './features/home/home.component';
import { LookupComponent } from './features/lookup/lookup.component';
import { PassengerComponent } from './features/passenger/passenger.component';
import { BookingSuccessComponent } from './features/payment/booking-success.component';
import { PaymentComponent } from './features/payment/payment.component';
import { SearchComponent } from './features/search/search.component';
import { StaffComponent } from './features/staff/staff.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'auth', component: AuthComponent },
  { path: 'oauth2/redirect', component: OauthRedirectComponent },
  { path: 'search', component: SearchComponent },
  { path: 'booking', component: BookingComponent },
  { path: 'passenger', component: PassengerComponent },
  { path: 'payment', component: PaymentComponent },
  { path: 'booking-success', component: BookingSuccessComponent },
  { path: 'account', component: AccountComponent },
  { path: 'lookup', component: LookupComponent },
  { path: 'checkin', component: CheckinComponent },
  { path: 'staff', component: StaffComponent },
  { path: 'admin', component: AdminComponent }
];
