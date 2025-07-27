/* eslint-disable @typescript-eslint/no-explicit-any */

import { apiClient } from './api-client';
import { API_ENDPOINTS, ANALYTICS_CONFIG } from './constants';
import {
  ReportFilterDto,
  RevenueReportResponse,
  BookingAnalyticsResponse,
  BusPerformanceReportResponse,
  OccupancyAnalysisResponse,
  FinancialSummaryResponse,
  ReportPeriod,
} from './types';

export class AnalyticsService {
  // Revenue Reports
  async getRevenueReport(filters: ReportFilterDto = {}): Promise<RevenueReportResponse> {
    const queryParams = this.buildQueryParams(filters);
    return apiClient.get<RevenueReportResponse>(
      API_ENDPOINTS.ANALYTICS.REVENUE,
      queryParams
    );
  }

  // Booking Analytics
  async getBookingAnalytics(filters: ReportFilterDto = {}): Promise<BookingAnalyticsResponse> {
    const queryParams = this.buildQueryParams(filters);
    return apiClient.get<BookingAnalyticsResponse>(
      API_ENDPOINTS.ANALYTICS.BOOKINGS,
      queryParams
    );
  }

  // Bus Performance Reports
  async getBusPerformanceReport(filters: ReportFilterDto = {}): Promise<BusPerformanceReportResponse> {
    const queryParams = this.buildQueryParams(filters);
    return apiClient.get<BusPerformanceReportResponse>(
      API_ENDPOINTS.ANALYTICS.PERFORMANCE,
      queryParams
    );
  }

  // Occupancy Analysis
  async getOccupancyAnalysis(filters: ReportFilterDto = {}): Promise<OccupancyAnalysisResponse> {
    const queryParams = this.buildQueryParams(filters);
    return apiClient.get<OccupancyAnalysisResponse>(
      API_ENDPOINTS.ANALYTICS.OCCUPANCY,
      queryParams
    );
  }

  // Financial Summary
  async getFinancialSummary(filters: ReportFilterDto = {}): Promise<FinancialSummaryResponse> {
    const queryParams = this.buildQueryParams(filters);
    return apiClient.get<FinancialSummaryResponse>(
      API_ENDPOINTS.ANALYTICS.FINANCIAL_SUMMARY,
      queryParams
    );
  }

  // Helper methods
  private buildQueryParams(filters: ReportFilterDto): Record<string, string> {
    const params: Record<string, string> = {};

    if (filters.period) {
      params.period = filters.period;
    }

    if (filters.startDate) {
      params.startDate = filters.startDate;
    }

    if (filters.endDate) {
      params.endDate = filters.endDate;
    }

    if (filters.busOwnerId) {
      params.busOwnerId = filters.busOwnerId;
    }

    return params;
  }

  // Analytics utility methods
  getReportPeriodOptions(): Array<{ value: ReportPeriod; label: string }> {
    return [
      { value: ReportPeriod.DAILY, label: 'Daily' },
      { value: ReportPeriod.WEEKLY, label: 'Weekly' },
      { value: ReportPeriod.MONTHLY, label: 'Monthly' },
      { value: ReportPeriod.YEARLY, label: 'Yearly' },
      { value: ReportPeriod.CUSTOM, label: 'Custom Range' },
    ];
  }

  getDefaultReportPeriod(): ReportPeriod {
    return ANALYTICS_CONFIG.DEFAULT_PERIOD;
  }

  validateDateRange(startDate: string, endDate: string): { isValid: boolean; error?: string } {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const now = new Date();

    if (start > end) {
      return { isValid: false, error: 'Start date cannot be after end date' };
    }

    if (end > now) {
      return { isValid: false, error: 'End date cannot be in the future' };
    }

    const daysDiff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    if (daysDiff > ANALYTICS_CONFIG.MAX_DATE_RANGE_DAYS) {
      return { isValid: false, error: `Date range cannot exceed ${ANALYTICS_CONFIG.MAX_DATE_RANGE_DAYS} days` };
    }

    return { isValid: true };
  }

  // Data formatting methods
  formatAnalyticsDate(dateObj: any, period: ReportPeriod): string {
    switch (period) {
      case ReportPeriod.DAILY:
        return `${dateObj.year}-${String(dateObj.month).padStart(2, '0')}-${String(dateObj.day).padStart(2, '0')}`;
      case ReportPeriod.WEEKLY:
        return `${dateObj.year}-W${String(dateObj.week).padStart(2, '0')}`;
      case ReportPeriod.YEARLY:
        return dateObj.year.toString();
      default: // MONTHLY
        return `${dateObj.year}-${String(dateObj.month).padStart(2, '0')}`;
    }
  }

  formatDisplayDate(dateStr: string, period: ReportPeriod): string {
    switch (period) {
      case ReportPeriod.DAILY:
        return new Date(dateStr).toLocaleDateString('en-LK', {
          month: 'short',
          day: 'numeric',
        });
      case ReportPeriod.WEEKLY:
        const [year, week] = dateStr.split('-W');
        return `Week ${week}, ${year}`;
      case ReportPeriod.YEARLY:
        return dateStr;
      default: // MONTHLY
        const [yr, month] = dateStr.split('-');
        return new Date(parseInt(yr), parseInt(month) - 1).toLocaleDateString('en-LK', {
          year: 'numeric',
          month: 'long',
        });
    }
  }

