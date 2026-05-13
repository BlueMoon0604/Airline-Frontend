import { Injectable, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { ApiService } from './api.service';
import {
  flightStatuses,
  gatewayUrlDefault,
  genders,
  bookingStatuses,
  roles,
  notificationChannels,
  notificationTypes,
  passengerTypes,
  paymentModes,
  paymentStatuses,
  tripTypes
} from './backend-config';

@Injectable({ providedIn: 'root' })
export class AppStateService {
  private readonly router = inject(Router);
  private razorpayScriptPromise: Promise<boolean> | null = null;
  private autoRefreshTimers: number[] = [];
  private readonly storageKeys = {
    accessToken: 'skybooker.accessToken',
    refreshToken: 'skybooker.refreshToken',
    currentUser: 'skybooker.currentUser',
    gatewayUrl: 'skybooker.gatewayUrl',
    workflow: 'skybooker.workflow'
  };

  gatewayUrl = sessionStorage.getItem(this.storageKeys.gatewayUrl) ?? gatewayUrlDefault;

  loggedIn = false;
  loading = false;
  loadingLabel = '';
  message = '';
  currentStep = 1;
  activePassengerIndex = 0;

  accessToken = sessionStorage.getItem(this.storageKeys.accessToken) ?? '';
  refreshToken = sessionStorage.getItem(this.storageKeys.refreshToken) ?? '';
  currentUser: any = this.readJson(this.storageKeys.currentUser);
  oauthLoginUrl = 'http://localhost:8081/oauth2/authorization/google';

  latestResponse: any = null;
  profile: any = null;
  airlines: any[] = [];
  airports: any[] = [];
  allFlights: any[] = [];
  flightResults: any[] = [];
  returnFlightResults: any[] = [];
  selectedFlight: any = null;
  availableSeats: any[] = [];
  selectedSeats: any[] = [];
  fareSummary: any = null;
  bookingResult: any = null;
  bookingDetails: any = null;
  bookedPassengers: any[] = [];
  paymentResult: any = null;
  paymentStatus = '';
  bookingConfirmationSentFor = '';
  private pendingBookingRecoveryId = '';
  notifications: any[] = [];
  userBookings: any[] = [];
  unreadCount = 0;
  hasSearchedFlights = false;
  searchFeedback = '';

  lookupResult: any = null;
  lookupPayment: any = null;
  receiptDocument: any = null;
  eticketDocument: any = null;
  boardingPassDocuments: Record<string, any> = {};
  successDocumentState = {
    receipt: 'idle',
    eticket: 'idle'
  };
  boardingPassState: Record<string, string> = {};

  staffFlights: any[] = [];
  staffFlightBookings: any[] = [];
  staffManifestRows: any[] = [];
  staffSeats: any[] = [];
  staffRevenueSummary: any = null;
  adminRevenue: any = null;
  adminUsers: any[] = [];
  adminBookings: any[] = [];
  adminPaymentsByBooking: Record<string, any> = {};
  adminNotificationsFeed: any[] = [];
  adminActivityLog: Array<{ title: string; detail: string; at: string }> = [];
  adminUserSearch = '';
  adminUserRoleFilter = '';
  adminBookingStatusFilter = '';
  adminBroadcastData = {
    targetRole: 'ALL',
    title: '',
    message: '',
    type: 'FLIGHT_DELAY',
    channel: 'APP'
  };
  adminAirlineForm = {
    airlineId: '',
    name: '',
    iataCode: '',
    icaoCode: '',
    logoUrl: '',
    country: '',
    contactEmail: '',
    contactPhone: ''
  };
  adminAirportForm = {
    airportId: '',
    name: '',
    iataCode: '',
    icaoCode: '',
    city: '',
    country: '',
    timezone: '',
    latitude: '',
    longitude: ''
  };

  loginData = {
    email: '',
    password: ''
  };

  registerData = {
    fullName: '',
    email: '',
    password: '',
    phone: '',
    passportNumber: '',
    nationality: '',
    role: 'PASSENGER'
  };

  registerConfirmPassword = '';

  searchData = {
    originAirportCode: '',
    destinationAirportCode: '',
    departureDate: '',
    returnDate: '',
    passengers: 1,
    isRoundTrip: false
  };

  searchFilters = {
    airlineId: '',
    maxPrice: '',
    departureWindow: 'ANY',
    sortBy: ''
  };

  bookingData = {
    userId: '',
    flightId: '',
    tripType: 'ONE_WAY',
    mealPreference: 'VEG',
    luggageKg: 15,
    contactEmail: '',
    contactPhone: '',
    paymentMode: 'UPI'
  };

  passengerForms: any[] = [];

  notificationData = {
    recipientId: '',
    type: 'BOOKING_CONFIRMED',
    title: 'Booking confirmed',
    message: 'Your booking is confirmed and ready to travel.',
    channel: 'APP',
    relatedBookingId: ''
  };

  profileData = {
    fullName: '',
    phone: '',
    passportNumber: '',
    nationality: ''
  };

  lookupData = {
    pnrCode: ''
  };

  refundData = {
    paymentId: '',
    refundAmount: 0
  };

  staffData = {
    airlineId: '',
    flightId: '',
    status: 'DELAYED'
  };

  staffFlightForm = {
    flightId: '',
    airlineId: '',
    flightNumber: '',
    originAirportCode: '',
    destinationAirportCode: '',
    departureTime: '',
    arrivalTime: '',
    aircraftType: '',
    totalSeats: 180,
    basePrice: 4500
  };

  staffSeatForm = {
    seatId: '',
    seatNumber: '',
    seatClass: 'ECONOMY',
    rowNumber: 1,
    seatColumn: 'A',
    isWindow: false,
    isAisle: false,
    hasExtraLegroom: false,
    priceMultiplier: 1
  };

  staffAlertForm = {
    type: 'FLIGHT_DELAY',
    channel: 'APP',
    title: '',
    message: ''
  };

  adminRange = {
    from: '2026-01-01T00:00:00',
    to: '2026-12-31T23:59:59'
  };

  readonly tripTypes = tripTypes;
  readonly genders = genders;
  readonly roles = roles;
  readonly bookingStatuses = bookingStatuses;
  readonly passengerTypes = passengerTypes;
  readonly paymentModes = paymentModes;
  readonly paymentStatuses = paymentStatuses;
  readonly notificationTypes = notificationTypes;
  readonly notificationChannels = notificationChannels;
  readonly flightStatuses = flightStatuses;

  get selectedSeatCount(): number {
    return this.selectedSeats.filter((seat) => !!seat).length;
  }

  private clearAutoRefreshTimers(): void {
    this.autoRefreshTimers.forEach((timer) => window.clearInterval(timer));
    this.autoRefreshTimers = [];
  }

  stopAutoRefresh(): void {
    this.clearAutoRefreshTimers();
  }

  private scheduleAutoRefresh(callback: () => void, intervalMs = 20000): void {
    const timer = window.setInterval(() => {
      if (this.loading) {
        return;
      }

      callback();
    }, intervalMs);

    this.autoRefreshTimers.push(timer);
  }

  private beginSearchAutoRefresh(): void {
    this.scheduleAutoRefresh(() => {
      this.loadReferenceData();
      this.loadAllFlights(false);
    }, 30000);
  }

  private beginBookingAutoRefresh(): void {
    this.scheduleAutoRefresh(() => {
      if (this.selectedFlight?.flightId) {
        this.loadAvailableSeats();
      }
    }, 12000);
  }

  private beginPaymentAutoRefresh(bookingId: string): void {
    this.scheduleAutoRefresh(() => {
      this.refreshBooking(bookingId);
      this.loadPassengersForBooking(bookingId);
      this.loadPaymentForBooking(bookingId);
    }, 10000);
  }

  private beginBookingSuccessAutoRefresh(bookingId: string): void {
    this.scheduleAutoRefresh(() => {
      void this.hydrateBookingSuccessWorkspace(bookingId, false);
    }, 12000);
  }

  private beginAccountAutoRefresh(): void {
    this.scheduleAutoRefresh(() => {
      this.loadProfile();

      if (this.isAdmin) {
        this.loadAdminBookings(false);
        this.loadAdminNotificationsFeed(false);
        return;
      }

      this.loadMyTrips();
      this.loadNotifications();
    }, 18000);
  }

  private beginLookupAutoRefresh(): void {
    this.scheduleAutoRefresh(() => {
      if (!this.lookupResult?.bookingId) {
        return;
      }

      this.loadPaymentForBooking(this.lookupResult.bookingId);
      this.loadPassengersForBooking(this.lookupResult.bookingId);
    }, 15000);
  }

  private beginCheckinAutoRefresh(): void {
    this.scheduleAutoRefresh(() => {
      this.loadMyTrips();
    }, 18000);
  }

  private beginStaffAutoRefresh(): void {
    this.scheduleAutoRefresh(() => {
      this.loadReferenceData();
      this.loadAllFlights(false);

      if (this.staffData.flightId) {
        this.loadStaffFlightWorkspace(false);
      }
    }, 15000);
  }

  private beginAdminAutoRefresh(): void {
    this.scheduleAutoRefresh(() => {
      this.loadAdminDashboard(false);
    }, 18000);
  }

  private scrollToOutboundFlights(): void {
    window.setTimeout(() => {
      document.getElementById('outbound-flights-section')?.scrollIntoView({
        behavior: 'auto',
        block: 'start'
      });
    }, 0);
  }

  get visibleFlightResults(): any[] {
    const baseResults = this.hasSearchedFlights ? this.flightResults : this.allFlights;
    let results = [...baseResults];

    if (this.searchFilters.airlineId) {
      results = results.filter((flight) => String(flight.airlineId ?? '') === String(this.searchFilters.airlineId));
    }

    if (this.searchFilters.maxPrice) {
      results = results.filter((flight) => Number(flight.basePrice ?? 0) <= Number(this.searchFilters.maxPrice));
    }

    if (this.searchFilters.departureWindow && this.searchFilters.departureWindow !== 'ANY') {
      results = results.filter((flight) => this.getDepartureBucket(flight.departureTime) === this.searchFilters.departureWindow);
    }

    switch (this.searchFilters.sortBy) {
      case 'PRICE_ASC':
        return results.sort((a, b) => Number(a.basePrice ?? 0) - Number(b.basePrice ?? 0));
      case 'PRICE_DESC':
        return results.sort((a, b) => Number(b.basePrice ?? 0) - Number(a.basePrice ?? 0));
      case 'DEPARTURE_ASC':
        return results.sort((a, b) => new Date(a.departureTime).getTime() - new Date(b.departureTime).getTime());
      default:
        return results;
    }
  }

  get displayedFlightCount(): number {
    return this.hasSearchedFlights ? this.flightResults.length : this.allFlights.length;
  }

  get accountDisplayName(): string {
    const fullName = this.normalizeProfileValue(this.profileData.fullName || this.currentUser?.fullName);
    if (fullName) {
      return fullName;
    }

    const email = this.normalizeProfileValue(this.currentUser?.email);
    if (email) {
      return email.split('@')[0];
    }

    return 'Traveller';
  }

  get profileEmailDisplay(): string {
    return this.normalizeProfileValue(this.currentUser?.email) || 'Not provided';
  }

  get isAdmin(): boolean {
    return String(this.currentUser?.role ?? '').toUpperCase() === 'ADMIN';
  }

  get isAirlineStaff(): boolean {
    const role = String(this.currentUser?.role ?? '').toUpperCase();
    return role === 'AIRLINE_STAFF' || role === 'ADMIN';
  }

  get isStrictAirlineStaff(): boolean {
    return String(this.currentUser?.role ?? '').toUpperCase() === 'AIRLINE_STAFF';
  }

  get staffAirlines(): any[] {
    return this.airlines
      .filter((airline) => airline?.isActive !== false)
      .sort((left, right) => String(left?.name ?? '').localeCompare(String(right?.name ?? '')));
  }

  get visibleStaffFlights(): any[] {
    const linkedAirlineId = String(this.staffData.airlineId ?? '').trim();
    const flights = linkedAirlineId
      ? this.allFlights.filter((flight) => String(flight?.airlineId ?? '') === linkedAirlineId)
      : this.allFlights;

    return [...flights].sort(
      (left, right) => new Date(left?.departureTime ?? 0).getTime() - new Date(right?.departureTime ?? 0).getTime()
    );
  }

  get staffLinkedAirlineName(): string {
    if (!this.staffData.airlineId) {
      return 'No airline linked yet';
    }

    return this.staffAirlines.find((airline) => airline?.airlineId === this.staffData.airlineId)?.name ?? 'Unknown airline';
  }

  get staffSelectedFlightSummary(): string {
    const flight = this.getSelectedStaffFlight();

    if (!flight) {
      return 'Select a flight to unlock schedule editing, seat map setup, manifest inspection, and alert tools.';
    }

    return `${flight.flightNumber} · ${this.getAirportDisplayLabel(flight.originAirportCode)} → ${this.getAirportDisplayLabel(flight.destinationAirportCode)} · ${flight.status}`;
  }

  get staffRevenueByClass(): Array<{ label: string; seats: number; revenue: number }> {
    const summary = this.staffRevenueSummary?.fareClassBreakdown ?? {};

    return Object.entries(summary)
      .map(([label, value]: [string, any]) => ({
        label,
        seats: Number(value?.seats ?? 0),
        revenue: Number(value?.revenue ?? 0)
      }))
      .sort((left, right) => right.revenue - left.revenue);
  }

  get staffAlertTypes(): string[] {
    return this.notificationTypes.filter((item) => item === 'FLIGHT_DELAY' || item === 'GATE_CHANGE');
  }

  get staffSeatClasses(): string[] {
    return ['ECONOMY', 'PREMIUM_ECONOMY', 'BUSINESS', 'FIRST'];
  }

  get visibleAdminUsers(): any[] {
    const needle = this.adminUserSearch.trim().toLowerCase();

    return this.adminUsers.filter((user) => {
      const matchesRole = !this.adminUserRoleFilter || String(user?.role ?? '').toUpperCase() === this.adminUserRoleFilter;
      const haystack = `${user?.fullName ?? ''} ${user?.email ?? ''} ${user?.phone ?? ''}`.toLowerCase();
      const matchesSearch = !needle || haystack.includes(needle);
      return matchesRole && matchesSearch;
    });
  }

  get visibleAdminBookings(): any[] {
    return this.adminBookings.filter((booking) => !this.adminBookingStatusFilter || String(booking?.status ?? '').toUpperCase() === this.adminBookingStatusFilter);
  }

  get adminRevenueDisplay(): number {
    return Number(this.adminRevenue?.totalRevenue ?? 0);
  }

  get adminSuspendedUsersCount(): number {
    return this.adminUsers.filter((user) => user?.active === false).length;
  }

  get adminDisplayedPayments(): any[] {
    return Object.values(this.adminPaymentsByBooking).filter((payment) => !!payment);
  }

  get adminPopularRoutes(): Array<{ label: string; value: string }> {
    const counts: Record<string, number> = {};

    this.adminBookings.forEach((booking) => {
      const route = this.getFlightRouteForBooking(booking);
      counts[route] = (counts[route] ?? 0) + 1;
    });

    return this.buildTopEntries(counts, 'No routes yet');
  }

  get adminBusiestAirports(): Array<{ label: string; value: string }> {
    const counts: Record<string, number> = {};

    this.allFlights.forEach((flight) => {
      const origin = this.getAirportCityByCode(flight?.originAirportCode);
      const destination = this.getAirportCityByCode(flight?.destinationAirportCode);
      counts[origin] = (counts[origin] ?? 0) + 1;
      counts[destination] = (counts[destination] ?? 0) + 1;
    });

    return this.buildTopEntries(counts, 'No airport traffic yet');
  }

  get adminAirlinePerformance(): Array<{ label: string; value: string }> {
    const counts: Record<string, number> = {};

    this.adminBookings.forEach((booking) => {
      const airline = this.getAirlineNameByFlight(booking);
      counts[airline] = (counts[airline] ?? 0) + 1;
    });

    return this.buildTopEntries(counts, 'No airline activity yet');
  }

  get visibleAccountBookings(): any[] {
    return this.isAdmin ? this.adminBookings : this.userBookings;
  }

  get accountBookingsHeading(): string {
    return this.isAdmin ? 'Platform bookings' : 'Recent bookings';
  }

  get visibleAccountNotifications(): any[] {
    const source = this.isAdmin ? this.adminNotificationsFeed : this.notifications;
    return (source ?? []).map((item: any) => ({
      ...item,
      title: this.sanitizeAdminActivityText(item?.title || 'Notification event'),
      message: this.sanitizeAdminActivityText(item?.message || item?.type || 'Platform event recorded.')
    }));
  }

  get accountNotificationHeading(): string {
    return this.isAdmin ? 'Platform notifications' : 'Your updates';
  }
  get adminRecentActivity(): Array<{ title: string; detail: string; at: string }> {
    const notificationItems = (this.adminNotificationsFeed ?? []).slice(0, 4).map((notification) => ({
      title: this.sanitizeAdminActivityText(notification?.title || 'Notification event'),
      detail: this.sanitizeAdminActivityText(notification?.message || notification?.type || 'Platform event recorded.'),
      at: notification?.createdAt || new Date().toISOString()
    }));

    return [...this.adminActivityLog, ...notificationItems]
      .sort((left, right) => new Date(right.at).getTime() - new Date(left.at).getTime())
      .slice(0, 8);
  }

  get canRequestRefund(): boolean {
    const bookingStatus = String(this.bookingDetails?.status ?? this.bookingResult?.status ?? this.lookupResult?.status ?? '').toUpperCase();
    return bookingStatus === 'CANCELLED' && !!this.paymentResult?.paymentId;
  }

  get canOpenRazorpayCheckout(): boolean {
    const status = String(this.paymentResult?.status ?? this.paymentStatus ?? '').toUpperCase();
    return !!this.paymentResult?.paymentId && !!this.paymentResult?.gatewayOrderId && status !== 'PAID' && status !== 'REFUNDED';
  }

  get receiptReady(): boolean {
    return !!this.receiptDocument;
  }

  get eticketReady(): boolean {
    return !!this.eticketDocument;
  }

  get receiptLabel(): string {
    if (this.receiptReady) {
      return 'Download receipt';
    }

    if (this.successDocumentState.receipt === 'failed') {
      return 'Receipt unavailable right now';
    }

    return 'Preparing receipt...';
  }

  get eticketLabel(): string {
    if (this.eticketReady) {
      return 'Download e-ticket';
    }

    if (this.successDocumentState.eticket === 'failed') {
      return 'E-ticket unavailable right now';
    }

    return 'Preparing e-ticket...';
  }

  constructor(private readonly api: ApiService) {
    this.loggedIn = !!this.accessToken;
    this.restoreWorkflowState();
    this.ensurePassengerForms(this.searchData.passengers);

    if (this.currentUser) {
      this.applyUserToForms(this.currentUser);
      this.currentStep = Math.max(this.currentStep, 2);
    }

  }

  saveGatewayUrl(): void {
    sessionStorage.setItem(this.storageKeys.gatewayUrl, this.gatewayUrl);
    this.showMessage('Gateway URL saved.');
  }

  initializeHomePage(): void {
    // Home stays lightweight and unauthenticated.
  }

  initializeAuthPage(): void {
    this.oauthLoginUrl = 'http://localhost:8081/oauth2/authorization/google';
    this.registerData.nationality = '';
    this.registerConfirmPassword = '';
  }

  initializeSearchPage(): void {
    this.clearAutoRefreshTimers();
    this.loadReferenceData();
    this.loadAllFlights();
    this.beginSearchAutoRefresh();
  }

  initializeBookingPage(): void {
    this.clearAutoRefreshTimers();

    if (!this.ensureLoggedIn('/auth')) {
      return;
    }

    if (!this.selectedFlight?.flightId) {
      this.showMessage('Select a flight first.');
      this.router.navigate(['/search']);
      return;
    }

    this.calculateFare();
    if (!this.availableSeats.length) {
      this.loadAvailableSeats();
    }

    this.beginBookingAutoRefresh();
  }

  initializePassengerPage(): void {
    if (!this.ensureLoggedIn('/auth')) {
      return;
    }

    if (!this.selectedFlight?.flightId) {
      this.showMessage('Choose the flight and seats first.');
      this.router.navigate(['/search']);
      return;
    }

    this.ensurePassengerForms(this.searchData.passengers);
  }

  initializePaymentPage(): void {
    this.clearAutoRefreshTimers();

    if (!this.ensureLoggedIn('/auth')) {
      return;
    }

    const bookingId = this.getActiveBookingId();
    if (!bookingId) {
      this.showMessage('Select a booking to load the booking workspace.');
      this.router.navigate(['/account']);
      return;
    }

    this.refreshBooking(bookingId);
    this.loadPassengersForBooking(bookingId);
    this.loadPaymentForBooking(bookingId);
    this.beginPaymentAutoRefresh(bookingId);
  }

  initializeBookingSuccessPage(): void {
    this.clearAutoRefreshTimers();

    if (!this.ensureLoggedIn('/auth')) {
      return;
    }

    const bookingId = this.getActiveBookingId();
    if (!bookingId) {
      this.showMessage('Select a booking to load the booking success page.');
      this.router.navigate(['/account']);
      return;
    }

    void this.hydrateBookingSuccessWorkspace(bookingId);
    this.beginBookingSuccessAutoRefresh(bookingId);
  }

  initializeAccountPage(): void {
    this.clearAutoRefreshTimers();

    if (!this.ensureLoggedIn('/auth')) {
      return;
    }

    this.loadProfile();

    if (this.isAdmin) {
      this.loadAdminBookings(false);
      this.loadAdminNotificationsFeed(false);
      this.beginAccountAutoRefresh();
      return;
    }

    this.loadMyTrips();
    this.loadNotifications();
    this.beginAccountAutoRefresh();
  }

  initializeLookupPage(): void {
    this.clearAutoRefreshTimers();

    if (!this.ensureLoggedIn('/auth')) {
      return;
    }

    if (this.lookupResult?.bookingId) {
      this.loadPaymentForBooking(this.lookupResult.bookingId);
      this.loadPassengersForBooking(this.lookupResult.bookingId);
    }

    this.beginLookupAutoRefresh();
  }

  initializeCheckinPage(): void {
    this.clearAutoRefreshTimers();

    if (!this.ensureLoggedIn('/auth')) {
      return;
    }

    this.loadMyTrips();
    this.beginCheckinAutoRefresh();
  }

  initializeStaffPage(): void {
    this.clearAutoRefreshTimers();

    if (!this.ensureLoggedIn('/auth')) {
      return;
    }

    if (!this.isStrictAirlineStaff) {
      this.showMessage('Staff access is available only to airline operators.');
      this.router.navigate(['/search']);
      return;
    }

    this.loadReferenceData();
    this.loadAllFlights(false);

    if (this.staffData.flightId) {
      this.loadStaffFlightWorkspace(false);
    }

    this.beginStaffAutoRefresh();
  }

  initializeAdminPage(): void {
    this.clearAutoRefreshTimers();

    if (!this.ensureLoggedIn('/auth')) {
      return;
    }

    if (!this.isAdmin) {
      this.showMessage('Admin access is available only to platform administrators.');
      this.router.navigate(['/search']);
      return;
    }

    this.loadAdminDashboard(true);

    window.setTimeout(() => {
      if (this.isAdmin) {
        this.loadAdminDashboard(false);
      }
    }, 500);

    this.beginAdminAutoRefresh();
  }

  continueWithGoogle(): void {
    window.location.href = this.oauthLoginUrl;
  }

  completeOauthLogin(params: { accessToken?: string | null; refreshToken?: string | null; email?: string | null; role?: string | null }): void {
    const accessToken = params.accessToken ?? '';
    if (!accessToken) {
      this.showMessage('Google login token was not received.');
      this.router.navigate(['/auth']);
      return;
    }

    this.accessToken = accessToken;
    this.refreshToken = params.refreshToken ?? '';
    this.currentUser = {
      ...(this.currentUser ?? {}),
      accessToken: this.accessToken,
      refreshToken: this.refreshToken,
      email: params.email ?? this.currentUser?.email ?? '',
      role: params.role ?? this.currentUser?.role ?? 'PASSENGER'
    };
    this.finalizeAuthSuccess(this.currentUser, 'Google login successful.');
  }

  login(): void {
    const email = this.normalizeEmailValue(this.loginData.email);
    const password = this.normalizeProfileValue(this.loginData.password);

    if (!this.isValidEmail(email)) {
      this.loading = false;
      this.loadingLabel = '';
      this.showMessage('Enter a valid email address, for example divyanshi@example.com.');
      return;
    }

    if (!password) {
      this.loading = false;
      this.loadingLabel = '';
      this.showMessage('Enter your password.');
      return;
    }

    this.loginData = { email, password };

    this.runRequest(
      'Logging in',
      'POST',
      '/auth/login',
      this.loginData,
      undefined,
      false,
      (response: any) => {
        this.finalizeAuthSuccess(response, 'Login successful. You can start searching now.');
      }
    );
  }

  register(): void {
    const fullName = this.normalizeProfileValue(this.registerData.fullName);
    const email = this.normalizeEmailValue(this.registerData.email);
    const password = this.registerData.password.trim();
    const confirmPassword = this.registerConfirmPassword.trim();
    const phone = this.normalizeProfileValue(this.registerData.phone);
    const passportNumber = this.normalizePassportValue(this.registerData.passportNumber);
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (!fullName) {
      this.showMessage('Enter your full name.');
      return;
    }

    if (!this.isValidEmail(email)) {
      this.showMessage('Enter a valid email address, for example divyanshi@example.com.');
      return;
    }

    if (!phone) {
      this.showMessage('Enter your phone number.');
      return;
    }

    if (!passwordPattern.test(password)) {
      this.showMessage('Password must include at least 8 characters, 1 uppercase letter, 1 lowercase letter, and 1 digit.');
      return;
    }

    if (password !== confirmPassword) {
      this.showMessage('Password and confirm password must match.');
      return;
    }

    if (passportNumber && !this.isValidPassportNumber(passportNumber)) {
      this.showMessage('Passport number must contain 1 letter followed by 7 digits.');
      return;
    }

    this.registerData = {
      ...this.registerData,
      fullName,
      email,
      password,
      phone,
      passportNumber,
      nationality: this.normalizeProfileValue(this.registerData.nationality),
      role: this.registerData.role || 'PASSENGER'
    };

    this.runRequest('Creating account', 'POST', '/auth/register', this.registerData, undefined, false, (response: any) => {
      this.registerConfirmPassword = '';
      this.finalizeAuthSuccess(response, 'Account created successfully. Redirecting you now.');
    });
  }
  logout(): void {
    if (!this.accessToken) {
      return;
    }

    this.clearAutoRefreshTimers();

    this.runRequest('Logging out', 'POST', '/auth/logout', undefined, undefined, true, () => {
      this.clearSession();
      this.router.navigate(['/auth']);
      this.showMessage('Logout successful.');
    });
  }

  loadProfile(): void {
    this.runRequest(
      'Loading profile',
      'GET',
      '/auth/profile',
      undefined,
      undefined,
      true,
      (response: any) => {
        this.syncProfileState(response);
        this.persistWorkflowState();
      },
      false
    );
  }

  updateProfile(): void {
    const payload = {
      fullName: this.profileData.fullName?.trim() || null,
      phone: this.profileData.phone?.trim() || null,
      passportNumber: this.profileData.passportNumber?.trim() || null,
      nationality: this.profileData.nationality?.trim() || null
    };

    this.runRequest('Updating profile', 'PUT', '/auth/profile', payload, undefined, true, (response: any) => {
      this.syncProfileState(response);
      this.persistWorkflowState();
      this.showMessage('Profile updated.');
    });
  }

  loadReferenceData(): void {
    this.runRequest(
      'Loading airlines',
      'GET',
      '/airlines',
      undefined,
      undefined,
      true,
      (response: any) => {
        this.airlines = Array.isArray(response) ? response : [];
        this.persistWorkflowState();
      },
      false
    );

    this.runRequest(
      'Loading airports',
      'GET',
      '/airports',
      undefined,
      undefined,
      true,
      (response: any) => {
        this.airports = Array.isArray(response) ? response : [];
        this.persistWorkflowState();
      },
      false
    );
  }

  setPassengerCount(count: number): void {
    const safeCount = Math.max(1, Number(count) || 1);
    this.searchData.passengers = safeCount;
    this.ensurePassengerForms(safeCount);
    this.persistWorkflowState();
  }

  setTripMode(isRoundTrip: boolean): void {
    this.searchData.isRoundTrip = isRoundTrip;
    this.bookingData.tripType = isRoundTrip ? 'ROUND_TRIP' : 'ONE_WAY';
    this.persistWorkflowState();
  }

  searchFlights(): void {
    this.ensurePassengerForms(this.searchData.passengers);

    const originAirportCode = this.resolveAirportCode(this.searchData.originAirportCode);
    const destinationAirportCode = this.resolveAirportCode(this.searchData.destinationAirportCode);
    this.flightResults = [];
    this.returnFlightResults = [];
    this.hasSearchedFlights = true;
    this.searchFeedback = 'Searching premium fares...';
    this.persistWorkflowState();

    const path = this.searchData.isRoundTrip ? '/flights/search/round-trip' : '/flights/search';
    const body = this.searchData.isRoundTrip
      ? {
          originAirportCode,
          destinationAirportCode,
          departureDate: this.searchData.departureDate,
          returnDate: this.searchData.returnDate,
          passengers: this.searchData.passengers
        }
      : {
          originAirportCode,
          destinationAirportCode,
          departureDate: this.searchData.departureDate,
          passengers: this.searchData.passengers
        };

    this.runRequest('Searching flights', 'POST', path, body, undefined, false, (response: any) => {
      this.hasSearchedFlights = true;
      this.consumeFlightSearchResponse(response);
      this.persistWorkflowState();

      if (this.flightResults.length || this.returnFlightResults.length) {
        this.currentStep = 2;
        this.searchFeedback = `${this.flightResults.length + this.returnFlightResults.length} flight option${this.flightResults.length + this.returnFlightResults.length === 1 ? '' : 's'} found.`;
        this.scrollToOutboundFlights();
      } else {
        this.searchFeedback = 'No flights found for this route yet.';
      }
    });
  }

  selectFlight(flight: any): void {
    if (!this.loggedIn) {
      this.selectedFlight = flight;
      this.bookingData.flightId = flight.flightId ?? '';
      this.persistWorkflowState();
      this.showMessage('Please log in before seat selection and booking.');
      this.router.navigate(['/auth']);
      return;
    }

    this.selectedFlight = flight;
    this.bookingData.flightId = flight.flightId ?? '';
    this.selectedSeats = new Array(this.searchData.passengers).fill(null);
    this.activePassengerIndex = 0;
    this.availableSeats = [];
    this.calculateFare();
    this.loadAvailableSeats();
    this.currentStep = 3;
    this.persistWorkflowState();
    this.showMessage(`Flight ${flight.flightNumber} selected.`);
    this.router.navigate(['/booking']);
  }

  calculateFare(): void {
    if (!this.selectedFlight?.flightId) {
      return;
    }

    const query = {
      flightId: this.selectedFlight.flightId,
      passengerCount: this.searchData.passengers,
      luggageKg: this.bookingData.luggageKg
    };

    this.runRequest('Calculating fare', 'GET', '/bookings/calculate-fare', undefined, query, true, (response: any) => {
      this.fareSummary = response;
      this.persistWorkflowState();
    });
  }

  loadAvailableSeats(): void {
    if (!this.bookingData.flightId) {
      return;
    }

    this.runRequest(
      'Loading seats',
      'GET',
      `/seats/flight/${this.bookingData.flightId}/available`,
      undefined,
      undefined,
      true,
      (response: any) => {
        this.availableSeats = Array.isArray(response) ? response : [];
        this.persistWorkflowState();
      }
    );
  }

  setActivePassenger(index: number): void {
    this.activePassengerIndex = index;
  }

  assignSeat(seat: any, index = this.activePassengerIndex): void {
    const existingIndex = this.selectedSeats.findIndex((item) => item?.seatId === seat?.seatId);

    if (existingIndex !== -1 && existingIndex !== index) {
      this.showMessage('This seat is already assigned to another traveller.');
      return;
    }

    this.selectedSeats[index] = seat;
    this.persistWorkflowState();
    this.showMessage(`Seat ${seat.seatNumber} assigned to traveller ${index + 1}.`);
  }

  isSeatTakenByOtherPassenger(seatId: string): boolean {
    return this.selectedSeats.some((seat, index) => seat?.seatId === seatId && index !== this.activePassengerIndex);
  }

  continueToPassenger(): void {
    if (this.selectedSeatCount !== this.searchData.passengers) {
      this.showMessage('Select a seat for every traveller.');
      return;
    }

    this.currentStep = 4;
    this.persistWorkflowState();
    this.router.navigate(['/passenger']);
  }

  createBooking(): void {
    if (!this.loggedIn || !this.currentUser?.userId) {
      this.showMessage('Please log in first.');
      return;
    }

    if (!this.selectedFlight?.flightId) {
      this.showMessage('Select a flight first.');
      return;
    }

    if (this.selectedSeatCount !== this.searchData.passengers) {
      this.showMessage('Seat selection is not complete yet.');
      return;
    }

    const hasIncompletePassenger = this.passengerForms.some((passenger) =>
      !passenger.title ||
      !passenger.firstName ||
      !passenger.lastName ||
      !passenger.dateOfBirth ||
      !passenger.gender ||
      !passenger.passportNumber ||
      !passenger.nationality ||
      !passenger.passportExpiry ||
      !passenger.passengerType
    );

    if (hasIncompletePassenger) {
      this.showMessage('Complete all passenger details.');
      return;
    }

    const bookingBody = {
      userId: this.currentUser.userId,
      flightId: this.selectedFlight.flightId,
      tripType: this.bookingData.tripType,
      mealPreference: this.bookingData.mealPreference,
      luggageKg: this.bookingData.luggageKg,
      contactEmail: this.bookingData.contactEmail,
      contactPhone: this.bookingData.contactPhone,
      paymentMode: this.bookingData.paymentMode,
      passengers: this.passengerForms.map((passenger, index) => ({
        ...passenger,
        seatId: this.selectedSeats[index]?.seatId,
        seatNumber: this.selectedSeats[index]?.seatNumber
      }))
    };

    this.runRequest('Creating booking', 'POST', '/bookings', bookingBody, undefined, true, (response: any) => {
      this.bookingResult = response;
      this.bookingDetails = response;
      this.lookupResult = response;
      this.notificationData.relatedBookingId = response.bookingId ?? '';
      this.currentStep = 5;
      this.persistWorkflowState();
      this.loadPassengersForBooking(response.bookingId);
      this.loadPaymentForBooking(response.bookingId);
      this.refreshBooking(response.bookingId);
      this.showMessage('Booking created successfully. The payment page is ready.');
      this.router.navigate(['/payment']);
    });
  }

  loadPassengersForBooking(bookingId = this.bookingResult?.bookingId): void {
    if (!bookingId) {
      return;
    }

    this.runRequest(
      'Loading passengers',
      'GET',
      `/passengers/booking/${bookingId}`,
      undefined,
      undefined,
      true,
      (response: any) => {
        this.bookedPassengers = Array.isArray(response) ? response : [];
        this.persistWorkflowState();
      }
    );
  }

  loadPaymentForBooking(bookingId = this.bookingResult?.bookingId): void {
    if (!bookingId) {
      return;
    }

    this.runRequest('Loading payment', 'GET', `/payments/booking/${bookingId}`, undefined, undefined, true, (response: any) => {
      this.paymentResult = response;
      this.lookupPayment = response;
      this.paymentStatus = response?.status ?? this.paymentStatus;
      this.refundData.paymentId = response?.paymentId ?? this.refundData.paymentId;
      this.refundData.refundAmount = Number(response?.amount ?? this.refundData.refundAmount);
      this.persistWorkflowState();
      this.tryRecoverPaidPendingBooking(bookingId);
      this.maybeEnterBookingSuccessFlow();
    });
  }

  refreshPaymentStatus(): void {
    const paymentId = this.paymentResult?.paymentId;

    if (!paymentId) {
      return;
    }

    this.runRequest(
      'Refreshing payment status',
      'GET',
      `/payments/${paymentId}/status`,
      undefined,
      undefined,
      true,
      (response: any) => {
        this.paymentStatus = typeof response === 'string' ? response : response?.status ?? '';
        this.persistWorkflowState();
      }
    );
  }

  markPaymentPaid(): void {
    const paymentId = this.paymentResult?.paymentId;

    if (!paymentId) {
      this.showMessage('The payment record has not loaded yet.');
      return;
    }

    this.runRequest(
      'Updating payment status',
      'PUT',
      `/payments/${paymentId}/status`,
      {
        status: 'PAID',
        gatewayResponse: 'FRONTEND_MANUAL_SUCCESS'
      },
      undefined,
      true,
      (response: any) => {
        this.paymentResult = response ?? { ...this.paymentResult, status: 'PAID' };
        this.lookupPayment = this.paymentResult;
        this.paymentStatus = response?.status ?? 'PAID';
        this.refreshBooking();
        this.loadPassengersForBooking();
        this.loadNotifications();
        this.currentStep = 6;
        this.persistWorkflowState();
        this.showMessage('Payment marked as paid.');
      }
    );
  }

  payWithRazorpay(): void {
    const paymentId = this.paymentResult?.paymentId;

    if (!paymentId) {
      this.showMessage('The payment record has not loaded yet.');
      return;
    }

    this.loadRazorpayScript()
      .then((loaded) => {
        if (!loaded) {
          this.showMessage('Razorpay checkout could not be loaded.');
          return;
        }

        this.runRequest(
          'Preparing Razorpay checkout',
          'GET',
          `/payments/${paymentId}/razorpay-order`,
          undefined,
          undefined,
          true,
          (response: any) => {
            const RazorpayCtor = (window as any).Razorpay;

            if (!RazorpayCtor) {
              this.showMessage('Razorpay checkout is not available in this browser.');
              return;
            }

            const orderId = response?.razorpayOrderId ?? this.paymentResult?.gatewayOrderId;
            const keyId = response?.razorpayKeyId ?? this.paymentResult?.razorpayKeyId;
            const amount = Number(response?.amount ?? this.paymentResult?.amount ?? 0);
            const currency = response?.currency ?? this.paymentResult?.currency ?? 'INR';

            if (!orderId || !keyId || !amount) {
              this.showMessage('Razorpay order details are incomplete.');
              return;
            }

            const fullName = this.normalizeProfileValue(this.currentUser?.fullName || this.profileData.fullName) || 'SkyBooker Traveller';
            const email = this.normalizeProfileValue(this.currentUser?.email || this.bookingData.contactEmail);
            const phone = this.normalizePhoneValue(this.bookingData.contactPhone || this.currentUser?.phone);

            const razorpay = new RazorpayCtor({
              key: keyId,
              amount: Math.round(amount * 100),
              currency,
              name: 'SkyBooker',
              description: `Booking ${this.bookingResult?.pnrCode || this.bookingResult?.bookingId || ''}`.trim(),
              order_id: orderId,
              prefill: {
                name: fullName,
                email,
                contact: phone
              },
              notes: {
                bookingId: this.bookingResult?.bookingId ?? '',
                paymentId
              },
              theme: {
                color: '#2f5cf6'
              },
              modal: {
                ondismiss: () => {
                  this.showMessage('Razorpay checkout was closed.');
                }
              },
              handler: (paymentResponse: any) => {
                this.verifyRazorpayPayment(paymentId, paymentResponse);
              }
            });

            razorpay.open();
          }
        );
      })
      .catch(() => {
        this.showMessage('Razorpay checkout could not be loaded.');
      });
  }

  refreshBooking(bookingId = this.bookingResult?.bookingId): void {
    if (!bookingId) {
      return;
    }

    this.runRequest('Refreshing booking', 'GET', `/bookings/${bookingId}`, undefined, undefined, true, (response: any) => {
      this.bookingDetails = response;
      this.bookingResult = response;
      this.lookupResult = response;
      this.persistWorkflowState();
      this.tryRecoverPaidPendingBooking(bookingId);
      this.maybeEnterBookingSuccessFlow();
      if (response?.flightId) {
        this.loadFlightById(response.flightId, false);
      }
    });
  }

  lookupBookingByPnr(): void {
    const pnrCode = this.lookupData.pnrCode.trim();

    if (!pnrCode) {
      this.showMessage('Enter a PNR code.');
      return;
    }

    this.runRequest('Looking up booking', 'GET', `/bookings/pnr/${pnrCode}`, undefined, undefined, false, (response: any) => {
      this.lookupResult = response;
      this.bookingResult = response;
      this.bookingDetails = response;
      this.notificationData.relatedBookingId = response?.bookingId ?? '';
      this.loadPassengersForBooking(response?.bookingId);
      this.loadPaymentForBooking(response?.bookingId);
      if (response?.flightId) {
        this.loadFlightById(response.flightId, false);
      }
      this.persistWorkflowState();
      this.showMessage('Booking found successfully.');
    });
  }

  cancelCurrentBooking(): void {
    const bookingId = this.bookingResult?.bookingId ?? this.lookupResult?.bookingId;

    if (!bookingId) {
      this.showMessage('Load a booking before cancelling it.');
      return;
    }

    this.runRequest('Cancelling booking', 'PUT', `/bookings/${bookingId}/cancel`, {}, undefined, true, (response: any) => {
      this.bookingResult = response;
      this.bookingDetails = response;
      this.lookupResult = response;
      this.persistWorkflowState();
      this.showMessage('Booking cancelled successfully.');
      this.refreshBooking(bookingId);
    });
  }

  requestRefund(): void {
    if (!this.refundData.paymentId) {
      this.showMessage('Load a payment before requesting a refund.');
      return;
    }

    this.runRequest('Requesting refund', 'POST', '/payments/refund', this.refundData, undefined, true, (response: any) => {
      this.paymentResult = response;
      this.lookupPayment = response;
      this.paymentStatus = response?.status ?? this.paymentStatus;
      this.persistWorkflowState();
      this.showMessage('Refund request submitted successfully.');
    });
  }

  loadReceipt(): void {
    const paymentId = this.paymentResult?.paymentId ?? this.lookupPayment?.paymentId;

    if (!paymentId) {
      return;
    }

    this.runRequest('Loading receipt', 'GET', `/payments/receipt/${paymentId}`, undefined, undefined, true, (response: any) => {
      this.receiptDocument = response;
      this.persistWorkflowState();
    });
  }

  loadEticket(): void {
    const bookingId = this.bookingResult?.bookingId ?? this.lookupResult?.bookingId;

    if (!bookingId) {
      return;
    }

    this.runRequest('Loading e-ticket', 'GET', `/bookings/${bookingId}/eticket`, undefined, undefined, true, (response: any) => {
      this.eticketDocument = response;
      this.persistWorkflowState();
    });
  }

  loadBoardingPass(passenger: any): void {
    const bookingId = this.bookingResult?.bookingId ?? this.lookupResult?.bookingId;
    const passengerId = passenger?.passengerId;

    if (!bookingId || !passengerId) {
      return;
    }

    this.runRequest(
      'Loading boarding pass',
      'GET',
      `/bookings/${bookingId}/boarding-pass/${passengerId}`,
      undefined,
      undefined,
      true,
      (response: any) => {
        this.boardingPassDocuments[passengerId] = response;
        this.persistWorkflowState();
      }
    );
  }

  downloadDocument(document: any, fallbackName = 'document.pdf'): void {
    const content = document?.content ?? document?.receiptContent ?? document?.fileContent ?? document?.base64Content;

    if (!content) {
      this.showMessage('Document content is not available.');
      return;
    }

    const anchor = window.document.createElement('a');
    anchor.href = `data:${document?.contentType ?? 'application/pdf'};base64,${content}`;
    anchor.download = document?.fileName ?? fallbackName;
    anchor.click();
  }

  completeRazorpayReturn(params: {
    paymentId: string;
    razorpayPaymentId: string;
    razorpayOrderId: string;
    razorpaySignature: string;
  }): void {
    this.verifyRazorpayPayment(params.paymentId, {
      razorpay_payment_id: params.razorpayPaymentId,
      razorpay_order_id: params.razorpayOrderId,
      razorpay_signature: params.razorpaySignature
    });
  }

  loadMyTrips(): void {
    if (this.isAdmin) {
      this.loadAdminBookings();
      return;
    }

    const userId = this.currentUser?.userId;

    if (!userId) {
      return;
    }

    this.runRequest(
      'Loading trips',
      'GET',
      `/bookings/user/${userId}`,
      undefined,
      undefined,
      true,
      (response: any) => {
        this.userBookings = Array.isArray(response) ? response : [];
        this.persistWorkflowState();
      },
      false
    );
  }

  openBookingWorkspace(booking: any): void {
    this.bookingResult = booking;
    this.bookingDetails = booking;
    this.lookupResult = booking;
    this.notificationData.relatedBookingId = booking?.bookingId ?? '';
    this.persistWorkflowState();
    this.loadPassengersForBooking(booking?.bookingId);
    this.loadPaymentForBooking(booking?.bookingId);
    if (booking?.flightId) {
      this.loadFlightById(booking.flightId, false);
    }
    this.router.navigate(['/payment']);
  }

  loadCheckinWorkspace(): void {
    if (this.lookupData.pnrCode.trim()) {
      this.lookupBookingByPnr();
    } else if (this.currentUser?.userId) {
      this.loadMyTrips();
    }
  }

  loadAllFlights(showLoader = false): void {
    this.runRequest('Loading flights', 'GET', '/flights', undefined, undefined, false, (response: any) => {
      this.allFlights = Array.isArray(response) ? response : [];
      this.staffFlights = this.allFlights;
      this.applyStaffAirlineDefaults();

      if (this.isStrictAirlineStaff && this.staffData.flightId) {
        const stillVisible = this.visibleStaffFlights.some((flight) => flight?.flightId === this.staffData.flightId);

        if (stillVisible) {
          this.loadStaffFlightWorkspace(false);
        } else {
          this.staffData.flightId = '';
          this.staffFlightBookings = [];
          this.staffManifestRows = [];
          this.staffSeats = [];
          this.staffRevenueSummary = null;
        }
      }

      this.persistWorkflowState();
    }, showLoader);
  }

  selectStaffAirline(airlineId: string): void {
    this.staffData.airlineId = String(airlineId ?? '');
    this.staffFlightForm.airlineId = this.staffData.airlineId;

    if (!this.visibleStaffFlights.some((flight) => flight?.flightId === this.staffData.flightId)) {
      this.staffData.flightId = '';
      this.staffFlightBookings = [];
      this.staffManifestRows = [];
      this.staffSeats = [];
      this.staffRevenueSummary = null;
    }

    this.persistWorkflowState();
  }

  selectStaffFlight(flightId: string): void {
    this.staffData.flightId = String(flightId ?? '');
    const flight = this.getSelectedStaffFlight();

    if (flight?.status) {
      this.staffData.status = String(flight.status);
    }

    if (!this.staffData.flightId) {
      this.staffFlightBookings = [];
      this.staffManifestRows = [];
      this.staffSeats = [];
      this.staffRevenueSummary = null;
      this.persistWorkflowState();
      return;
    }

    this.persistWorkflowState();
    this.loadStaffFlightWorkspace(false);
  }

  focusStaffFlight(flight: any): void {
    if (!flight?.flightId) {
      return;
    }

    this.staffData.airlineId = flight?.airlineId ?? this.staffData.airlineId;
    this.staffData.flightId = flight.flightId;
    this.staffData.status = flight?.status ?? this.staffData.status;
    this.persistWorkflowState();
    this.loadStaffFlightWorkspace();
  }

  editStaffFlightSchedule(flight: any): void {
    if (!flight?.flightId) {
      return;
    }

    this.staffData.airlineId = flight?.airlineId ?? this.staffData.airlineId;
    this.staffData.flightId = flight.flightId;
    this.staffData.status = flight?.status ?? this.staffData.status;
    this.staffFlightForm = {
      flightId: flight.flightId ?? '',
      airlineId: flight.airlineId ?? this.staffData.airlineId,
      flightNumber: flight.flightNumber ?? '',
      originAirportCode: this.getAirportDisplayLabel(flight.originAirportCode ?? ''),
      destinationAirportCode: this.getAirportDisplayLabel(flight.destinationAirportCode ?? ''),
      departureTime: this.toDateTimeLocalValue(flight.departureTime),
      arrivalTime: this.toDateTimeLocalValue(flight.arrivalTime),
      aircraftType: flight.aircraftType ?? '',
      totalSeats: Number(flight.totalSeats ?? 180),
      basePrice: Number(flight.basePrice ?? 4500)
    };
    this.persistWorkflowState();
  }

  resetStaffFlightForm(): void {
    this.staffFlightForm = {
      flightId: '',
      airlineId: this.staffData.airlineId || '',
      flightNumber: '',
      originAirportCode: '',
      destinationAirportCode: '',
      departureTime: '',
      arrivalTime: '',
      aircraftType: '',
      totalSeats: 180,
      basePrice: 4500
    };
    this.persistWorkflowState();
  }

  saveStaffFlightSchedule(): void {
    const airlineId = this.staffFlightForm.airlineId || this.staffData.airlineId;
    const originAirportCode = this.resolveAirportCode(this.staffFlightForm.originAirportCode);
    const destinationAirportCode = this.resolveAirportCode(this.staffFlightForm.destinationAirportCode);
    const departureTime = this.staffFlightForm.departureTime;
    const arrivalTime = this.staffFlightForm.arrivalTime;

    if (!airlineId || !this.staffFlightForm.flightNumber.trim() || !originAirportCode || !destinationAirportCode || !departureTime || !arrivalTime) {
      this.showMessage('To save the flight schedule, fill in the airline, flight number, route, departure time, and arrival time.');
      return;
    }

    const body = {
      flightNumber: this.staffFlightForm.flightNumber.trim(),
      airlineId,
      originAirportCode,
      destinationAirportCode,
      departureTime,
      arrivalTime,
      durationMinutes: this.calculateDurationMinutes(departureTime, arrivalTime),
      aircraftType: this.staffFlightForm.aircraftType.trim() || 'Airbus A320',
      totalSeats: Number(this.staffFlightForm.totalSeats || 0),
      basePrice: Number(this.staffFlightForm.basePrice || 0)
    };

    const isEditing = !!this.staffFlightForm.flightId;
    const path = isEditing ? `/flights/${this.staffFlightForm.flightId}` : '/flights';
    const method: 'POST' | 'PUT' = isEditing ? 'PUT' : 'POST';

    this.runRequest(isEditing ? 'Updating flight schedule' : 'Creating flight schedule', method, path, body, undefined, true, (response: any) => {
      const flightId = response?.flightId ?? this.staffFlightForm.flightId;
      this.showMessage(isEditing ? 'Flight schedule updated.' : 'Flight schedule created.');
      this.resetStaffFlightForm();
      this.loadAllFlights(false);

      if (flightId) {
        this.staffData.airlineId = airlineId;
        this.staffData.flightId = flightId;
        this.loadStaffFlightWorkspace(false);
      }
    });
  }

  loadStaffFlightWorkspace(showLoader = true): void {
    if (!this.staffData.flightId) {
      this.showMessage('Select a flight first.');
      return;
    }

    const flight = this.getSelectedStaffFlight();
    if (flight?.status) {
      this.staffData.status = String(flight.status);
    }

    this.loadStaffSeatMap(false);
    this.loadFlightBookings(showLoader);
  }

  loadFlightBookings(showLoader = false): void {
    if (!this.staffData.flightId) {
      this.showMessage('Select a flight first.');
      return;
    }

    if (showLoader) {
      this.loading = true;
      this.loadingLabel = 'Loading passenger manifest';
    }

    void Promise.all([
      this.requestAsync('GET', `/bookings/flight/${this.staffData.flightId}`, undefined, undefined, true).catch(() => []),
      this.requestAsync('GET', `/seats/flight/${this.staffData.flightId}`, undefined, undefined, true).catch(() => [])
    ])
      .then(async ([bookings, seats]) => {
        this.staffFlightBookings = Array.isArray(bookings) ? bookings : [];
        this.staffSeats = Array.isArray(seats) ? seats : [];

        const seatById = new Map(this.staffSeats.map((seat: any) => [String(seat?.seatId ?? ''), seat]));
        const seatByNumber = new Map(this.staffSeats.map((seat: any) => [String(seat?.seatNumber ?? ''), seat]));

        const manifestGroups = await Promise.all(
          this.staffFlightBookings.map(async (booking: any) => {
            const passengers = await this.requestAsync('GET', `/passengers/booking/${booking.bookingId}`, undefined, undefined, true)
              .catch(() => []);
            const passengerList = Array.isArray(passengers) ? passengers : [];
            const allocatedFare = passengerList.length ? Number(booking?.totalFare ?? 0) / passengerList.length : Number(booking?.totalFare ?? 0);

            return passengerList.map((passenger: any) => {
              const seat = seatById.get(String(passenger?.seatId ?? '')) ?? seatByNumber.get(String(passenger?.seatNumber ?? ''));

              return {
                bookingId: booking?.bookingId ?? '',
                pnrCode: booking?.pnrCode || booking?.bookingId || 'Pending',
                passengerId: passenger?.passengerId ?? '',
                passengerName: `${passenger?.firstName ?? ''} ${passenger?.lastName ?? ''}`.trim() || 'Passenger',
                seatNumber: passenger?.seatNumber || seat?.seatNumber || 'TBD',
                seatClass: seat?.seatClass || 'UNASSIGNED',
                mealPreference: booking?.mealPreference || 'Standard meal',
                checkInStatus: passenger?.checkInStatus || booking?.checkInStatus || 'Not checked in',
                allocatedFare
              };
            });
          })
        );

        this.staffManifestRows = manifestGroups.flat();
        this.staffRevenueSummary = this.buildStaffRevenueSummary(this.staffManifestRows, this.staffFlightBookings, this.staffSeats);
        this.persistWorkflowState();
      })
      .catch((error) => {
        const backendMessage = this.extractErrorMessage(error);
        this.showMessage(backendMessage ? `Loading passenger manifest failed: ${backendMessage}` : 'Loading passenger manifest failed.');
      })
      .finally(() => {
        if (showLoader) {
          this.loading = false;
          this.loadingLabel = '';
        }
      });
  }

  updateFlightStatus(): void {
    if (!this.staffData.flightId) {
      this.showMessage('Select a flight first.');
      return;
    }

    this.runRequest(
      'Updating flight status',
      'PUT',
      `/flights/${this.staffData.flightId}/status`,
      { status: this.staffData.status },
      undefined,
      true,
      () => {
        this.showMessage('Flight status updated.');
        this.loadAllFlights(false);
        this.loadStaffFlightWorkspace(false);
      }
    );
  }

  loadStaffSeatMap(showLoader = false): void {
    if (!this.staffData.flightId) {
      return;
    }

    this.runRequest('Loading seat map', 'GET', `/seats/flight/${this.staffData.flightId}`, undefined, undefined, true, (response: any) => {
      this.staffSeats = Array.isArray(response) ? response : [];
      this.persistWorkflowState();
    }, showLoader);
  }

  editStaffSeat(seat: any): void {
    this.staffSeatForm = {
      seatId: seat?.seatId ?? '',
      seatNumber: seat?.seatNumber ?? '',
      seatClass: seat?.seatClass ?? 'ECONOMY',
      rowNumber: Number(seat?.rowNumber ?? 1),
      seatColumn: seat?.seatColumn ?? 'A',
      isWindow: !!seat?.isWindow,
      isAisle: !!seat?.isAisle,
      hasExtraLegroom: !!seat?.hasExtraLegroom,
      priceMultiplier: Number(seat?.priceMultiplier ?? 1)
    };
    this.persistWorkflowState();
  }

  resetStaffSeatForm(): void {
    this.staffSeatForm = {
      seatId: '',
      seatNumber: '',
      seatClass: 'ECONOMY',
      rowNumber: 1,
      seatColumn: 'A',
      isWindow: false,
      isAisle: false,
      hasExtraLegroom: false,
      priceMultiplier: 1
    };
    this.persistWorkflowState();
  }

  saveStaffSeat(): void {
    if (!this.staffData.flightId) {
      this.showMessage('Select the flight workspace before saving a seat.');
      return;
    }

    if (!this.staffSeatForm.seatNumber.trim() || !this.staffSeatForm.seatColumn.trim()) {
      this.showMessage('Seat number and column are both required.');
      return;
    }

    const body = {
      flightId: this.staffData.flightId,
      seatNumber: this.staffSeatForm.seatNumber.trim().toUpperCase(),
      seatClass: this.staffSeatForm.seatClass,
      rowNumber: Number(this.staffSeatForm.rowNumber || 1),
      seatColumn: this.staffSeatForm.seatColumn.trim().toUpperCase(),
      isWindow: !!this.staffSeatForm.isWindow,
      isAisle: !!this.staffSeatForm.isAisle,
      hasExtraLegroom: !!this.staffSeatForm.hasExtraLegroom,
      priceMultiplier: Number(this.staffSeatForm.priceMultiplier || 1)
    };

    const isEditing = !!this.staffSeatForm.seatId;
    const path = isEditing ? `/seats/${this.staffSeatForm.seatId}` : '/seats';
    const method: 'POST' | 'PUT' = isEditing ? 'PUT' : 'POST';

    this.runRequest(isEditing ? 'Updating seat' : 'Adding seat', method, path, body, undefined, true, () => {
      this.showMessage(isEditing ? 'Seat updated.' : 'Seat added.');
      this.resetStaffSeatForm();
      this.loadStaffSeatMap(false);
      this.loadFlightBookings(false);
    });
  }

  clearStaffSeatMap(): void {
    if (!this.staffData.flightId) {
      this.showMessage('Select the flight workspace before clearing the seat map.');
      return;
    }

    this.runRequest('Clearing seat map', 'DELETE', `/seats/flight/${this.staffData.flightId}`, undefined, undefined, true, () => {
      this.staffSeats = [];
      this.staffManifestRows = [];
      this.staffRevenueSummary = null;
      this.resetStaffSeatForm();
      this.persistWorkflowState();
      this.showMessage('Seat map cleared.');
    });
  }

  sendStaffFlightAlert(): void {
    if (!this.staffData.flightId) {
      this.showMessage('Select a flight before sending an alert.');
      return;
    }

    const recipientIds = Array.from(
      new Set(this.staffFlightBookings.map((booking: any) => booking?.userId).filter((userId) => !!userId))
    );

    if (!recipientIds.length) {
      this.showMessage('Booked passengers for this flight have not been loaded yet. Load the workspace first.');
      return;
    }

    const flight = this.getSelectedStaffFlight();
    const title = this.staffAlertForm.title.trim() || this.buildDefaultStaffAlertTitle(flight);
    const message = this.staffAlertForm.message.trim() || this.buildDefaultStaffAlertMessage(flight);

    this.runRequest(
      'Sending flight alert',
      'POST',
      '/notifications/send-bulk',
      {
        recipientIds,
        type: this.staffAlertForm.type,
        title,
        message,
        channel: this.staffAlertForm.channel,
        relatedBookingId: null
      },
      undefined,
      true,
      () => {
        this.showMessage('Flight alert sent successfully.');
        this.staffAlertForm = {
          ...this.staffAlertForm,
          title: '',
          message: ''
        };
        this.persistWorkflowState();
      }
    );
  }

  loadRevenueReport(showLoader = false): void {
    this.runRequest(
      'Loading revenue report',
      'GET',
      '/payments/revenue',
      undefined,
      this.adminRange,
      true,
      (response: any) => {
        this.adminRevenue = response;
        this.persistWorkflowState();
      },
      showLoader
    );
  }

  sendNotification(): void {
    const body = {
      ...this.notificationData,
      relatedBookingId: this.notificationData.relatedBookingId || null
    };

    this.runRequest('Sending notification', 'POST', '/notifications/send', body, undefined, true, () => {
      this.loadNotifications();
      this.showMessage('Notification sent successfully.');
    });
  }

  sendBookingConfirmationMail(): void {
    void this.sendBookingConfirmationMailInternal(false).catch((error) => {
      const backendMessage = this.extractErrorMessage(error);
      this.showMessage(backendMessage ? `Sending booking email failed: ${backendMessage}` : 'Sending booking email failed.');
    });
  }

  private async sendBookingConfirmationMailInternal(silent = true): Promise<void> {
    const booking = this.bookingResult ?? this.lookupResult;

    if (!booking?.bookingId || !this.currentUser?.userId) {
      this.showMessage('Load the booking data first.');
      return;
    }

    const attachments = this.buildBookingEmailAttachments();
    const body = {
      recipientId: this.currentUser.userId,
      relatedBookingId: booking.bookingId,
      recipientEmail: booking.contactEmail || this.bookingData.contactEmail,
      recipientPhone: booking.contactPhone || this.bookingData.contactPhone,
      pnrCode: booking.pnrCode,
      attachments
    };

    await this.requestAsync('POST', '/notifications/booking-confirmation', body, undefined, true);
    this.bookingConfirmationSentFor = booking.bookingId;
    this.persistWorkflowState();
    this.loadNotifications();

    if (!silent) {
      this.showMessage('Booking confirmation email sent successfully.');
    }
  }

  loadNotifications(): void {
    if (this.isAdmin) {
      this.loadAdminNotificationsFeed();
      return;
    }

    const recipientId = this.currentUser?.userId ?? this.notificationData.recipientId;

    if (!recipientId) {
      return;
    }

    this.notificationData.recipientId = recipientId;

    this.runRequest(
      'Loading notifications',
      'GET',
      `/notifications/recipient/${recipientId}`,
      undefined,
      undefined,
      true,
      (response: any) => {
        this.notifications = Array.isArray(response) ? response : [];
        this.persistWorkflowState();
      },
      false
    );

    this.runRequest(
      'Loading unread count',
      'GET',
      `/notifications/recipient/${recipientId}/unread-count`,
      undefined,
      undefined,
      true,
      (response: any) => {
        this.unreadCount = Number(response ?? 0);
        this.persistWorkflowState();
      },
      false
    );
  }

  isStepOpen(step: number): boolean {
    if (step === 1) {
      return true;
    }

    if (!this.loggedIn) {
      return false;
    }

    return step <= this.currentStep;
  }

  private consumeFlightSearchResponse(response: any): void {
    this.returnFlightResults = [];

    if (Array.isArray(response)) {
      this.flightResults = response;
      return;
    }

    const outbound = response?.outboundFlights ?? response?.departureFlights ?? response?.flights ?? [];
    const inbound = response?.returnFlights ?? response?.inboundFlights ?? [];

    this.flightResults = Array.isArray(outbound) ? outbound : [];
    this.returnFlightResults = Array.isArray(inbound) ? inbound : [];
  }

  private loadFlightById(flightId: string, affectSelection = true): void {
    this.runRequest('Loading flight details', 'GET', `/flights/${flightId}`, undefined, undefined, false, (response: any) => {
      if (affectSelection) {
        this.selectedFlight = response;
      } else if (!this.selectedFlight || this.selectedFlight.flightId !== response?.flightId) {
        this.selectedFlight = response;
      }
    });
  }

  private ensurePassengerForms(count: number): void {
    const safeCount = Math.max(1, Number(count) || 1);

    while (this.passengerForms.length < safeCount) {
      this.passengerForms.push(this.createPassengerDraft(this.passengerForms.length));
    }

    this.passengerForms = this.passengerForms.slice(0, safeCount);
    this.selectedSeats = this.selectedSeats.slice(0, safeCount);

    while (this.selectedSeats.length < safeCount) {
      this.selectedSeats.push(null);
    }

    if (this.activePassengerIndex >= safeCount) {
      this.activePassengerIndex = 0;
    }
  }

  private createPassengerDraft(index: number): any {
    return {
      title: index === 0 ? 'Ms' : 'Mr',
      firstName: '',
      lastName: '',
      dateOfBirth: '2000-01-10',
      gender: index === 0 ? 'FEMALE' : 'MALE',
      passportNumber: '',
      nationality: 'INDIAN',
      passportExpiry: '2032-12-31',
      passengerType: 'ADULT'
    };
  }

  private resolveAirportCode(value: string): string {
    const normalized = (value ?? '').trim();
    if (!normalized) {
      return '';
    }

    const lowered = normalized.toLowerCase();
    const matchedAirport = this.airports.find((airport) => {
      const iata = String(airport?.iataCode ?? '').trim().toLowerCase();
      const city = String(airport?.city ?? '').trim().toLowerCase();
      const name = String(airport?.name ?? '').trim().toLowerCase();
      return lowered === iata || lowered === city || lowered === name;
    });

    return String(matchedAirport?.iataCode ?? normalized).toUpperCase();
  }

  getAirportDisplayLabel(value: string): string {
    const normalized = (value ?? '').trim();
    if (!normalized) {
      return 'Not selected';
    }

    const lowered = normalized.toLowerCase();
    const matchedAirport = this.airports.find((airport) => {
      const iata = String(airport?.iataCode ?? '').trim().toLowerCase();
      const city = String(airport?.city ?? '').trim().toLowerCase();
      const name = String(airport?.name ?? '').trim().toLowerCase();
      return lowered === iata || lowered === city || lowered === name;
    });

    return String(matchedAirport?.city ?? normalized).trim();
  }

  getSeatFeatureSummary(seat: any): string {
    const features = [
      seat?.isWindow ? 'Window' : '',
      seat?.isAisle ? 'Aisle' : '',
      seat?.hasExtraLegroom ? 'Extra legroom' : ''
    ].filter((item) => !!item);

    return features.length ? features.join(' · ') : 'Standard seat';
  }

  private getSelectedStaffFlight(): any {
    return this.allFlights.find((flight) => flight?.flightId === this.staffData.flightId) ?? null;
  }

  private applyStaffAirlineDefaults(): void {
    const defaultAirlineId =
      this.staffData.airlineId ||
      this.currentUser?.airlineId ||
      this.staffAirlines[0]?.airlineId ||
      '';

    if (defaultAirlineId) {
      this.staffData.airlineId = defaultAirlineId;
      this.staffFlightForm.airlineId = this.staffFlightForm.airlineId || defaultAirlineId;
    }

    if (this.staffData.flightId && !this.visibleStaffFlights.some((flight) => flight?.flightId === this.staffData.flightId)) {
      this.staffData.flightId = '';
    }
  }

  private toDateTimeLocalValue(value: string): string {
    if (!value) {
      return '';
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return '';
    }

    const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 16);
  }

  private calculateDurationMinutes(departureTime: string, arrivalTime: string): number {
    const departure = new Date(departureTime).getTime();
    const arrival = new Date(arrivalTime).getTime();
    const diff = Math.round((arrival - departure) / 60000);

    if (!Number.isFinite(diff) || diff <= 0) {
      return 90;
    }

    return diff;
  }

  private buildStaffRevenueSummary(manifestRows: any[], bookings: any[], seats: any[]): any {
    const revenue = bookings.reduce((sum: number, booking: any) => sum + Number(booking?.totalFare ?? 0), 0);
    const totalSeats = Number(this.getSelectedStaffFlight()?.totalSeats ?? seats.length ?? 0);
    const occupiedSeats = manifestRows.length;
    const seatUtilisation = totalSeats ? (occupiedSeats / totalSeats) * 100 : 0;

    const fareClassBreakdown = manifestRows.reduce((acc: Record<string, { seats: number; revenue: number }>, row: any) => {
      const key = row?.seatClass || 'UNASSIGNED';
      if (!acc[key]) {
        acc[key] = { seats: 0, revenue: 0 };
      }

      acc[key].seats += 1;
      acc[key].revenue += Number(row?.allocatedFare ?? 0);
      return acc;
    }, {});

    return {
      bookingCount: bookings.length,
      passengerCount: manifestRows.length,
      revenue,
      totalSeats,
      occupiedSeats,
      seatUtilisation,
      seatUtilisationLabel: `${Math.round(seatUtilisation)}%`,
      fareClassBreakdown
    };
  }

  private buildDefaultStaffAlertTitle(flight: any): string {
    const prefix = this.staffAlertForm.type === 'GATE_CHANGE' ? 'Gate change' : 'Flight delay';
    return flight?.flightNumber ? `${prefix} for ${flight.flightNumber}` : prefix;
  }

  private buildDefaultStaffAlertMessage(flight: any): string {
    const route = flight
      ? `${this.getAirportDisplayLabel(flight.originAirportCode)} to ${this.getAirportDisplayLabel(flight.destinationAirportCode)}`
      : 'your route';

    if (this.staffAlertForm.type === 'GATE_CHANGE') {
      return `There is an updated gate instruction for ${route}. Please review the airport display and app notifications before boarding.`;
    }

    return `Your flight on ${route} is currently marked ${this.staffData.status}. Please check the latest timing updates inside SkyBooker before departure.`;
  }

  private getDepartureBucket(value: string): string {
    const hours = new Date(value).getHours();

    if (hours < 12) {
      return 'MORNING';
    }

    if (hours < 17) {
      return 'AFTERNOON';
    }

    if (hours < 21) {
      return 'EVENING';
    }

    return 'NIGHT';
  }

  private verifyRazorpayPayment(paymentId: string, paymentResponse: any): void {
    const body = {
      razorpayPaymentId: paymentResponse?.razorpay_payment_id ?? '',
      razorpayOrderId: paymentResponse?.razorpay_order_id ?? '',
      razorpaySignature: paymentResponse?.razorpay_signature ?? ''
    };

    this.runRequest(
      'Verifying Razorpay payment',
      'POST',
      `/payments/${paymentId}/verify`,
      body,
      undefined,
      true,
      (response: any) => {
        this.paymentResult = response ?? { ...this.paymentResult, status: 'PAID' };
        this.lookupPayment = this.paymentResult;
        this.paymentStatus = response?.status ?? 'PAID';
        this.currentStep = 6;
        this.persistWorkflowState();
        this.showMessage('Payment successful. The final confirmation page is ready.');
        const bookingId = response?.bookingId ?? this.getActiveBookingId();

        if (bookingId) {
          this.refreshBooking(bookingId);
          this.loadPassengersForBooking(bookingId);
        }

        void this.waitForBookingConfirmation(bookingId)
          .finally(() => {
            this.router.navigate(['/booking-success']);
          });
      }
    );
  }

  private loadRazorpayScript(): Promise<boolean> {
    if ((window as any).Razorpay) {
      return Promise.resolve(true);
    }

    if (this.razorpayScriptPromise) {
      return this.razorpayScriptPromise;
    }

    this.razorpayScriptPromise = new Promise<boolean>((resolve) => {
      const existingScript = window.document.querySelector('script[data-razorpay-checkout="true"]') as HTMLScriptElement | null;

      if (existingScript) {
        existingScript.addEventListener('load', () => resolve(true), { once: true });
        existingScript.addEventListener('error', () => resolve(false), { once: true });
        return;
      }

      const script = window.document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.dataset['razorpayCheckout'] = 'true';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      window.document.body.appendChild(script);
    });

    return this.razorpayScriptPromise;
  }

  private runRequest(
    label: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    path: string,
    body?: unknown,
    query?: Record<string, unknown>,
    requiresAuth = false,
    onSuccess?: (response: any) => void,
    showLoader = true
  ): void {
    if (showLoader) {
      this.loading = true;
      this.loadingLabel = label;
    }

    this.api.request(method, this.gatewayUrl, path, {
      authToken: requiresAuth ? this.accessToken : undefined,
      body,
      query
    }).subscribe({
      next: (response) => {
        this.latestResponse = response;
        if (showLoader) {
          this.loading = false;
          this.loadingLabel = '';
        }
        onSuccess?.(response);
      },
      error: (error: HttpErrorResponse) => {
        if (showLoader) {
          this.loading = false;
          this.loadingLabel = '';
        }
        this.latestResponse = {
          status: error.status,
          message: error.message,
          error: error.error
        };
        const backendMessage =
          error.error?.message ||
          error.error?.error ||
          (typeof error.error === 'string' ? error.error : '') ||
          error.message;
        const validationErrors = this.formatValidationErrors(error.error?.errors);
        this.showMessage(validationErrors || (backendMessage ? `${label} failed: ${backendMessage}` : `${label} failed.`));
      }
    });
  }

  private applyUserToForms(user: any): void {
    this.bookingData.userId = user.userId ?? '';
    this.bookingData.contactEmail = this.normalizeProfileValue(user.email) || '';
    this.bookingData.contactPhone = this.normalizePhoneValue(user.phone) || '';
    this.notificationData.recipientId = user.userId ?? '';
    this.profileData.fullName = this.normalizeProfileValue(user.fullName) || '';
    this.profileData.phone = this.normalizePhoneValue(user.phone) || '';
    this.profileData.passportNumber = this.normalizePassportValue(user.passportNumber) || '';
    this.profileData.nationality = this.normalizeProfileValue(user.nationality) || '';
  }

  private clearSession(): void {
    this.clearAutoRefreshTimers();
    this.loggedIn = false;
    this.currentStep = 1;
    this.accessToken = '';
    this.currentUser = null;
    this.profile = null;
    this.flightResults = [];
    this.returnFlightResults = [];
    this.hasSearchedFlights = false;
    this.selectedFlight = null;
    this.availableSeats = [];
    this.selectedSeats = [];
    this.fareSummary = null;
    this.bookingResult = null;
    this.bookingDetails = null;
    this.bookedPassengers = [];
    this.paymentResult = null;
    this.paymentStatus = '';
    this.notifications = [];
    this.userBookings = [];
    this.lookupResult = null;
    this.lookupPayment = null;
    this.unreadCount = 0;
    this.hasSearchedFlights = false;
    this.searchFeedback = '';
    this.receiptDocument = null;
    this.eticketDocument = null;
    this.boardingPassDocuments = {};
    this.successDocumentState = {
      receipt: 'idle',
      eticket: 'idle'
    };
    this.boardingPassState = {};
    this.passengerForms = [];
    this.staffFlights = [];
    this.staffFlightBookings = [];
    this.staffManifestRows = [];
    this.staffSeats = [];
    this.staffRevenueSummary = null;
    this.adminRevenue = null;
    this.adminUsers = [];
    this.adminBookings = [];
    this.adminPaymentsByBooking = {};
    this.adminNotificationsFeed = [];
    this.adminActivityLog = [];
    this.adminUserSearch = '';
    this.adminUserRoleFilter = '';
    this.adminBookingStatusFilter = '';
    this.staffData = {
      airlineId: '',
      flightId: '',
      status: 'DELAYED'
    };
    this.resetStaffFlightForm();
    this.resetStaffSeatForm();
    this.staffAlertForm = {
      type: 'FLIGHT_DELAY',
      channel: 'APP',
      title: '',
      message: ''
    };
    this.resetAdminAirlineForm();
    this.resetAdminAirportForm();
    this.ensurePassengerForms(1);
    this.refreshToken = '';
    sessionStorage.removeItem(this.storageKeys.accessToken);
    sessionStorage.removeItem(this.storageKeys.refreshToken);
    sessionStorage.removeItem(this.storageKeys.currentUser);
    sessionStorage.removeItem(this.storageKeys.workflow);
  }

  private ensureLoggedIn(fallbackRoute = '/auth'): boolean {
    if (this.loggedIn) {
      return true;
    }

    this.showMessage('Please log in first.');
    this.router.navigate([fallbackRoute]);
    return false;
  }

  private finalizeAuthSuccess(response: any, message: string): void {
    this.accessToken = response?.accessToken ?? this.accessToken;
    this.refreshToken = response?.refreshToken ?? this.refreshToken;
    this.currentUser = response;
    this.loggedIn = !!this.accessToken;
    this.currentStep = Math.max(this.currentStep, 2);
    this.loading = false;
    this.loadingLabel = '';

    if (this.accessToken) {
      sessionStorage.setItem(this.storageKeys.accessToken, this.accessToken);
    }

    if (this.refreshToken) {
      sessionStorage.setItem(this.storageKeys.refreshToken, this.refreshToken);
    }

    sessionStorage.setItem(this.storageKeys.currentUser, JSON.stringify(response));

    try {
      this.applyUserToForms(response);
      this.persistWorkflowState();
    } catch {
      // Auth redirect should still continue even if local workflow persistence fails.
    }

    this.showMessage(message);
    const role = String(response?.role ?? '').toUpperCase();
    if (role === 'ADMIN') {
      window.location.assign('/admin');
      return;
    }

    if (role === 'AIRLINE_STAFF') {
      window.location.assign('/staff');
      return;
    }

    window.location.assign('/search');
  }

  private syncProfileState(profile: any): void {
    const normalizedProfile = {
      ...(this.profile ?? {}),
      ...(profile ?? {}),
      fullName: this.normalizeProfileValue(profile?.fullName ?? this.currentUser?.fullName),
      email: this.normalizeProfileValue(profile?.email ?? this.currentUser?.email),
      phone: this.normalizePhoneValue(profile?.phone ?? this.currentUser?.phone),
      passportNumber: this.normalizePassportValue(profile?.passportNumber ?? this.currentUser?.passportNumber),
      nationality: this.normalizeProfileValue(profile?.nationality ?? this.currentUser?.nationality)
    };

    this.profile = normalizedProfile;
    this.profileData.fullName = normalizedProfile.fullName || '';
    this.profileData.phone = normalizedProfile.phone || '';
    this.profileData.passportNumber = normalizedProfile.passportNumber || '';
    this.profileData.nationality = normalizedProfile.nationality || '';

    this.currentUser = {
      ...(this.currentUser ?? {}),
      ...normalizedProfile,
      email: normalizedProfile.email
    };

    sessionStorage.setItem(this.storageKeys.currentUser, JSON.stringify(this.currentUser));
    this.applyUserToForms(this.currentUser);
  }

  loadAdminDashboard(showLoader = false): void {
    if (!this.isAdmin) {
      return;
    }

    this.loadReferenceData();
    this.loadAllFlights(showLoader);
    this.loadRevenueReport(showLoader);
    this.loadAdminUsers(showLoader);
    this.loadAdminBookings(showLoader);
    this.loadAdminNotificationsFeed(showLoader);
  }

  loadAdminUsers(showLoader = false): void {
    this.runRequest('Loading admin users', 'GET', '/auth/users', undefined, undefined, true, (response: any) => {
      this.adminUsers = (Array.isArray(response) ? response : []).map((user) => ({
        ...user,
        active: user?.isActive ?? user?.active ?? true
      }));
      this.persistWorkflowState();
    }, showLoader);
  }

  loadAdminBookings(showLoader = false): void {
    if (showLoader) {
      this.loading = true;
      this.loadingLabel = 'Loading admin bookings';
    }

    const statusRequests = this.bookingStatuses.map((status) =>
      this.requestAsync('GET', `/bookings/status/${status}`, undefined, undefined, true).catch(() => [])
    );

    void Promise.all(statusRequests)
      .then(async (responses) => {
        const merged = responses.flatMap((response) => (Array.isArray(response) ? response : []));
        const uniqueBookings = Array.from(
          new Map(merged.map((booking: any) => [booking?.bookingId, booking])).values()
        );

        this.adminBookings = uniqueBookings;

        const paymentEntries = await Promise.all(
          uniqueBookings.map(async (booking: any) => {
            const payment = await this.requestAsync('GET', `/payments/booking/${booking.bookingId}`, undefined, undefined, true)
              .catch(() => null);
            return [booking.bookingId, payment] as const;
          })
        );

        this.adminPaymentsByBooking = Object.fromEntries(paymentEntries);
        this.persistWorkflowState();
      })
      .catch((error) => {
        const backendMessage = this.extractErrorMessage(error);
        this.showMessage(backendMessage ? `Loading admin bookings failed: ${backendMessage}` : 'Loading admin bookings failed.');
      })
      .finally(() => {
        if (showLoader) {
          this.loading = false;
          this.loadingLabel = '';
        }
      });
  }

  loadAdminNotificationsFeed(showLoader = false): void {
    this.runRequest(
      'Loading admin notifications',
      'GET',
      '/notifications',
      undefined,
      undefined,
      true,
      (response: any) => {
        const uniqueNotifications = Array.from(
          new Map((Array.isArray(response) ? response : []).map((notification: any) => [notification?.notificationId, notification])).values()
        )
          .sort((left: any, right: any) => new Date(right?.createdAt ?? 0).getTime() - new Date(left?.createdAt ?? 0).getTime())
          .slice(0, 48);

        this.adminNotificationsFeed = uniqueNotifications;
        if (this.isAdmin) {
          this.unreadCount = uniqueNotifications.length;
        }
        this.persistWorkflowState();
      },
      showLoader
    );
  }

  toggleAdminUserActive(user: any, active: boolean): void {
    if (!user?.userId) {
      return;
    }

    this.runRequest('Updating user status', 'PUT', `/auth/users/${user.userId}/status`, { active }, undefined, true, () => {
      this.adminUsers = this.adminUsers.map((item) =>
        item?.userId === user.userId
          ? { ...item, active, isActive: active }
          : item
      );
      this.recordAdminAction(active ? 'User reactivated' : 'User suspended', user.email || user.fullName || user.userId);
      this.persistWorkflowState();
      this.loadAdminUsers(false);
    });
  }

  deleteAdminUser(user: any): void {
    if (!user?.userId) {
      return;
    }

    this.runRequest('Deleting user', 'DELETE', `/auth/users/${user.userId}`, undefined, undefined, true, () => {
      this.adminUsers = this.adminUsers.filter((item) => item?.userId !== user.userId);
      this.recordAdminAction('User deleted', user.email || user.fullName || user.userId);
      this.persistWorkflowState();
      this.loadAdminUsers(false);
    });
  }

  editAdminAirline(airline: any): void {
    this.adminAirlineForm = {
      airlineId: airline?.airlineId ?? '',
      name: airline?.name ?? '',
      iataCode: airline?.iataCode ?? '',
      icaoCode: airline?.icaoCode ?? '',
      logoUrl: airline?.logoUrl ?? '',
      country: airline?.country ?? '',
      contactEmail: airline?.contactEmail ?? '',
      contactPhone: airline?.contactPhone ?? ''
    };
  }

  resetAdminAirlineForm(): void {
    this.adminAirlineForm = {
      airlineId: '',
      name: '',
      iataCode: '',
      icaoCode: '',
      logoUrl: '',
      country: '',
      contactEmail: '',
      contactPhone: ''
    };
  }

  saveAdminAirline(): void {
    const body = {
      name: this.adminAirlineForm.name,
      iataCode: this.adminAirlineForm.iataCode,
      icaoCode: this.adminAirlineForm.icaoCode,
      logoUrl: this.adminAirlineForm.logoUrl || null,
      country: this.adminAirlineForm.country,
      contactEmail: this.adminAirlineForm.contactEmail || null,
      contactPhone: this.adminAirlineForm.contactPhone || null
    };

    const isEditing = !!this.adminAirlineForm.airlineId;
    const path = isEditing ? `/airlines/${this.adminAirlineForm.airlineId}` : '/airlines';
    const method: 'POST' | 'PUT' = isEditing ? 'PUT' : 'POST';

    this.runRequest(isEditing ? 'Updating airline' : 'Creating airline', method, path, body, undefined, true, () => {
      this.recordAdminAction(isEditing ? 'Airline updated' : 'Airline created', `${body.name} (${body.iataCode})`);
      this.resetAdminAirlineForm();
      this.loadReferenceData();
    });
  }

  deactivateAdminAirline(airline: any): void {
    if (!airline?.airlineId) {
      return;
    }

    this.runRequest('Deactivating airline', 'PUT', `/airlines/${airline.airlineId}/deactivate`, {}, undefined, true, () => {
      this.recordAdminAction('Airline deactivated', airline.name || airline.airlineId);
      this.loadReferenceData();
    });
  }

  activateAdminAirline(airline: any): void {
    if (!airline?.airlineId) {
      return;
    }

    this.runRequest('Reactivating airline', 'PUT', `/airlines/${airline.airlineId}/activate`, {}, undefined, true, () => {
      this.recordAdminAction('Airline reactivated', airline.name || airline.airlineId);
      this.loadReferenceData();
    });
  }

  editAdminAirport(airport: any): void {
    this.adminAirportForm = {
      airportId: airport?.airportId ?? '',
      name: airport?.name ?? '',
      iataCode: airport?.iataCode ?? '',
      icaoCode: airport?.icaoCode ?? '',
      city: airport?.city ?? '',
      country: airport?.country ?? '',
      timezone: airport?.timezone ?? '',
      latitude: airport?.latitude != null ? String(airport.latitude) : '',
      longitude: airport?.longitude != null ? String(airport.longitude) : ''
    };
  }

  resetAdminAirportForm(): void {
    this.adminAirportForm = {
      airportId: '',
      name: '',
      iataCode: '',
      icaoCode: '',
      city: '',
      country: '',
      timezone: '',
      latitude: '',
      longitude: ''
    };
  }

  saveAdminAirport(): void {
    const body = {
      name: this.adminAirportForm.name,
      iataCode: this.adminAirportForm.iataCode,
      icaoCode: this.adminAirportForm.icaoCode,
      city: this.adminAirportForm.city,
      country: this.adminAirportForm.country,
      timezone: this.adminAirportForm.timezone,
      latitude: Number(this.adminAirportForm.latitude || 0),
      longitude: Number(this.adminAirportForm.longitude || 0)
    };

    const isEditing = !!this.adminAirportForm.airportId;
    const path = isEditing ? `/airports/${this.adminAirportForm.airportId}` : '/airports';
    const method: 'POST' | 'PUT' = isEditing ? 'PUT' : 'POST';

    this.runRequest(isEditing ? 'Updating airport' : 'Creating airport', method, path, body, undefined, true, () => {
      this.recordAdminAction(isEditing ? 'Airport updated' : 'Airport created', `${body.city} (${body.iataCode})`);
      this.resetAdminAirportForm();
      this.loadReferenceData();
    });
  }

  cancelAdminBooking(booking: any): void {
    if (!booking?.bookingId) {
      return;
    }

    this.runRequest('Cancelling booking', 'PUT', `/bookings/${booking.bookingId}/cancel`, {}, undefined, true, () => {
      this.recordAdminAction('Booking cancelled', booking.pnrCode || booking.bookingId);
      this.loadAdminBookings(false);
    });
  }

  requestAdminRefundForBooking(booking: any): void {
    const payment = this.getAdminPaymentForBooking(booking?.bookingId);

    if (!payment?.paymentId) {
      this.showMessage('A payment record is required before requesting a refund.');
      return;
    }

    this.runRequest(
      'Requesting refund',
      'POST',
      '/payments/refund',
      {
        paymentId: payment.paymentId,
        refundAmount: Number(payment.amount ?? booking?.totalFare ?? 0)
      },
      undefined,
      true,
      (response: any) => {
        this.adminPaymentsByBooking[booking.bookingId] = response;
        this.recordAdminAction('Refund initiated', booking?.pnrCode || booking?.bookingId || payment.paymentId);
        this.persistWorkflowState();
      }
    );
  }

  sendAdminBroadcast(): void {
    const title = this.adminBroadcastData.title.trim();
    const message = this.adminBroadcastData.message.trim();

    if (!title || !message) {
      this.showMessage('Enter both a title and a message for the broadcast.');
      return;
    }

    const recipientIds = this.adminUsers
      .filter((user) => user?.active !== false)
      .filter((user) => this.adminBroadcastData.targetRole === 'ALL' || String(user?.role ?? '').toUpperCase() === this.adminBroadcastData.targetRole)
      .map((user) => user?.userId)
      .filter((userId) => !!userId);

    if (!recipientIds.length) {
      this.showMessage('No active users were found for this audience.');
      return;
    }

    const body = {
      recipientIds,
      type: this.adminBroadcastData.type,
      title,
      message,
      channel: this.adminBroadcastData.channel,
      relatedBookingId: null
    };

    this.runRequest('Sending admin broadcast', 'POST', '/notifications/send-bulk', body, undefined, true, () => {
      this.recordAdminAction('Broadcast sent', `${title} to ${this.adminBroadcastData.targetRole}`);
      this.adminBroadcastData = {
        targetRole: 'ALL',
        title: '',
        message: '',
        type: 'FLIGHT_DELAY',
        channel: 'APP'
      };
      this.loadAdminNotificationsFeed(false);
    });
  }

  getAdminPaymentForBooking(bookingId: string): any {
    return this.adminPaymentsByBooking[bookingId] ?? null;
  }

  getFlightRouteForBooking(booking: any): string {
    const flight = this.resolveFlightForBooking(booking);
    const origin = this.getAirportCityByCode(flight?.originAirportCode ?? booking?.originAirportCode ?? '');
    const destination = this.getAirportCityByCode(flight?.destinationAirportCode ?? booking?.destinationAirportCode ?? '');
    return `${origin} → ${destination}`;
  }

  getAirlineNameByFlight(booking: any): string {
    const flight = this.resolveFlightForBooking(booking);
    return this.getAirlineNameById(flight?.airlineId ?? booking?.airlineId ?? '');
  }

  private resolveFlightForBooking(booking: any): any {
    return this.allFlights.find((flight) => flight?.flightId === booking?.flightId) ?? null;
  }

  private getAirlineNameById(airlineId: string): string {
    return this.airlines.find((airline) => airline?.airlineId === airlineId)?.name ?? 'Unknown airline';
  }

  private getAirportCityByCode(code: string): string {
    const airport = this.airports.find((item) => String(item?.iataCode ?? '').toUpperCase() === String(code ?? '').toUpperCase());
    return airport?.city ?? String(code ?? 'Unknown').toUpperCase();
  }


  private sanitizeAdminActivityText(value: unknown): string {
    const raw = String(value ?? '')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/gi, ' ')
      .replace(/&amp;/gi, '&')
      .replace(/\s+/g, ' ')
      .trim();

    return raw || 'Platform event recorded.';
  }
  private buildTopEntries(counts: Record<string, number>, emptyLabel: string): Array<{ label: string; value: string }> {
    const entries = Object.entries(counts)
      .sort((left, right) => right[1] - left[1])
      .slice(0, 4)
      .map(([label, value]) => ({ label, value: `${value}` }));

    return entries.length ? entries : [{ label: emptyLabel, value: '0' }];
  }

  private recordAdminAction(title: string, detail: string): void {
    this.adminActivityLog = [
      { title, detail, at: new Date().toISOString() },
      ...this.adminActivityLog
    ].slice(0, 16);
    this.persistWorkflowState();
  }
  private normalizeProfileValue(value: unknown): string {
    if (value === null || value === undefined) {
      return '';
    }

    return String(value).trim();
  }

  private normalizeEmailValue(value: unknown): string {
    return this.normalizeProfileValue(value).toLowerCase();
  }

  private isValidEmail(value: unknown): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(this.normalizeEmailValue(value));
  }

  private formatValidationErrors(errors: unknown): string {
    if (!errors || typeof errors !== 'object') {
      return '';
    }

    const entries = Object.entries(errors as Record<string, unknown>)
      .filter(([, value]) => value !== undefined && value !== null && value !== '')
      .map(([field, value]) => `${field}: ${String(value)}`);

    return entries.length ? `Please fix ${entries.join(', ')}.` : '';
  }

  private normalizePassportValue(value: unknown): string {
    return this.normalizeProfileValue(value).toUpperCase();
  }

  private isValidPassportNumber(value: unknown): boolean {
    return /^[A-Z]\d{7}$/.test(this.normalizePassportValue(value));
  }

  private normalizePhoneValue(value: unknown): string {
    const normalized = this.normalizeProfileValue(value);
    if (!normalized || /^OAUTH-/i.test(normalized)) {
      return '';
    }

    return normalized;
  }

  private getActiveBookingId(): string {
    return this.bookingResult?.bookingId ?? this.bookingDetails?.bookingId ?? this.lookupResult?.bookingId ?? '';
  }

  getBoardingPassReady(passengerId: string): boolean {
    return !!this.boardingPassDocuments[passengerId];
  }

  getBoardingPassLabel(passenger: any): string {
    const passengerId = passenger?.passengerId ?? '';
    const firstName = passenger?.firstName || 'traveller';

    if (this.getBoardingPassReady(passengerId)) {
      return `Download boarding pass for ${firstName}`;
    }

    if (this.boardingPassState[passengerId] === 'failed') {
      return `Boarding pass unavailable for ${firstName}`;
    }

    return `Preparing boarding pass for ${firstName}...`;
  }

  private async hydrateBookingSuccessWorkspace(bookingId: string, showLoader = true): Promise<void> {
    this.loading = true;
    this.loadingLabel = 'Preparing your travel documents';
    this.successDocumentState = {
      receipt: 'loading',
      eticket: 'loading'
    };
    this.boardingPassState = {};

    try {
      const booking = await this.waitForBookingConfirmation(bookingId);
      this.bookingResult = booking;
      this.bookingDetails = booking;
      this.lookupResult = booking;

      const passengers = await this.requestAsync('GET', `/passengers/booking/${bookingId}`, undefined, undefined, true);
      this.bookedPassengers = Array.isArray(passengers) ? passengers : [];

      const payment = await this.requestAsync('GET', `/payments/booking/${bookingId}`, undefined, undefined, true);
      this.paymentResult = payment;
      this.lookupPayment = payment;
      this.paymentStatus = payment?.status ?? this.paymentStatus;
      this.refundData.paymentId = payment?.paymentId ?? this.refundData.paymentId;
      this.refundData.refundAmount = Number(payment?.amount ?? this.refundData.refundAmount);

      if (payment?.paymentId) {
        const receiptResult = await this.loadSuccessDocument(
          'GET',
          `/payments/receipt/${payment.paymentId}`,
          this.receiptDocument
        );
        this.receiptDocument = receiptResult;
        this.successDocumentState.receipt = receiptResult ? 'ready' : 'failed';
      } else {
        this.successDocumentState.receipt = this.receiptDocument ? 'ready' : 'failed';
      }

      const eticketResult = await this.loadSuccessDocument(
        'GET',
        `/bookings/${bookingId}/eticket`,
        this.eticketDocument
      );
      this.eticketDocument = eticketResult;
      this.successDocumentState.eticket = eticketResult ? 'ready' : 'failed';

      const boardingPassEntries = await Promise.all(
        this.bookedPassengers.map(async (passenger) => {
          this.boardingPassState[passenger.passengerId] = 'loading';

          const document = await this.loadSuccessDocument(
            'GET',
            `/bookings/${bookingId}/boarding-pass/${passenger.passengerId}`,
            this.boardingPassDocuments[passenger.passengerId]
          );

          this.boardingPassState[passenger.passengerId] = document ? 'ready' : 'failed';

          return [passenger.passengerId, document] as const;
        })
      );

      this.boardingPassDocuments = Object.fromEntries(boardingPassEntries);

      if (this.bookingConfirmationSentFor !== bookingId) {
        await this.sendBookingConfirmationMailInternal(true);
      }

      this.currentStep = 6;
      this.persistWorkflowState();
    } catch (error) {
      const backendMessage = this.extractErrorMessage(error);
      this.showMessage(backendMessage ? `Travel documents load failed: ${backendMessage}` : 'Travel documents load failed.');
    } finally {
      this.loading = false;
      this.loadingLabel = '';
    }
  }

  private async loadSuccessDocument(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    path: string,
    fallbackDocument: any = null
  ): Promise<any> {
    try {
      const document = await this.requestAsync(method, path, undefined, undefined, true);
      return document ?? fallbackDocument;
    } catch {
      return fallbackDocument;
    }
  }

  private buildBookingEmailAttachments(): Array<{ fileName: string; contentType: string; contentBase64: string }> {
    const attachments: Array<{ fileName: string; contentType: string; contentBase64: string }> = [];

    if (this.eticketDocument?.content) {
      attachments.push({
        fileName: this.eticketDocument.fileName || 'e-ticket.pdf',
        contentType: this.eticketDocument.contentType || 'application/pdf',
        contentBase64: this.eticketDocument.content
      });
    }

    if (this.receiptDocument?.content) {
      attachments.push({
        fileName: this.receiptDocument.fileName || 'receipt.pdf',
        contentType: this.receiptDocument.contentType || 'application/pdf',
        contentBase64: this.receiptDocument.content
      });
    }

    for (const passenger of this.bookedPassengers) {
      const document = this.boardingPassDocuments[passenger.passengerId];

      if (!document?.content) {
        continue;
      }

      attachments.push({
        fileName: document.fileName || `${passenger.firstName}-boarding-pass.pdf`,
        contentType: document.contentType || 'application/pdf',
        contentBase64: document.content
      });
    }

    return attachments;
  }

  private maybeEnterBookingSuccessFlow(): void {
    const bookingId = this.getActiveBookingId();
    const paymentState = String(this.paymentResult?.status ?? this.paymentStatus ?? '').toUpperCase();
    const bookingState = String(this.bookingDetails?.status ?? this.bookingResult?.status ?? '').toUpperCase();

    if (!bookingId || paymentState !== 'PAID' || bookingState !== 'CONFIRMED') {
      return;
    }

    this.currentStep = 6;
    this.persistWorkflowState();

    if (this.router.url !== '/booking-success') {
      this.router.navigate(['/booking-success']);
    }
  }

  private tryRecoverPaidPendingBooking(bookingId?: string): void {
    const activeBookingId = bookingId ?? this.getActiveBookingId();
    const paymentState = String(this.paymentResult?.status ?? this.paymentStatus ?? '').toUpperCase();
    const bookingState = String(this.bookingDetails?.status ?? this.bookingResult?.status ?? '').toUpperCase();

    if (!activeBookingId || paymentState !== 'PAID' || bookingState !== 'PENDING') {
      if (this.pendingBookingRecoveryId === activeBookingId) {
        this.pendingBookingRecoveryId = '';
      }
      return;
    }

    if (this.pendingBookingRecoveryId === activeBookingId) {
      return;
    }

    this.pendingBookingRecoveryId = activeBookingId;

    void this.requestAsync(
      'PUT',
      `/bookings/${activeBookingId}/status`,
      { status: 'CONFIRMED' },
      undefined,
      true
    )
      .then((response) => {
        this.bookingDetails = response;
        this.bookingResult = response;
        this.lookupResult = response;
        this.persistWorkflowState();
        this.maybeEnterBookingSuccessFlow();
      })
      .catch(() => {
        // If the backend cannot recover the booking yet, the next refresh attempt can retry.
      })
      .finally(() => {
        if (this.pendingBookingRecoveryId === activeBookingId) {
          this.pendingBookingRecoveryId = '';
        }
      });
  }

  private async waitForBookingConfirmation(bookingId: string, attempts = 6, delayMs = 1200): Promise<any> {
    if (!bookingId) {
      return this.bookingResult ?? this.bookingDetails ?? null;
    }

    let latestBooking: any = null;

    for (let attempt = 0; attempt < attempts; attempt += 1) {
      latestBooking = await this.requestAsync('GET', `/bookings/${bookingId}`, undefined, undefined, true);
      const status = String(latestBooking?.status ?? '').toUpperCase();

      if (status === 'CONFIRMED') {
        return latestBooking;
      }

      if (attempt < attempts - 1) {
        await new Promise((resolve) => window.setTimeout(resolve, delayMs));
      }
    }

    return latestBooking;
  }

  private restoreWorkflowState(): void {
    const workflow = this.readJson(this.storageKeys.workflow);

    if (!workflow) {
      return;
    }

    this.searchData = { ...this.searchData, ...(workflow.searchData ?? {}) };
    this.searchFilters = { ...this.searchFilters, ...(workflow.searchFilters ?? {}) };
    this.bookingData = { ...this.bookingData, ...(workflow.bookingData ?? {}) };
    this.notificationData = { ...this.notificationData, ...(workflow.notificationData ?? {}) };
    this.profileData = { ...this.profileData, ...(workflow.profileData ?? {}) };
    this.lookupData = { ...this.lookupData, ...(workflow.lookupData ?? {}) };
    this.refundData = { ...this.refundData, ...(workflow.refundData ?? {}) };
    this.staffData = { ...this.staffData, ...(workflow.staffData ?? {}) };
    this.staffFlightForm = { ...this.staffFlightForm, ...(workflow.staffFlightForm ?? {}) };
    this.staffSeatForm = { ...this.staffSeatForm, ...(workflow.staffSeatForm ?? {}) };
    this.staffAlertForm = { ...this.staffAlertForm, ...(workflow.staffAlertForm ?? {}) };
    this.adminRange = { ...this.adminRange, ...(workflow.adminRange ?? {}) };
    this.currentStep = workflow.currentStep ?? this.currentStep;
    this.activePassengerIndex = workflow.activePassengerIndex ?? this.activePassengerIndex;
    this.hasSearchedFlights = workflow.hasSearchedFlights ?? this.hasSearchedFlights;
    this.searchFeedback = workflow.searchFeedback ?? this.searchFeedback;
    this.flightResults = workflow.flightResults ?? [];
    this.returnFlightResults = workflow.returnFlightResults ?? [];
    this.selectedFlight = workflow.selectedFlight ?? null;
    this.availableSeats = workflow.availableSeats ?? [];
    this.selectedSeats = workflow.selectedSeats ?? [];
    this.fareSummary = workflow.fareSummary ?? null;
    this.bookingResult = workflow.bookingResult ?? null;
    this.bookingDetails = workflow.bookingDetails ?? null;
    this.bookedPassengers = workflow.bookedPassengers ?? [];
    this.paymentResult = workflow.paymentResult ?? null;
    this.paymentStatus = workflow.paymentStatus ?? '';
    this.bookingConfirmationSentFor = workflow.bookingConfirmationSentFor ?? '';
    this.lookupResult = workflow.lookupResult ?? null;
    this.lookupPayment = workflow.lookupPayment ?? null;
    this.receiptDocument = workflow.receiptDocument ?? null;
    this.eticketDocument = workflow.eticketDocument ?? null;
    this.boardingPassDocuments = workflow.boardingPassDocuments ?? {};
    this.successDocumentState = workflow.successDocumentState ?? this.successDocumentState;
    this.boardingPassState = workflow.boardingPassState ?? {};
    this.passengerForms = workflow.passengerForms ?? this.passengerForms;
    this.staffManifestRows = workflow.staffManifestRows ?? [];
    this.staffSeats = workflow.staffSeats ?? [];
    this.staffRevenueSummary = workflow.staffRevenueSummary ?? null;
  }

  private persistWorkflowState(): void {
    sessionStorage.setItem(
      this.storageKeys.workflow,
      JSON.stringify({
        currentStep: this.currentStep,
        activePassengerIndex: this.activePassengerIndex,
        searchData: this.searchData,
        searchFilters: this.searchFilters,
        hasSearchedFlights: this.hasSearchedFlights,
        searchFeedback: this.searchFeedback,
        bookingData: this.bookingData,
        passengerForms: this.passengerForms,
        flightResults: this.flightResults,
        returnFlightResults: this.returnFlightResults,
        selectedFlight: this.selectedFlight,
        availableSeats: this.availableSeats,
        selectedSeats: this.selectedSeats,
        fareSummary: this.fareSummary,
        bookingResult: this.bookingResult,
        bookingDetails: this.bookingDetails,
        bookedPassengers: this.bookedPassengers,
        paymentResult: this.paymentResult,
        paymentStatus: this.paymentStatus,
        bookingConfirmationSentFor: this.bookingConfirmationSentFor,
        notificationData: this.notificationData,
        profileData: this.profileData,
        lookupData: this.lookupData,
        lookupResult: this.lookupResult,
        lookupPayment: this.lookupPayment,
        refundData: this.refundData,
        receiptDocument: this.receiptDocument,
        eticketDocument: this.eticketDocument,
        boardingPassDocuments: this.boardingPassDocuments,
        successDocumentState: this.successDocumentState,
        boardingPassState: this.boardingPassState,
        staffData: this.staffData,
        staffFlightForm: this.staffFlightForm,
        staffSeatForm: this.staffSeatForm,
        staffAlertForm: this.staffAlertForm,
        staffManifestRows: this.staffManifestRows,
        staffSeats: this.staffSeats,
        staffRevenueSummary: this.staffRevenueSummary,
        adminRange: this.adminRange
      })
    );
  }

  private showMessage(text: string): void {
    this.message = text;
    window.clearTimeout((window as any).skybookerMessageTimer);
    (window as any).skybookerMessageTimer = window.setTimeout(() => {
      this.message = '';
    }, 3200);
  }

  private readJson(key: string): any | null {
    const value = sessionStorage.getItem(key);

    if (!value) {
      return null;
    }

    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  }

  private async requestAsync(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    path: string,
    body?: unknown,
    query?: Record<string, unknown>,
    requiresAuth = false
  ): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.api.request(method, this.gatewayUrl, path, {
          authToken: requiresAuth ? this.accessToken : undefined,
          body,
          query
        })
      );
      this.latestResponse = response;
      return response;
    } catch (error) {
      this.latestResponse = error;
      throw error;
    }
  }

  private extractErrorMessage(error: any): string {
    if (error instanceof HttpErrorResponse) {
      return (
        error.error?.message ||
        error.error?.error ||
        (typeof error.error === 'string' ? error.error : '') ||
        error.message
      );
    }

    return error?.message || '';
  }
}




























