export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export interface EndpointDefinition {
  id: string;
  group: string;
  title: string;
  description: string;
  method: HttpMethod;
  path: string;
  requiresAuth?: boolean;
  pathParamsTemplate?: string;
  queryTemplate?: string;
  bodyTemplate?: string;
}

export const gatewayUrlDefault = 'http://localhost:9090';

export const roles = ['PASSENGER', 'AIRLINE_STAFF', 'ADMIN'];
export const bookingStatuses = ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'NO_SHOW'];
export const tripTypes = ['ONE_WAY', 'ROUND_TRIP'];
export const flightStatuses = ['ON_TIME', 'DELAYED', 'CANCELLED', 'DEPARTED', 'ARRIVED'];
export const genders = ['MALE', 'FEMALE', 'OTHER'];
export const passengerTypes = ['ADULT', 'CHILD', 'INFANT'];
export const paymentModes = ['CARD', 'UPI', 'NETBANKING', 'WALLET'];
export const paymentStatuses = ['PENDING', 'PAID', 'FAILED', 'REFUNDED'];
export const seatClasses = ['ECONOMY', 'BUSINESS', 'FIRST'];
export const notificationChannels = ['APP', 'EMAIL', 'SMS'];
export const notificationTypes = [
  'BOOKING_CONFIRMED',
  'FLIGHT_DELAY',
  'GATE_CHANGE',
  'CHECKIN_REMINDER',
  'BOARDING',
  'CANCELLATION'
];