  // Chart data preparation
  prepareRevenueChartData(revenueData: any[], period: ReportPeriod): Array<{
    period: string;
    revenue: number;
    bookings: number;
  }> {
    return revenueData.map(item => ({
      period: this.formatDisplayDate(this.formatAnalyticsDate(item._id, period), period),
      revenue: item.totalRevenue,
      bookings: item.totalBookings,
    }));
  }

  prepareBookingTrendsData(bookingTrends: any[], period: ReportPeriod): Array<{
    period: string;
    total: number;
    confirmed: number;
    cancelled: number;
  }> {
    return bookingTrends.map(item => ({
      period: this.formatDisplayDate(this.formatAnalyticsDate(item._id, period), period),
      total: item.totalBookings,
      confirmed: item.confirmedBookings,
      cancelled: item.cancelledBookings,
    }));
  }

  preparePeakTimesData(peakTimes: any[]): Array<{
    hour: number;
    dayOfWeek: string;
    bookings: number;
  }> {
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    return peakTimes.map(item => ({
      hour: item._id.hour,
      dayOfWeek: dayNames[item._id.dayOfWeek - 1],
      bookings: item.bookingCount,
    }));
  }

  // Performance calculations
  calculateRevenueGrowth(currentPeriod: number, previousPeriod: number): number {
    if (previousPeriod === 0) return currentPeriod > 0 ? 100 : 0;
    return Math.round(((currentPeriod - previousPeriod) / previousPeriod) * 100 * 100) / 100;
  }

  calculateBookingConversionRate(confirmed: number, total: number): number {
    if (total === 0) return 0;
    return Math.round((confirmed / total) * 100 * 100) / 100;
  }

  calculateAverageBookingValue(totalRevenue: number, totalBookings: number): number {
    if (totalBookings === 0) return 0;
    return Math.round((totalRevenue / totalBookings) * 100) / 100;
  }

  // Top performers identification
  getTopPerformingRoutes(routes: any[], limit: number = 10): any[] {
    return routes
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, limit);
  }

  getTopPerformingBuses(buses: any[], metric: 'revenue' | 'occupancy' = 'revenue', limit: number = 10): any[] {
    const sortKey = metric === 'revenue' ? 'totalRevenue' : 'occupancyRate';
    return buses
      .sort((a, b) => b[sortKey] - a[sortKey])
      .slice(0, limit);
  }

  // Export utilities
  async exportRevenueReport(filters: ReportFilterDto, format: 'csv' | 'excel' = 'csv'): Promise<string> {
    const data = await this.getRevenueReport(filters);
    return this.generateExportUrl('revenue', data, format);
  }

  async exportBookingAnalytics(filters: ReportFilterDto, format: 'csv' | 'excel' = 'csv'): Promise<string> {
    const data = await this.getBookingAnalytics(filters);
    return this.generateExportUrl('bookings', data, format);
  }

  private generateExportUrl(reportType: string, data: any, format: string): string {
    // This would typically generate a download URL or trigger a download
    // For now, we'll return a placeholder URL
    const timestamp = new Date().toISOString().split('T')[0];
    return `/api/analytics/export/${reportType}-${timestamp}.${format}`;
  }

  // Color schemes for charts
  getChartColors(): typeof ANALYTICS_CONFIG.CHART_COLORS {
    return ANALYTICS_CONFIG.CHART_COLORS;
  }

  getOccupancyColorByRate(rate: number): string {
    if (rate >= 80) return ANALYTICS_CONFIG.CHART_COLORS.SUCCESS;
    if (rate >= 60) return ANALYTICS_CONFIG.CHART_COLORS.WARNING;
    return ANALYTICS_CONFIG.CHART_COLORS.DANGER;
  }

  // Date range helpers
  getQuickDateRanges(): Array<{
    label: string;
    startDate: string;
    endDate: string;
    period: ReportPeriod;
  }> {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    
    const lastWeek = new Date(now);
    lastWeek.setDate(now.getDate() - 7);
    
    const lastMonth = new Date(now);
    lastMonth.setMonth(now.getMonth() - 1);
    
    const lastYear = new Date(now);
    lastYear.setFullYear(now.getFullYear() - 1);

    return [
      {
        label: 'Last 7 Days',
        startDate: lastWeek.toISOString().split('T')[0],
        endDate: today,
        period: ReportPeriod.DAILY,
      },
      {
        label: 'Last 30 Days',
        startDate: lastMonth.toISOString().split('T')[0],
        endDate: today,
        period: ReportPeriod.DAILY,
      },
      {
        label: 'Last 12 Months',
        startDate: lastYear.toISOString().split('T')[0],
        endDate: today,
        period: ReportPeriod.MONTHLY,
      },
    ];
  }
}

export const analyticsService = new AnalyticsService();