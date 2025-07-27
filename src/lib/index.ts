export { authService } from './auth';
export { bookingsService } from './bookings';
export { busesService } from './buses';
export { routesService } from './routes';
export { uploadService } from './upload';
export { usersService } from './users';
export { dashboardService } from './dashboard';
export { analyticsService } from './analytics';
export { apiClient, ApiError } from './api-client';

// Export all types and enums
export * from './types';

// Export constants
export * from './constants';

// Utility functions
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
  }).format(amount);
};

export const formatDate = (date: string | Date): string => {
  return new Intl.DateTimeFormat('en-LK', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
};

export const formatTime = (time: string): string => {
  return new Intl.DateTimeFormat('en-LK', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(`2000-01-01T${time}`));
};

export const getInitials = (firstName: string, lastName: string): string => {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
};

export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const re = /^[0-9]{10}$/;
  return re.test(phone.replace(/\D/g, ''));
};

// Bus specific utilities
export const formatBusType = (busType: string): string => {
  const typeMap: Record<string, string> = {
    ac: 'Air Conditioned',
    'non-ac': 'Non Air Conditioned',
    'semi-luxury': 'Semi Luxury',
    luxury: 'Luxury',
  };
  return typeMap[busType] || busType;
};

export const formatBusStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    active: 'Active',
    inactive: 'Inactive',
    maintenance: 'Under Maintenance',
    pending: 'Pending Approval',
  };
  return statusMap[status] || status;
};

// Route specific utilities
export const formatDistance = (distance: number): string => {
  return `${distance.toFixed(1)} km`;
};


export const getDashboardRefreshInterval = (): number => {
  return 30000; // 30 seconds
};


export const formatDashboardMetric = (value: number, type: 'currency' | 'number' | 'percentage'): string => {
  switch (type) {
    case 'currency':
      return new Intl.NumberFormat('en-LK', {
        style: 'currency',
        currency: 'LKR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value);
    case 'percentage':
      return `${value.toFixed(1)}%`;
    case 'number':
    default:
      if (value >= 1000000) {
        return `${(value / 1000000).toFixed(1)}M`;
      } else if (value >= 1000) {
        return `${(value / 1000).toFixed(1)}K`;
      }
      return value.toLocaleString();
  }
};

export const getAnalyticsColors = () => ({
  primary: '#3B82F6',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#6B7280',
});

export const calculateGrowthPercentage = (current: number, previous: number): number => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100 * 100) / 100;
};

export const formatReportPeriod = (period: string): string => {
  const periodMap: Record<string, string> = {
    daily: 'Daily',
    weekly: 'Weekly',
    monthly: 'Monthly',
    yearly: 'Yearly',
    custom: 'Custom Range',
  };
  return periodMap[period] || period;
};


export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) {
    return `${mins} minutes`;
  } else if (mins === 0) {
    return `${hours} hour${hours > 1 ? 's' : ''}`;
  } else {
    return `${hours}h ${mins}m`;
  }
};

export const getStatusColor = (status: string): string => {
  const colorMap: Record<string, string> = {
    active: 'green',
    approved: 'green',
    confirmed: 'green',
    inactive: 'red',
    cancelled: 'red',
    rejected: 'red',
    pending: 'yellow',
    maintenance: 'orange',
    'in-progress': 'blue',
    completed: 'green',
    suspended: 'orange',
  };
  return colorMap[status] || 'gray';
};

// File utilities
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const getFileIcon = (filename: string): string => {
  const extension = filename.split('.').pop()?.toLowerCase();
  
  const iconMap: Record<string, string> = {
    pdf: '📄',
    doc: '📝',
    docx: '📝',
    jpg: '🖼️',
    jpeg: '🖼️',
    png: '🖼️',
    webp: '🖼️',
    gif: '🖼️',
  };
  
  return iconMap[extension || ''] || '📎';
};

// User utilities - Now User type should be available
import type { User } from './types'; // Import as type here

export const getUserAvatarUrl = (user: User): string => {
  if (user.profile?.profilePicture) {
    return `/api/upload/files/${user.profile.profilePicture}`;
  }
  return `/api/avatars/${encodeURIComponent(user.email)}`;
};

export const formatUserJoinDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString('en-LK', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};