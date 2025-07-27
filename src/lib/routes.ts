import { apiClient } from './api-client';
import { API_ENDPOINTS, DEFAULT_PAGINATION } from './constants';
import type {
  CreateRouteDto,
  UpdateRouteDto,
  Route,
  RoutesResponse,
  CreateBusRouteDto,
  UpdateBusRouteDto,
  BusRoute,
  BusRoutesResponse,
  PopularRoutesResponse,
  SearchRoutesResponse,
  PaginationParams,
  ApiResponse,
} from './types';

export class RoutesService {
  // Route Management
  async createRoute(data: CreateRouteDto): Promise<ApiResponse<{ route: Route }>> {
    return apiClient.post<ApiResponse<{ route: Route }>>(
      API_ENDPOINTS.ROUTES.BASE,
      data
    );
  }

  async getRoutes(
    params: PaginationParams & { search?: string; isActive?: boolean } = {}
  ): Promise<RoutesResponse> {
    const { 
      page = DEFAULT_PAGINATION.PAGE, 
      limit = DEFAULT_PAGINATION.LIMIT, 
      search, 
      isActive 
    } = params;
    
    const queryParams: Record<string, string> = {
      page: page.toString(),
      limit: limit.toString(),
    };
    
    if (search) {
      queryParams.search = search;
    }
    
    if (isActive !== undefined) {
      queryParams.isActive = isActive.toString();
    }

    return apiClient.get<RoutesResponse>(API_ENDPOINTS.ROUTES.BASE, queryParams);
  }

  async getRouteById(id: string): Promise<Route> {
    return apiClient.get<Route>(API_ENDPOINTS.ROUTES.BY_ID(id));
  }

  async updateRoute(id: string, data: UpdateRouteDto): Promise<ApiResponse<{ route: Route }>> {
    return apiClient.patch<ApiResponse<{ route: Route }>>(
      API_ENDPOINTS.ROUTES.BY_ID(id),
      data
    );
  }

  async deleteRoute(id: string): Promise<ApiResponse> {
    return apiClient.delete<ApiResponse>(API_ENDPOINTS.ROUTES.BY_ID(id));
  }

  // Route Search
  async searchRoutes(originCity: string, destinationCity: string): Promise<SearchRoutesResponse> {
    return apiClient.get<SearchRoutesResponse>(API_ENDPOINTS.ROUTES.SEARCH, {
      origin: originCity,
      destination: destinationCity,
    });
  }

  async getPopularRoutes(): Promise<PopularRoutesResponse> {
    return apiClient.get<PopularRoutesResponse>(API_ENDPOINTS.ROUTES.POPULAR);
  }

  // Bus Route Assignment
  async assignBusToRoute(data: CreateBusRouteDto): Promise<ApiResponse<{ busRoute: BusRoute }>> {
    return apiClient.post<ApiResponse<{ busRoute: BusRoute }>>(
      API_ENDPOINTS.ROUTES.BUS_ASSIGNMENTS,
      data
    );
  }

  async getBusRoutes(
    params: PaginationParams & { busId?: string; routeId?: string } = {}
  ): Promise<BusRoutesResponse> {
    const { 
      page = DEFAULT_PAGINATION.PAGE, 
      limit = DEFAULT_PAGINATION.LIMIT, 
      busId, 
      routeId 
    } = params;
    
    const queryParams: Record<string, string> = {
      page: page.toString(),
      limit: limit.toString(),
    };
    
    if (busId) {
      queryParams.busId = busId;
    }
    
    if (routeId) {
      queryParams.routeId = routeId;
    }

    return apiClient.get<BusRoutesResponse>(
      API_ENDPOINTS.ROUTES.BUS_ASSIGNMENTS_LIST, 
      queryParams
    );
  }

  async getBusRouteById(id: string): Promise<BusRoute> {
    return apiClient.get<BusRoute>(API_ENDPOINTS.ROUTES.BUS_ASSIGNMENT_BY_ID(id));
  }

  async updateBusRoute(
    id: string, 
    data: UpdateBusRouteDto
  ): Promise<ApiResponse<{ busRoute: BusRoute }>> {
    return apiClient.patch<ApiResponse<{ busRoute: BusRoute }>>(
      API_ENDPOINTS.ROUTES.BUS_ASSIGNMENT_BY_ID(id),
      data
    );
  }

  async deleteBusRoute(id: string): Promise<ApiResponse> {
    return apiClient.delete<ApiResponse>(API_ENDPOINTS.ROUTES.BUS_ASSIGNMENT_BY_ID(id));
  }

  // Utility methods
  calculateDistance(
    origin: [number, number], 
    destination: [number, number]
  ): number {
    // Haversine formula for calculating distance between two points
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(destination[1] - origin[1]);
    const dLon = this.toRadians(destination[0] - origin[0]);
    
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(origin[1])) * Math.cos(this.toRadians(destination[1])) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
    return R * c;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  estimateTravelTime(distance: number, averageSpeed: number = 50): number {
    // Returns time in minutes
    return Math.round((distance / averageSpeed) * 60);
  }

  validateRoute(route: CreateRouteDto | UpdateRouteDto): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (route.routeName && route.routeName.trim().length < 3) {
      errors.push('Route name must be at least 3 characters long');
    }

    if (route.totalDistance !== undefined && (route.totalDistance < 1 || route.totalDistance > 1000)) {
      errors.push('Total distance must be between 1 and 1000 km');
    }

    if (route.estimatedDuration !== undefined && (route.estimatedDuration < 30 || route.estimatedDuration > 1440)) {
      errors.push('Estimated duration must be between 30 minutes and 24 hours');
    }

    if (route.origin && route.destination) {
      if (route.origin.city.toLowerCase() === route.destination.city.toLowerCase()) {
        errors.push('Origin and destination cities cannot be the same');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  formatRouteName(origin: string, destination: string): string {
    return `${origin} - ${destination}`;
  }

  // Sri Lankan cities for autocomplete
  getSriLankanCities(): string[] {
    return [
      'Colombo', 'Kandy', 'Galle', 'Jaffna', 'Negombo', 'Anuradhapura',
      'Polonnaruwa', 'Trincomalee', 'Batticaloa', 'Matara', 'Badulla',
      'Ratnapura', 'Kurunegala', 'Puttalam', 'Kalutara', 'Gampaha',
      'Nuwara Eliya', 'Bandarawela', 'Ella', 'Sigiriya', 'Dambulla',
      'Hikkaduwa', 'Unawatuna', 'Mirissa', 'Tangalle', 'Arugam Bay',
      'Kalpitiya', 'Chilaw', 'Mannar', 'Vavuniya', 'Kilinochchi'
    ];
  }

  // Popular routes in Sri Lanka
  getPopularRouteSuggestions(): Array<{ origin: string; destination: string; name: string }> {
    return [
      { origin: 'Colombo', destination: 'Kandy', name: 'Colombo - Kandy' },
      { origin: 'Colombo', destination: 'Galle', name: 'Colombo - Galle' },
      { origin: 'Colombo', destination: 'Jaffna', name: 'Colombo - Jaffna' },
      { origin: 'Kandy', destination: 'Nuwara Eliya', name: 'Kandy - Nuwara Eliya' },
      { origin: 'Colombo', destination: 'Anuradhapura', name: 'Colombo - Anuradhapura' },
      { origin: 'Galle', destination: 'Matara', name: 'Galle - Matara' },
      { origin: 'Colombo', destination: 'Trincomalee', name: 'Colombo - Trincomalee' },
      { origin: 'Kandy', destination: 'Badulla', name: 'Kandy - Badulla' },
    ];
  }
}

export const routesService = new RoutesService();