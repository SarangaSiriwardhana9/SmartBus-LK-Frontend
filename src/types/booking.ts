// src/types/booking.ts
export interface Trip {
  _id: string
  busRouteId: string
  tripDate: string
  tripStatus: 'scheduled' | 'in-progress' | 'completed' | 'cancelled'
  actualDeparture?: string
  actualArrival?: string
  currentLocation?: {
    coordinates: [number, number]
    lastUpdated: string
    speed: number
    nextStop: string
  }
  seatAvailability: SeatAvailability[]
  tripMetrics?: {
    totalRevenue: number
    totalPassengers: number
    occupancyRate: number
    onTimePerformance: boolean
  }
  createdAt: string
  updatedAt: string
}

export interface SeatAvailability {
  seatNumber: string
  isBooked: boolean
  bookingId?: string
}

export interface Booking {
  _id: string
  bookingReference: string
  passengerId: string
  tripId: string
  seatDetails: PassengerDetail[]
  journeyDetails: {
    boardingPoint: string
    droppingPoint: string
    journeyDate: string
    journeyTime: string
  }
  pricing: {
    baseFare: number
    taxes: number
    discount: number
    totalAmount: number
  }
  paymentDetails: {
    paymentMethod: string
    paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded'
    transactionId: string
    paidAt?: string
  }
  status: 'confirmed' | 'cancelled' | 'completed' | 'no-show'
  createdAt: string
  updatedAt: string
}

export interface PassengerDetail {
  seatNumber: string
  passengerName: string
  passengerAge: number
  passengerGender: 'male' | 'female' | 'other'
  passengerIdType?: string
  passengerIdNumber?: string
}

export interface BookingReview {
  overallRating: number
  reviewText: string
  busConditionRating: number
  driverBehaviorRating: number
  punctualityRating: number
  comfortRating: number
  valueForMoneyRating: number
}