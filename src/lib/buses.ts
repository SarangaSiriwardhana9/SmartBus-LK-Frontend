/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from './api-client';
import { API_ENDPOINTS, DEFAULT_PAGINATION } from './constants';
import type {
  CreateBusOwnerProfileDto,
  BusOwnerProfile,
  CreateBusDto,
  UpdateBusDto,
  Bus,
  BusesResponse,
  SeatMapResponse,
  SeatConfiguration,
  PaginationParams,
  BusStatus,
  ApiResponse,
} from './types';

export class BusesService {
  // Bus Owner Profile Management
  async createBusOwnerProfile(data: CreateBusOwnerProfileDto): Promise<ApiResponse<{ profile: BusOwnerProfile }>> {
    return apiClient.post<ApiResponse<{ profile: BusOwnerProfile }>>(
      API_ENDPOINTS.BUSES.OWNER_PROFILE,
      data
    );
  }

  async getBusOwnerProfile(): Promise<BusOwnerProfile> {
    return apiClient.get<BusOwnerProfile>(API_ENDPOINTS.BUSES.OWNER_PROFILE);
  }

  async approveBusOwnerProfile(profileId: string): Promise<ApiResponse<{ profile: BusOwnerProfile }>> {
    return apiClient.patch<ApiResponse<{ profile: BusOwnerProfile }>>(
      API_ENDPOINTS.BUSES.APPROVE_OWNER_PROFILE(profileId)
    );
  }

  async rejectBusOwnerProfile(
    profileId: string, 
    reason: string
  ): Promise<ApiResponse<{ profile: BusOwnerProfile }>> {
    return apiClient.patch<ApiResponse<{ profile: BusOwnerProfile }>>(
      API_ENDPOINTS.BUSES.REJECT_OWNER_PROFILE(profileId),
      { reason }
    );
  }

  // Bus Management
  async createBus(data: CreateBusDto): Promise<ApiResponse<{ bus: Bus }>> {
    return apiClient.post<ApiResponse<{ bus: Bus }>>(
      API_ENDPOINTS.BUSES.BASE,
      data
    );
  }

  async getBuses(
    params: PaginationParams & { status?: BusStatus } = {}
  ): Promise<BusesResponse> {
    const { page = DEFAULT_PAGINATION.PAGE, limit = DEFAULT_PAGINATION.LIMIT, status } = params;
    const queryParams: Record<string, string> = {
      page: page.toString(),
      limit: limit.toString(),
    };
    
    if (status) {
      queryParams.status = status;
    }

    return apiClient.get<BusesResponse>(API_ENDPOINTS.BUSES.BASE, queryParams);
  }

  async getBusById(id: string): Promise<Bus> {
    return apiClient.get<Bus>(API_ENDPOINTS.BUSES.BY_ID(id));
  }

  async updateBus(id: string, data: UpdateBusDto): Promise<ApiResponse<{ bus: Bus }>> {
    return apiClient.patch<ApiResponse<{ bus: Bus }>>(
      API_ENDPOINTS.BUSES.BY_ID(id),
      data
    );
  }

  async deleteBus(id: string): Promise<ApiResponse> {
    return apiClient.delete<ApiResponse>(API_ENDPOINTS.BUSES.BY_ID(id));
  }

  // Seat Configuration
  async updateSeatConfiguration(
    busId: string, 
    seatConfiguration: SeatConfiguration
  ): Promise<ApiResponse<{ seatConfiguration: SeatConfiguration }>> {
    return apiClient.patch<ApiResponse<{ seatConfiguration: SeatConfiguration }>>(
      API_ENDPOINTS.BUSES.SEAT_CONFIGURATION(busId),
      seatConfiguration
    );
  }

  async getSeatMap(busId: string): Promise<SeatMapResponse> {
    return apiClient.get<SeatMapResponse>(API_ENDPOINTS.BUSES.SEAT_MAP(busId));
  }

  // Bus Approval (Admin only)
  async approveBus(id: string): Promise<ApiResponse<{ bus: Bus }>> {
    return apiClient.patch<ApiResponse<{ bus: Bus }>>(
      API_ENDPOINTS.BUSES.APPROVE(id)
    );
  }

  async rejectBus(id: string, reason: string): Promise<ApiResponse<{ bus: Bus }>> {
    return apiClient.patch<ApiResponse<{ bus: Bus }>>(
      API_ENDPOINTS.BUSES.REJECT(id),
      { reason }
    );
  }

  // File Upload
  async uploadBusImages(busId: string, images: File[]): Promise<ApiResponse<{ images: string[] }>> {
    const formData = new FormData();
    images.forEach((image) => {
      formData.append(`images`, image);
    });

    return apiClient.upload<ApiResponse<{ images: string[] }>>(
      API_ENDPOINTS.BUSES.UPLOAD_IMAGES(busId),
      formData
    );
  }

  async uploadBusDocuments(busId: string, documents: File[]): Promise<ApiResponse<{ documents: string[] }>> {
    const formData = new FormData();
    documents.forEach((document) => {
      formData.append(`documents`, document);
    });

    return apiClient.upload<ApiResponse<{ documents: string[] }>>(
      API_ENDPOINTS.BUSES.UPLOAD_DOCUMENTS(busId),
      formData
    );
  }

  // Utility methods
  async validateRegistrationNumber(registrationNumber: string): Promise<{ isValid: boolean; message?: string }> {
    try {
      const buses = await this.getBuses({ limit: 1 });
      // This is a simple check - you might want to implement a proper validation endpoint
      return { isValid: true };
    } catch (error) {
      return { isValid: false, message: 'Unable to validate registration number' };
    }
  }

  generateSeatNumber(row: number, column: number): string {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return `${row}${letters[column - 1]}`;
  }

  validateSeatConfiguration(config: SeatConfiguration): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (config.totalRows < 1 || config.totalRows > 20) {
      errors.push('Total rows must be between 1 and 20');
    }

    if (config.seatsPerRow < 2 || config.seatsPerRow > 6) {
      errors.push('Seats per row must be between 2 and 6');
    }

    if (config.seatMap.length === 0) {
      errors.push('Seat map cannot be empty');
    }

    const totalSeats = config.seatMap.filter(seat => seat.isActive).length;
    if (totalSeats < 20 || totalSeats > 56) {
      errors.push('Total active seats must be between 20 and 56');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

export const busesService = new BusesService();