export const studioEndpoints: EndpointDefinition[] = [
  {
    id: 'auth-register',
    group: 'Auth',
    title: 'Register user',
    description: 'Create a new user account.',
    method: 'POST',
    path: '/auth/register',
    bodyTemplate: `{
  "fullName": "Aarav Sharma",
  "email": "aarav@example.com",
  "password": "Test1234",
  "phone": "+919900112233",
  "passportNumber": "N1234567",
  "nationality": "Indian",
  "role": "PASSENGER"
}`
  },
  {
    id: 'auth-login',
    group: 'Auth',
    title: 'Login',
    description: 'Generate access and refresh tokens.',
    method: 'POST',
    path: '/auth/login',
    bodyTemplate: `{
  "email": "aarav@example.com",
  "password": "Test1234"
}`
  },
  {
    id: 'auth-logout',
    group: 'Auth',
    title: 'Logout',
    description: 'Invalidate the current session.',
    method: 'POST',
    path: '/auth/logout',
    requiresAuth: true
  },
  {
    id: 'auth-validate',
    group: 'Auth',
    title: 'Validate token',
    description: 'Validate the current access token.',
    method: 'POST',
    path: '/auth/validate',
    requiresAuth: true
  },
  {
    id: 'auth-refresh',
    group: 'Auth',
    title: 'Refresh token',
    description: 'Swap refresh token for a new access token.',
    method: 'POST',
    path: '/auth/refresh',
    bodyTemplate: `{
  "refreshToken": ""
}`
  },
  {
    id: 'auth-oauth-info',
    group: 'Auth',
    title: 'OAuth login info',
    description: 'Read Google OAuth2 login entry point.',
    method: 'GET',
    path: '/auth/oauth2/login-info'
  },
  {
    id: 'auth-profile-get',
    group: 'Auth',
    title: 'Get profile',
    description: 'Fetch the logged in user profile.',
    method: 'GET',
    path: '/auth/profile',
    requiresAuth: true
  },
  {
    id: 'auth-profile-update',
    group: 'Auth',
    title: 'Update profile',
    description: 'Update user profile data.',
    method: 'PUT',
    path: '/auth/profile',
    requiresAuth: true,
    bodyTemplate: `{
  "fullName": "Aarav Sharma",
  "phone": "+919900112233",
  "passportNumber": "N1234567",
  "nationality": "Indian"
}`
  },
  {
    id: 'auth-password',
    group: 'Auth',
    title: 'Change password',
    description: 'Update the password for the current user.',
    method: 'PUT',
    path: '/auth/password',
    requiresAuth: true,
    bodyTemplate: `{
  "currentPassword": "Test1234",
  "newPassword": "NewPass123"
}`
  },
  {
    id: 'auth-deactivate',
    group: 'Auth',
    title: 'Deactivate account',
    description: 'Disable the currently logged in account.',
    method: 'PUT',
    path: '/auth/deactivate',
    requiresAuth: true
  },
  {
    id: 'auth-users',
    group: 'Auth',
    title: 'List users',
    description: 'Admin listing of users, optionally by role.',
    method: 'GET',
    path: '/auth/users',
    requiresAuth: true,
    queryTemplate: `{
  "role": "ADMIN"
}`
  },
  {
    id: 'auth-user-by-id',
    group: 'Auth',
    title: 'Get user by id',
    description: 'Admin endpoint for a specific user.',
    method: 'GET',
    path: '/auth/users/{userId}',
    requiresAuth: true,
    pathParamsTemplate: `{
  "userId": ""
}`
  },
  {
    id: 'auth-user-status',
    group: 'Auth',
    title: 'Update user status',
    description: 'Suspend or reactivate a user.',
    method: 'PUT',
    path: '/auth/users/{userId}/status',
    requiresAuth: true,
    pathParamsTemplate: `{
  "userId": ""
}`,
    bodyTemplate: `{
  "active": true
}`
  },
  {
    id: 'auth-user-delete',
    group: 'Auth',
    title: 'Delete user',
    description: 'Delete a user permanently.',
    method: 'DELETE',
    path: '/auth/users/{userId}',
    requiresAuth: true,
    pathParamsTemplate: `{
  "userId": ""
}`
  },
  {
    id: 'airlines-create',
    group: 'Airlines',
    title: 'Create airline',
    description: 'Create a new airline profile.',
    method: 'POST',
    path: '/airlines',
    bodyTemplate: `{
  "name": "Sky Booker Air",
  "iataCode": "SB",
  "icaoCode": "SBK",
  "logoUrl": "https://images.unsplash.com/photo-1436491865332-7a61a109cc05",
  "country": "India",
  "contactEmail": "ops@skybooker.com",
  "contactPhone": "+91 22 4444 7777"
}`
  },
  {
    id: 'airlines-list',
    group: 'Airlines',
    title: 'List airlines',
    description: 'Fetch every airline.',
    method: 'GET',
    path: '/airlines'
  },
  {
    id: 'airlines-active',
    group: 'Airlines',
    title: 'List active airlines',
    description: 'Fetch only active airlines.',
    method: 'GET',
    path: '/airlines/active'
  },
  {
    id: 'airlines-by-id',
    group: 'Airlines',
    title: 'Get airline by id',
    description: 'Read airline details.',
    method: 'GET',
    path: '/airlines/{airlineId}',
    pathParamsTemplate: `{
  "airlineId": ""
}`
  },
  {
    id: 'airlines-by-iata',
    group: 'Airlines',
    title: 'Get airline by IATA',
    description: 'Read an airline by IATA code.',
    method: 'GET',
    path: '/airlines/iata/{iataCode}',
    pathParamsTemplate: `{
  "iataCode": "SB"
}`
  },
  {
    id: 'airlines-update',
    group: 'Airlines',
    title: 'Update airline',
    description: 'Update airline details.',
    method: 'PUT',
    path: '/airlines/{airlineId}',
    pathParamsTemplate: `{
  "airlineId": ""
}`,
    bodyTemplate: `{
  "name": "Sky Booker Air",
  "iataCode": "SB",
  "icaoCode": "SBK",
  "logoUrl": "https://images.unsplash.com/photo-1436491865332-7a61a109cc05",
  "country": "India",
  "contactEmail": "ops@skybooker.com",
  "contactPhone": "+91 22 4444 7777"
}`
  },
  {
    id: 'airlines-deactivate',
    group: 'Airlines',
    title: 'Deactivate airline',
    description: 'Mark the airline inactive.',
    method: 'PUT',
    path: '/airlines/{airlineId}/deactivate',
    pathParamsTemplate: `{
  "airlineId": ""
}`
  },
  {
    id: 'airports-create',
    group: 'Airports',
    title: 'Create airport',
    description: 'Create a new airport record.',
    method: 'POST',
    path: '/airports',
    bodyTemplate: `{
  "name": "Kempegowda International Airport",
  "iataCode": "BLR",
  "icaoCode": "VOBL",
  "city": "Bengaluru",
  "country": "India",
  "latitude": 13.1986,
  "longitude": 77.7066,
  "timezone": "Asia/Kolkata"
}`
  },
  {
    id: 'airports-list',
    group: 'Airports',
    title: 'List airports',
    description: 'Fetch all airports.',
    method: 'GET',
    path: '/airports'
  },
  {
    id: 'airports-by-id',
    group: 'Airports',
    title: 'Get airport by id',
    description: 'Read airport details.',
    method: 'GET',
    path: '/airports/{airportId}',
    pathParamsTemplate: `{
  "airportId": ""
}`
  },
  {
    id: 'airports-by-iata',
    group: 'Airports',
    title: 'Get airport by IATA',
    description: 'Read airport by code.',
    method: 'GET',
    path: '/airports/iata/{iataCode}',
    pathParamsTemplate: `{
  "iataCode": "BLR"
}`
  },
  {
    id: 'airports-by-city',
    group: 'Airports',
    title: 'Airports by city',
    description: 'Fetch airports in a city.',
    method: 'GET',
    path: '/airports/city/{city}',
    pathParamsTemplate: `{
  "city": "Bengaluru"
}`
  },
  {
    id: 'airports-by-country',
    group: 'Airports',
    title: 'Airports by country',
    description: 'Fetch airports by country.',
    method: 'GET',
    path: '/airports/country/{country}',
    pathParamsTemplate: `{
  "country": "India"
}`
  },
  {
    id: 'airports-search',
    group: 'Airports',
    title: 'Search airports',
    description: 'Search airports by keyword.',
    method: 'GET',
    path: '/airports/search',
    queryTemplate: `{
  "keyword": "Benga"
}`
  },
  {
    id: 'airports-update',
    group: 'Airports',
    title: 'Update airport',
    description: 'Update airport metadata.',
    method: 'PUT',
    path: '/airports/{airportId}',
    pathParamsTemplate: `{
  "airportId": ""
}`,
    bodyTemplate: `{
  "name": "Kempegowda International Airport",
  "iataCode": "BLR",
  "icaoCode": "VOBL",
  "city": "Bengaluru",
  "country": "India",
  "latitude": 13.1986,
  "longitude": 77.7066,
  "timezone": "Asia/Kolkata"
}`
  },
  {
    id: 'flights-create',
    group: 'Flights',
    title: 'Create flight',
    description: 'Create a scheduled flight.',
    method: 'POST',
    path: '/flights',
    bodyTemplate: `{
  "flightNumber": "SB101",
  "airlineId": "",
  "originAirportCode": "BLR",
  "destinationAirportCode": "DEL",
  "departureTime": "2026-06-15T08:30:00",
  "arrivalTime": "2026-06-15T11:20:00",
  "durationMinutes": 170,
  "aircraftType": "Airbus A320neo",
  "totalSeats": 180,
  "basePrice": 6499
}`
  },
  {
    id: 'flights-list',
    group: 'Flights',
    title: 'List flights',
    description: 'Fetch all flights.',
    method: 'GET',
    path: '/flights'
  },
  {
    id: 'flights-by-id',
    group: 'Flights',
    title: 'Get flight by id',
    description: 'Fetch one flight.',
    method: 'GET',
    path: '/flights/{flightId}',
    pathParamsTemplate: `{
  "flightId": ""
}`
  },
  {
    id: 'flights-by-number',
    group: 'Flights',
    title: 'Get flight by number',
    description: 'Fetch one flight by flight number.',
    method: 'GET',
    path: '/flights/number/{flightNumber}',
    pathParamsTemplate: `{
  "flightNumber": "SB101"
}`
  },
  {
    id: 'flights-by-airline',
    group: 'Flights',
    title: 'Flights by airline',
    description: 'Fetch flights for an airline.',
    method: 'GET',
    path: '/flights/airline/{airlineId}',
    pathParamsTemplate: `{
  "airlineId": ""
}`
  },
  {
    id: 'flights-search',
    group: 'Flights',
    title: 'Search one-way',
    description: 'Search one-way flights.',
    method: 'POST',
    path: '/flights/search',
    bodyTemplate: `{
  "originAirportCode": "BLR",
  "destinationAirportCode": "DEL",
  "departureDate": "2026-06-15",
  "passengers": 1
}`
  },
  {
    id: 'flights-search-round',
    group: 'Flights',
    title: 'Search round trip',
    description: 'Search round-trip flights.',
    method: 'POST',
    path: '/flights/search/round-trip',
    bodyTemplate: `{
  "originAirportCode": "BLR",
  "destinationAirportCode": "DEL",
  "departureDate": "2026-06-15",
  "returnDate": "2026-06-20",
  "passengers": 1
}`
  },
  {
    id: 'flights-update',
    group: 'Flights',
    title: 'Update flight',
    description: 'Update a flight.',
    method: 'PUT',
    path: '/flights/{flightId}',
    pathParamsTemplate: `{
  "flightId": ""
}`,
    bodyTemplate: `{
  "flightNumber": "SB101",
  "airlineId": "",
  "originAirportCode": "BLR",
  "destinationAirportCode": "DEL",
  "departureTime": "2026-06-15T08:30:00",
  "arrivalTime": "2026-06-15T11:20:00",
  "durationMinutes": 170,
  "aircraftType": "Airbus A320neo",
  "totalSeats": 180,
  "basePrice": 6499
}`
  },
  {
    id: 'flights-status',
    group: 'Flights',
    title: 'Update flight status',
    description: 'Change flight status.',
    method: 'PUT',
    path: '/flights/{flightId}/status',
    pathParamsTemplate: `{
  "flightId": ""
}`,
    bodyTemplate: `{
  "status": "DELAYED"
}`
  },
  {
    id: 'flights-decrement',
    group: 'Flights',
    title: 'Decrement seats',
    description: 'Reduce available seats.',
    method: 'PUT',
    path: '/flights/{flightId}/decrement-seats',
    pathParamsTemplate: `{
  "flightId": ""
}`,
    bodyTemplate: `{
  "count": 1
}`
  },
  {
    id: 'flights-increment',
    group: 'Flights',
    title: 'Increment seats',
    description: 'Increase available seats.',
    method: 'PUT',
    path: '/flights/{flightId}/increment-seats',
    pathParamsTemplate: `{
  "flightId": ""
}`,
    bodyTemplate: `{
  "count": 1
}`
  },
  {
    id: 'flights-delete',
    group: 'Flights',
    title: 'Delete flight',
    description: 'Delete a flight.',
    method: 'DELETE',
    path: '/flights/{flightId}',
    pathParamsTemplate: `{
  "flightId": ""
}`
  },
  {
    id: 'seats-add',
    group: 'Seats',
    title: 'Create seat',
    description: 'Create a single seat.',
    method: 'POST',
    path: '/seats',
    bodyTemplate: `{
  "flightId": "",
  "seatNumber": "12A",
  "seatClass": "ECONOMY",
  "rowNumber": 12,
  "seatColumn": "A",
  "isWindow": true,
  "isAisle": false,
  "hasExtraLegroom": false,
  "priceMultiplier": 1.1
}`
  },
  {
    id: 'seats-bulk',
    group: 'Seats',
    title: 'Bulk seats',
    description: 'Create many seats for a flight.',
    method: 'POST',
    path: '/seats/bulk',
    bodyTemplate: `[
  {
    "flightId": "",
    "seatNumber": "12A",
    "seatClass": "ECONOMY",
    "rowNumber": 12,
    "seatColumn": "A",
    "isWindow": true,
    "isAisle": false,
    "hasExtraLegroom": false,
    "priceMultiplier": 1.1
  }
]`
  },
  {
    id: 'seats-by-flight',
    group: 'Seats',
    title: 'Seats by flight',
    description: 'Fetch all seats for a flight.',
    method: 'GET',
    path: '/seats/flight/{flightId}',
    pathParamsTemplate: `{
  "flightId": ""
}`
  },
  {
    id: 'seats-available',
    group: 'Seats',
    title: 'Available seats',
    description: 'Fetch only available seats.',
    method: 'GET',
    path: '/seats/flight/{flightId}/available',
    pathParamsTemplate: `{
  "flightId": ""
}`
  },
  {
    id: 'seats-by-class',
    group: 'Seats',
    title: 'Available by class',
    description: 'Fetch seats by seat class.',
    method: 'GET',
    path: '/seats/flight/{flightId}/class/{seatClass}',
    pathParamsTemplate: `{
  "flightId": "",
  "seatClass": "ECONOMY"
}`
  },
  {
    id: 'seats-by-id',
    group: 'Seats',
    title: 'Get seat by id',
    description: 'Fetch seat details.',
    method: 'GET',
    path: '/seats/{seatId}',
    pathParamsTemplate: `{
  "seatId": ""
}`
  },
  {
    id: 'seats-map',
    group: 'Seats',
    title: 'Seat map',
    description: 'Fetch seat map for a flight.',
    method: 'GET',
    path: '/seats/flight/{flightId}/map',
    pathParamsTemplate: `{
  "flightId": ""
}`
  },
  {
    id: 'seats-hold',
    group: 'Seats',
    title: 'Hold seat',
    description: 'Hold a seat for 15 minutes.',
    method: 'PUT',
    path: '/seats/{seatId}/hold',
    pathParamsTemplate: `{
  "seatId": ""
}`
  },
  {
    id: 'seats-release',
    group: 'Seats',
    title: 'Release seat',
    description: 'Release a held seat.',
    method: 'PUT',
    path: '/seats/{seatId}/release',
    pathParamsTemplate: `{
  "seatId": ""
}`
  },
  {
    id: 'seats-confirm',
    group: 'Seats',
    title: 'Confirm seat',
    description: 'Confirm a held seat.',
    method: 'PUT',
    path: '/seats/{seatId}/confirm',
    pathParamsTemplate: `{
  "seatId": ""
}`
  },
  {
    id: 'seats-update',
    group: 'Seats',
    title: 'Update seat',
    description: 'Update seat details.',
    method: 'PUT',
    path: '/seats/{seatId}',
    pathParamsTemplate: `{
  "seatId": ""
}`,
    bodyTemplate: `{
  "flightId": "",
  "seatNumber": "12A",
  "seatClass": "ECONOMY",
  "rowNumber": 12,
  "seatColumn": "A",
  "isWindow": true,
  "isAisle": false,
  "hasExtraLegroom": false,
  "priceMultiplier": 1.1
}`
  },
  {
    id: 'seats-count',
    group: 'Seats',
    title: 'Seat count by class',
    description: 'Count available seats by class.',
    method: 'GET',
    path: '/seats/flight/{flightId}/count',
    pathParamsTemplate: `{
  "flightId": ""
}`
  },
  {
    id: 'seats-delete-flight',
    group: 'Seats',
    title: 'Delete seats by flight',
    description: 'Delete all seats for a flight.',
    method: 'DELETE',
    path: '/seats/flight/{flightId}',
    pathParamsTemplate: `{
  "flightId": ""
}`
  },
  {
    id: 'seats-release-expired',
    group: 'Seats',
    title: 'Release expired holds',
    description: 'Release expired held seats manually.',
    method: 'PUT',
    path: '/seats/release-expired'
  },
  {
    id: 'bookings-create',
    group: 'Bookings',
    title: 'Create booking',
    description: 'Create a booking for a flight.',
    method: 'POST',
    path: '/bookings',
    bodyTemplate: `{
  "userId": "",
  "flightId": "",
  "tripType": "ONE_WAY",
  "passengerCount": 1,
  "baseFarePerPassenger": 6499,
  "mealPreference": "Veg",
  "luggageKg": 15,
  "contactEmail": "aarav@example.com",
  "contactPhone": "+919900112233"
}`
  },
  {
    id: 'bookings-by-id',
    group: 'Bookings',
    title: 'Get booking by id',
    description: 'Fetch booking details.',
    method: 'GET',
    path: '/bookings/{bookingId}',
    pathParamsTemplate: `{
  "bookingId": ""
}`
  },
  {
    id: 'bookings-by-pnr',
    group: 'Bookings',
    title: 'Get booking by PNR',
    description: 'Read booking by PNR code.',
    method: 'GET',
    path: '/bookings/pnr/{pnrCode}',
    pathParamsTemplate: `{
  "pnrCode": ""
}`
  },
  {
    id: 'bookings-by-user',
    group: 'Bookings',
    title: 'Bookings by user',
    description: 'Fetch all bookings for a user.',
    method: 'GET',
    path: '/bookings/user/{userId}',
    pathParamsTemplate: `{
  "userId": ""
}`
  },
  {
    id: 'bookings-by-flight',
    group: 'Bookings',
    title: 'Bookings by flight',
    description: 'Fetch bookings for a flight.',
    method: 'GET',
    path: '/bookings/flight/{flightId}',
    pathParamsTemplate: `{
  "flightId": ""
}`
  },
  {
    id: 'bookings-upcoming',
    group: 'Bookings',
    title: 'Upcoming bookings',
    description: 'Fetch upcoming bookings for a user.',
    method: 'GET',
    path: '/bookings/user/{userId}/upcoming',
    pathParamsTemplate: `{
  "userId": ""
}`
  },
  {
    id: 'bookings-cancel',
    group: 'Bookings',
    title: 'Cancel booking',
    description: 'Cancel a booking.',
    method: 'PUT',
    path: '/bookings/{bookingId}/cancel',
    pathParamsTemplate: `{
  "bookingId": ""
}`
  },
  {
    id: 'bookings-status',
    group: 'Bookings',
    title: 'Update booking status',
    description: 'Change a booking status.',
    method: 'PUT',
    path: '/bookings/{bookingId}/status',
    pathParamsTemplate: `{
  "bookingId": ""
}`,
    bodyTemplate: `{
  "status": "CONFIRMED"
}`
  },
  {
    id: 'bookings-fare',
    group: 'Bookings',
    title: 'Calculate fare',
    description: 'Calculate fare for the selected inputs.',
    method: 'GET',
    path: '/bookings/calculate-fare',
    queryTemplate: `{
  "baseFarePerPassenger": 6499,
  "passengerCount": 1,
  "luggageKg": 15
}`
  },
  {
    id: 'bookings-addons',
    group: 'Bookings',
    title: 'Add booking add-ons',
    description: 'Add meal and luggage data to a booking.',
    method: 'POST',
    path: '/bookings/{bookingId}/addons',
    pathParamsTemplate: `{
  "bookingId": ""
}`,
    bodyTemplate: `{
  "mealPreference": "Veg",
  "luggageKg": 20
}`
  },
  {
    id: 'bookings-by-status',
    group: 'Bookings',
    title: 'Bookings by status',
    description: 'Fetch bookings matching a status.',
    method: 'GET',
    path: '/bookings/status/{status}',
    pathParamsTemplate: `{
  "status": "CONFIRMED"
}`
  },
  {
    id: 'passengers-add',
    group: 'Passengers',
    title: 'Create passenger',
    description: 'Add a passenger to a booking.',
    method: 'POST',
    path: '/passengers',
    bodyTemplate: `{
  "bookingId": "",
  "title": "Mr",
  "firstName": "Aarav",
  "lastName": "Sharma",
  "dateOfBirth": "1997-02-14",
  "gender": "MALE",
  "passportNumber": "N1234567",
  "nationality": "Indian",
  "passportExpiry": "2031-07-31",
  "passengerType": "ADULT"
}`
  },
  {
    id: 'passengers-by-id',
    group: 'Passengers',
    title: 'Get passenger by id',
    description: 'Fetch passenger details.',
    method: 'GET',
    path: '/passengers/{passengerId}',
    pathParamsTemplate: `{
  "passengerId": ""
}`
  },
  {
    id: 'passengers-by-booking',
    group: 'Passengers',
    title: 'Passengers by booking',
    description: 'Fetch all passengers for a booking.',
    method: 'GET',
    path: '/passengers/booking/{bookingId}',
    pathParamsTemplate: `{
  "bookingId": ""
}`
  },
  {
    id: 'passengers-by-passport',
    group: 'Passengers',
    title: 'Passenger by passport',
    description: 'Fetch passenger by passport number.',
    method: 'GET',
    path: '/passengers/passport/{passportNumber}',
    pathParamsTemplate: `{
  "passportNumber": "N1234567"
}`
  },
  {
    id: 'passengers-update',
    group: 'Passengers',
    title: 'Update passenger',
    description: 'Update passenger details.',
    method: 'PUT',
    path: '/passengers/{passengerId}',
    pathParamsTemplate: `{
  "passengerId": ""
}`,
    bodyTemplate: `{
  "bookingId": "",
  "title": "Mr",
  "firstName": "Aarav",
  "lastName": "Sharma",
  "dateOfBirth": "1997-02-14",
  "gender": "MALE",
  "passportNumber": "N1234567",
  "nationality": "Indian",
  "passportExpiry": "2031-07-31",
  "passengerType": "ADULT"
}`
  },
  {
    id: 'passengers-assign-seat',
    group: 'Passengers',
    title: 'Assign seat',
    description: 'Assign a seat to a passenger.',
    method: 'PUT',
    path: '/passengers/{passengerId}/assign-seat',
    pathParamsTemplate: `{
  "passengerId": ""
}`,
    bodyTemplate: `{
  "seatId": "",
  "seatNumber": "12A"
}`
  },
  {
    id: 'passengers-delete',
    group: 'Passengers',
    title: 'Delete passenger',
    description: 'Delete a passenger.',
    method: 'DELETE',
    path: '/passengers/{passengerId}',
    pathParamsTemplate: `{
  "passengerId": ""
}`
  },
  {
    id: 'passengers-delete-booking',
    group: 'Passengers',
    title: 'Delete passengers by booking',
    description: 'Delete passengers linked to a booking.',
    method: 'DELETE',
    path: '/passengers/booking/{bookingId}',
    pathParamsTemplate: `{
  "bookingId": ""
}`
  },
  {
    id: 'passengers-count',
    group: 'Passengers',
    title: 'Passenger count',
    description: 'Fetch passenger count for a booking.',
    method: 'GET',
    path: '/passengers/booking/{bookingId}/count',
    pathParamsTemplate: `{
  "bookingId": ""
}`
  },
  {
    id: 'payments-initiate',
    group: 'Payments',
    title: 'Initiate payment',
    description: 'Create payment and return payment session info.',
    method: 'POST',
    path: '/payments/initiate',
    bodyTemplate: `{
  "bookingId": "",
  "userId": "",
  "amount": 6499,
  "paymentMode": "UPI"
}`
  },
  {
    id: 'payments-process',
    group: 'Payments',
    title: 'Process payment',
    description: 'Process payment after callback.',
    method: 'POST',
    path: '/payments/{paymentId}/process',
    pathParamsTemplate: `{
  "paymentId": ""
}`,
    bodyTemplate: `{
  "gatewayTransactionId": "TXN-1001",
  "gatewayResponse": "SUCCESS"
}`
  },
  {
    id: 'payments-webhook',
    group: 'Payments',
    title: 'Webhook callback',
    description: 'Trigger webhook payment processing.',
    method: 'POST',
    path: '/payments/webhook/{paymentId}',
    pathParamsTemplate: `{
  "paymentId": ""
}`,
    bodyTemplate: `{
  "gatewayTransactionId": "TXN-1001",
  "gatewayResponse": "SUCCESS"
}`
  },
  {
    id: 'payments-refund',
    group: 'Payments',
    title: 'Refund payment',
    description: 'Create a refund.',
    method: 'POST',
    path: '/payments/refund',
    bodyTemplate: `{
  "paymentId": "",
  "refundAmount": 6499
}`
  },
  {
    id: 'payments-by-booking',
    group: 'Payments',
    title: 'Payment by booking',
    description: 'Fetch payment linked to a booking.',
    method: 'GET',
    path: '/payments/booking/{bookingId}',
    pathParamsTemplate: `{
  "bookingId": ""
}`
  },
  {
    id: 'payments-by-user',
    group: 'Payments',
    title: 'Payments by user',
    description: 'Fetch user payments.',
    method: 'GET',
    path: '/payments/user/{userId}',
    pathParamsTemplate: `{
  "userId": ""
}`
  },
  {
    id: 'payments-status',
    group: 'Payments',
    title: 'Get payment status',
    description: 'Fetch payment status.',
    method: 'GET',
    path: '/payments/{paymentId}/status',
    pathParamsTemplate: `{
  "paymentId": ""
}`
  },
  {
    id: 'payments-update-status',
    group: 'Payments',
    title: 'Update payment status',
    description: 'Update payment status manually.',
    method: 'PUT',
    path: '/payments/{paymentId}/status',
    pathParamsTemplate: `{
  "paymentId": ""
}`,
    bodyTemplate: `{
  "status": "PAID"
}`
  },
  {
    id: 'payments-receipt',
    group: 'Payments',
    title: 'Generate receipt',
    description: 'Fetch receipt payload.',
    method: 'GET',
    path: '/payments/receipt/{paymentId}',
    pathParamsTemplate: `{
  "paymentId": ""
}`
  },
  {
    id: 'payments-revenue',
    group: 'Payments',
    title: 'Revenue report',
    description: 'Fetch revenue between dates.',
    method: 'GET',
    path: '/payments/revenue',
    queryTemplate: `{
  "from": "2026-01-01T00:00:00",
  "to": "2026-12-31T23:59:59"
}`
  },
  {
    id: 'notifications-send',
    group: 'Notifications',
    title: 'Send notification',
    description: 'Send a single notification.',
    method: 'POST',
    path: '/notifications/send',
    bodyTemplate: `{
  "recipientId": "",
  "type": "BOOKING_CONFIRMED",
  "title": "Booking confirmed",
  "message": "Your ticket has been generated.",
  "channel": "EMAIL",
  "relatedBookingId": null
}`
  },
  {
    id: 'notifications-booking',
    group: 'Notifications',
    title: 'Booking confirmation',
    description: 'Send booking confirmation via app, email and SMS.',
    method: 'POST',
    path: '/notifications/booking-confirmation',
    bodyTemplate: `{
  "recipientId": "",
  "relatedBookingId": "",
  "recipientEmail": "aarav@example.com",
  "recipientPhone": "+919900112233",
  "pnrCode": "SBK123",
  "eticketPdfBase64": "c2FtcGxlLXBkZi1jb250ZW50"
}`
  },
  {
    id: 'notifications-bulk',
    group: 'Notifications',
    title: 'Bulk notification',
    description: 'Send a bulk notification.',
    method: 'POST',
    path: '/notifications/send-bulk',
    bodyTemplate: `{
  "recipientIds": [],
  "type": "FLIGHT_DELAY",
  "title": "Flight delayed",
  "message": "Please review the latest schedule.",
  "channel": "APP",
  "relatedBookingId": null
}`
  },
  {
    id: 'notifications-recipient',
    group: 'Notifications',
    title: 'Notifications by recipient',
    description: 'Fetch notifications for a recipient.',
    method: 'GET',
    path: '/notifications/recipient/{recipientId}',
    pathParamsTemplate: `{
  "recipientId": ""
}`
  },
  {
    id: 'notifications-list',
    group: 'Notifications',
    title: 'List notifications',
    description: 'Fetch every notification.',
    method: 'GET',
    path: '/notifications'
  },
  {
    id: 'notifications-type',
    group: 'Notifications',
    title: 'Notifications by type',
    description: 'Fetch notifications by type.',
    method: 'GET',
    path: '/notifications/type/{type}',
    pathParamsTemplate: `{
  "type": "BOARDING"
}`
  },
  {
    id: 'notifications-read',
    group: 'Notifications',
    title: 'Mark as read',
    description: 'Mark one notification as read.',
    method: 'PUT',
    path: '/notifications/{notificationId}/read',
    pathParamsTemplate: `{
  "notificationId": ""
}`
  },
  {
    id: 'notifications-read-all',
    group: 'Notifications',
    title: 'Mark all read',
    description: 'Mark all notifications as read.',
    method: 'PUT',
    path: '/notifications/recipient/{recipientId}/read-all',
    pathParamsTemplate: `{
  "recipientId": ""
}`
  },
  {
    id: 'notifications-unread',
    group: 'Notifications',
    title: 'Unread count',
    description: 'Fetch unread notification count.',
    method: 'GET',
    path: '/notifications/recipient/{recipientId}/unread-count',
    pathParamsTemplate: `{
  "recipientId": ""
}`
  },
  {
    id: 'notifications-delete',
    group: 'Notifications',
    title: 'Delete notification',
    description: 'Delete a notification.',
    method: 'DELETE',
    path: '/notifications/{notificationId}',
    pathParamsTemplate: `{
  "notificationId": ""
}`
  }
];
