/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from './api-client';
import { API_ENDPOINTS, DEFAULT_PAGINATION } from './constants';
import type {
  CreateTripDto,
  SearchTripsDto,
  CreateBookingDto,
  ModifyBookingDto,
  BookingReviewDto,
  SearchTripsResponse,
  SeatAvailabilityResponse,
  BookingsResponse,
  Booking,
  TicketResponse,
  PaginationParams,
  BookingStatus,
  ApiResponse,
} from './types';

export class BookingsService {
  // Trip Management
  async createTrip(data: CreateTripDto): Promise<ApiResponse<{ trip: any }>> {
    return apiClient.post<ApiResponse<{ trip: any }>>(
      API_ENDPOINTS.BOOKINGS.TRIPS,
      data
    );
  }

  async searchTrips(data: SearchTripsDto): Promise<SearchTripsResponse> {
    return apiClient.post<SearchTripsResponse>(
      API_ENDPOINTS.BOOKINGS.SEARCH,
      data
    );
  }

  async getTripSeatAvailability(tripId: string): Promise<SeatAvailabilityResponse> {
    return apiClient.get<SeatAvailabilityResponse>(
      API_ENDPOINTS.BOOKINGS.TRIP_SEATS(tripId)
    );
  }

  // Booking Management
  async createBooking(data: CreateBookingDto): Promise<ApiResponse<{ 
    booking: Booking; 
    bookingReference: string 
  }>> {
    return apiClient.post<ApiResponse<{ 
      booking: Booking; 
      bookingReference: string 
    }>>(
      API_ENDPOINTS.BOOKINGS.BASE,
      data
    );
  }

  async getBookings(
    params: PaginationParams & { status?: BookingStatus } = {}
  ): Promise<BookingsResponse> {
    const { page = DEFAULT_PAGINATION.PAGE, limit = DEFAULT_PAGINATION.LIMIT, status } = params;
    const queryParams: Record<string, string> = {
      page: page.toString(),
      limit: limit.toString(),
    };
    
    if (status) {
      queryParams.status = status;
    }

    return apiClient.get<BookingsResponse>(
      API_ENDPOINTS.BOOKINGS.BASE,
      queryParams
    );
  }

  async getBookingById(id: string): Promise<Booking> {
    return apiClient.get<Booking>(API_ENDPOINTS.BOOKINGS.BY_ID(id));
  }

  async cancelBooking(id: string, reason?: string): Promise<ApiResponse<{ booking: Booking }>> {
    return apiClient.patch<ApiResponse<{ booking: Booking }>>(
      API_ENDPOINTS.BOOKINGS.CANCEL(id),
      { reason }
    );
  }

  async modifyBooking(
    id: string, 
    data: ModifyBookingDto
  ): Promise<ApiResponse<{ 
    booking: Booking; 
    modificationReason?: string 
  }>> {
    return apiClient.patch<ApiResponse<{ 
      booking: Booking; 
      modificationReason?: string 
    }>>(
      API_ENDPOINTS.BOOKINGS.MODIFY(id),
      data
    );
  }

  async downloadTicket(id: string): Promise<TicketResponse> {
    return apiClient.get<TicketResponse>(API_ENDPOINTS.BOOKINGS.TICKET(id));
  }

  async getUserBookingHistory(
    userId: string,
    params: PaginationParams & { status?: BookingStatus } = {}
  ): Promise<BookingsResponse> {
    const { page = DEFAULT_PAGINATION.PAGE, limit = DEFAULT_PAGINATION.LIMIT, status } = params;
    const queryParams: Record<string, string> = {
      page: page.toString(),
      limit: limit.toString(),
    };
    
    if (status) {
      queryParams.status = status;
    }

    return apiClient.get<BookingsResponse>(
      API_ENDPOINTS.BOOKINGS.USER_HISTORY(userId),
      queryParams
    );
  }

  // Reviews
  async addBookingReview(
    bookingId: string, 
    data: BookingReviewDto
  ): Promise<ApiResponse<{ review: any }>> {
    return apiClient.post<ApiResponse<{ review: any }>>(
      `/bookings/${bookingId}/review`,
      data
    );
  }

  async getBookingReviews(
    entityType: 'trip' | 'bus' | 'route',
    entityId: string,
    params: PaginationParams = {}
  ): Promise<{ 
    reviews: any[]; 
    pagination: any 
  }> {
    const { page = DEFAULT_PAGINATION.PAGE, limit = DEFAULT_PAGINATION.LIMIT } = params;
    return apiClient.get<{ 
      reviews: any[]; 
      pagination: any 
    }>(
      `/bookings/reviews/${entityType}/${entityId}`,
      { page: page.toString(), limit: limit.toString() }
    );
  }

  // Route suggestions
  async getRouteSuggestions(query: string): Promise<{
    routes: any[];
    cities: string[];
    total: number;
  }> {
    return apiClient.get<{
      routes: any[];
      cities: string[];
      total: number;
    }>(
      '/bookings/route-suggestions',
      { q: query }
    );
  }
}

export const bookingsService = new BookingsService();