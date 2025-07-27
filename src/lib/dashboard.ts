/* eslint-disable @typescript-eslint/no-explicit-any */

import { apiClient } from './api-client';
import { API_ENDPOINTS, DASHBOARD_CONFIG } from './constants';
import {
  DashboardFilterDto,
  AdminDashboardResponse,
  BusOwnerDashboardResponse,
  PassengerDashboardResponse,
  DriverDashboardResponse,
  ConductorDashboardResponse,
  DateRange,
} from './types';

export class DashboardService {
  // Admin Dashboard
  async getAdminDashboard(filters: DashboardFilterDto = {}): Promise<AdminDashboardResponse> {
    const queryParams = this.buildQueryParams(filters);
    return apiClient.get<AdminDashboardResponse>(
      API_ENDPOINTS.DASHBOARD.ADMIN,
      queryParams
    );
  }

  // Bus Owner Dashboard
  async getBusOwnerDashboard(filters: DashboardFilterDto = {}): Promise<BusOwnerDashboardResponse> {
    const queryParams = this.buildQueryParams(filters);
    return apiClient.get<BusOwnerDashboardResponse>(
      API_ENDPOINTS.DASHBOARD.BUS_OWNER,
      queryParams
    );
  }

  // Passenger Dashboard
  async getPassengerDashboard(filters: DashboardFilterDto = {}): Promise<PassengerDashboardResponse> {
    const queryParams = this.buildQueryParams(filters);
    return apiClient.get<PassengerDashboardResponse>(
      API_ENDPOINTS.DASHBOARD.PASSENGER,
      queryParams
    );
  }

  // Driver Dashboard
  async getDriverDashboard(filters: DashboardFilterDto = {}): Promise<DriverDashboardResponse> {
    const queryParams = this.buildQueryParams(filters);
    return apiClient.get<DriverDashboardResponse>(
      API_ENDPOINTS.DASHBOARD.DRIVER,
      queryParams
    );
  }

  // Conductor Dashboard
  async getConductorDashboard(filters: DashboardFilterDto = {}): Promise<ConductorDashboardResponse> {
    const queryParams = this.buildQueryParams(filters);
    return apiClient.get<ConductorDashboardResponse>(
      API_ENDPOINTS.DASHBOARD.CONDUCTOR,
      queryParams
    );
  }

  // Helper methods
  private buildQueryParams(filters: DashboardFilterDto): Record<string, string> {
    const params: Record<string, string> = {};

    if (filters.dateRange) {
      params.dateRange = filters.dateRange;
    }

    if (filters.startDate) {
      params.startDate = filters.startDate;
    }

    if (filters.endDate) {
      params.endDate = filters.endDate;
    }

    if (filters.limit) {
      params.limit = filters.limit.toString();
    }

    return params;
  }

  // Utility methods for dashboard data processing
  calculateGrowthRate(current: number, previous: number): number {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100 * 100) / 100;
  }

  calculateOccupancyRate(bookedSeats: number, totalSeats: number): number {
    if (totalSeats === 0) return 0;
    return Math.round((bookedSeats / totalSeats) * 100 * 100) / 100;
  }

  formatDashboardDate(date: string | Date): string {
    return new Date(date).toLocaleDateString('en-LK', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  formatDashboardTime(time: string): string {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-LK', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  }

  getDateRangeOptions(): Array<{ value: DateRange; label: string }> {
    return [
      { value: DateRange.TODAY, label: 'Today' },
      { value: DateRange.WEEK, label: 'Last 7 Days' },
      { value: DateRange.MONTH, label: 'Last 30 Days' },
      { value: DateRange.YEAR, label: 'Last Year' },
      { value: DateRange.CUSTOM, label: 'Custom Range' },
    ];
  }

  getDefaultDateRange(): DateRange {
    return DateRange.MONTH;
  }

  // Dashboard data formatters
  formatRevenue(amount: number): string {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  formatLargeNumber(num: number): string {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  }

  getStatusBadgeColor(status: string): string {
    const colorMap: Record<string, string> = {
      active: 'green',
      confirmed: 'green',
      completed: 'green',
      pending: 'yellow',
      'pending-approval': 'yellow',
      maintenance: 'orange',
      suspended: 'orange',
      inactive: 'red',
      cancelled: 'red',
      rejected: 'red',
    };
    return colorMap[status.toLowerCase()] || 'gray';
  }

  // Chart data helpers
  prepareChartData(data: any[], xKey: string, yKey: string): Array<{ x: any; y: any }> {
    return data.map(item => ({
      x: item[xKey],
      y: item[yKey],
    }));
  }

  prepareRevenueChartData(revenueData: any[]): Array<{ date: string; revenue: number; bookings: number }> {
    return revenueData.map(item => ({
      date: this.formatChartDate(item._id),
      revenue: item.totalRevenue,
      bookings: item.totalBookings,
    }));
  }

  private formatChartDate(dateObj: { year: number; month?: number; day?: number }): string {
    if (dateObj.day) {
      return `${dateObj.year}-${String(dateObj.month).padStart(2, '0')}-${String(dateObj.day).padStart(2, '0')}`;
    } else if (dateObj.month) {
      return `${dateObj.year}-${String(dateObj.month).padStart(2, '0')}`;
    }
    return dateObj.year.toString();
  }

  // Performance metrics
  calculateFleetUtilization(active: number, total: number): number {
    if (total === 0) return 0;
    return Math.round((active / total) * 100 * 100) / 100;
  }

  calculateAverageOccupancy(busPerformance: any[]): number {
    if (busPerformance.length === 0) return 0;
    const totalOccupancy = busPerformance.reduce((sum, bus) => sum + bus.occupancyRate, 0);
    return Math.round((totalOccupancy / busPerformance.length) * 100) / 100;
  }

  getTopPerformingBuses(busPerformance: any[], limit: number = 5): any[] {
    return busPerformance
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, limit);
  }

  // Dashboard refresh utilities
  shouldRefreshDashboard(lastUpdated: Date): boolean {
    const now = new Date();
    const timeDiff = now.getTime() - lastUpdated.getTime();
    return timeDiff > DASHBOARD_CONFIG.REFRESH_INTERVAL;
  }

  getRefreshInterval(): number {
    return DASHBOARD_CONFIG.REFRESH_INTERVAL;
  }
}

export const dashboardService = new DashboardService();