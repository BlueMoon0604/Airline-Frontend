import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterLink } from '@angular/router';

import { AppStateService } from '../../app-state.service';

@Component({
  selector: 'app-booking-success',
  imports: [CommonModule, RouterLink],
  templateUrl: './booking-success.component.html'
})
export class BookingSuccessComponent implements OnInit {
  constructor(
    public state: AppStateService,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const queryMap = this.route.snapshot.queryParamMap;
    const paymentId = queryMap.get('paymentId');
    const razorpayPaymentId = queryMap.get('razorpay_payment_id');
    const razorpayOrderId = queryMap.get('razorpay_order_id');
    const razorpaySignature = queryMap.get('razorpay_signature');

    if (paymentId && razorpayPaymentId && razorpayOrderId && razorpaySignature) {
      this.state.completeRazorpayReturn({
        paymentId,
        razorpayPaymentId,
        razorpayOrderId,
        razorpaySignature
      });
      return;
    }

    this.state.initializeBookingSuccessPage();
  }
}
