// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// API Endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    PROFILE: '/auth/profile',
    ME: '/auth/me',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_EMAIL: '/auth/verify-email',
    VERIFY_PHONE: '/auth/verify-phone',
  },
  
  // Bus Route endpoints
  BUS_ROUTES: {
    BASE: '/bus-routes',
    BY_BUS_ID: (busId: string) => `/bus-routes/${busId}`,
    SCHEDULE: (id: string) => `/bus-routes/${id}/schedule`,
  },

  // Booking endpoints
  BOOKINGS: {
    BASE: '/bookings',
    BY_ID: (id: string) => `/bookings/${id}`,
    SEARCH: '/bookings/search',
    TRIPS: '/bookings/trips',
    TRIP_SEATS: (tripId: string) => `/bookings/trips/${tripId}/seats`,
    CANCEL: (id: string) => `/bookings/${id}/cancel`,
    TICKET: (id: string) => `/bookings/${id}/ticket`,
    MODIFY: (id: string) => `/bookings/${id}/modify`,
    USER_HISTORY: (userId: string) => `/bookings/user/${userId}`,
  },

  // Trip endpoints
  TRIPS: {
    STATUS: (id: string) => `/trips/${id}/status`,
    LOCATION: (id: string) => `/trips/${id}/location`,
    START: (id: string) => `/trips/${id}/start`,
    COMPLETE: (id: string) => `/trips/${id}/complete`,
    PASSENGERS: (id: string) => `/trips/${id}/passengers`,
    BOARDING: (id: string, bookingId: string) => `/trips/${id}/boarding/${bookingId}`,
    INCIDENT: (id: string) => `/trips/${id}/incident`,
  },


  // Bus endpoints
  BUSES: {
    BASE: '/buses',
    BY_ID: (id: string) => `/buses/${id}`,
    SEAT_CONFIGURATION: (id: string) => `/buses/${id}/seat-configuration`,
    SEAT_MAP: (id: string) => `/buses/${id}/seat-map`,
    UPLOAD_IMAGES: (id: string) => `/buses/${id}/upload-images`,
    UPLOAD_DOCUMENTS: (id: string) => `/buses/${id}/upload-documents`,
    APPROVE: (id: string) => `/buses/${id}/approve`,
    REJECT: (id: string) => `/buses/${id}/reject`,
    
    // Bus Owner Profile
    OWNER_PROFILE: '/buses/owner/profile',
    APPROVE_OWNER_PROFILE: (id: string) => `/buses/owner/profile/${id}/approve`,
    REJECT_OWNER_PROFILE: (id: string) => `/buses/owner/profile/${id}/reject`,
  },

  // Route endpoints
  ROUTES: {
    BASE: '/routes',
    BY_ID: (id: string) => `/routes/${id}`,
    SEARCH: '/routes/search',
    POPULAR: '/routes/popular',
    
    // Bus Route Assignments
    BUS_ASSIGNMENTS: '/routes/bus-assignments',
    BUS_ASSIGNMENTS_LIST: '/routes/bus-assignments/list',
    BUS_ASSIGNMENT_BY_ID: (id: string) => `/routes/bus-assignments/${id}`,
  },

 // Upload endpoints
  UPLOAD: {
    SINGLE: '/upload/single',
    MULTIPLE: '/upload/multiple',
    BUS_IMAGES: (busId: string) => `/upload/bus/${busId}/images`,
    BUS_DOCUMENTS: (busId: string) => `/upload/bus/${busId}/documents`,
    PROFILE_PICTURE: '/upload/profile-picture',
    GET_FILE: (filename: string) => `/upload/files/${filename}`,
    ENTITY_FILES: (entityType: string, entityId: string) => 
      `/upload/entity/${entityType}/${entityId}`,
    DELETE_FILE: (filename: string) => `/upload/files/${filename}`,
  },

  // Users endpoints (Admin only)
  USERS: {
    BASE: '/users',
    BY_ID: (id: string) => `/users/${id}`,
    STATISTICS: '/users/statistics',
    PENDING_VERIFICATIONS: '/users/pending-verifications',
    SEARCH: '/users/search',
    UPDATE_STATUS: (id: string) => `/users/${id}/status`,
    UPDATE_ROLE: (id: string) => `/users/${id}/role`,
    BULK_OPERATION: '/users/bulk-operation',
  },

  // Dashboard endpoints
  DASHBOARD: {
    ADMIN: '/dashboard/admin',
    BUS_OWNER: '/dashboard/bus-owner',
    PASSENGER: '/dashboard/passenger',
    DRIVER: '/dashboard/driver',
    CONDUCTOR: '/dashboard/conductor',
  },

  // Analytics endpoints
  ANALYTICS: {
    REVENUE: '/analytics/revenue',
    BOOKINGS: '/analytics/bookings',
    PERFORMANCE: '/analytics/performance',
    OCCUPANCY: '/analytics/occupancy',
    FINANCIAL_SUMMARY: '/analytics/financial-summary',
  },

} as const;

// Storage keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user',
  THEME: 'theme',
} as const;

// Default pagination
export const DEFAULT_PAGINATION = {
  PAGE: 1,
  LIMIT: 10,
} as const;

// Booking policies
export const BOOKING_POLICIES = {
  CANCELLATION_HOURS: 24,
  MODIFICATION_HOURS: 24,
  MAX_PASSENGERS_PER_BOOKING: 6,
} as const;

// Bus configuration limits
export const BUS_LIMITS = {
  MIN_SEATS: 20,
  MAX_SEATS: 56,
  MAX_IMAGES: 10,
  MAX_DOCUMENT_SIZE: 5 * 1024 * 1024, // 5MB
} as const;


export const BUS_CONFIG = {
  MAX_IMAGES: 10,
  MAX_DOCUMENTS: 5,
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'image/jpeg', 'image/png'],
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
} as const;

// Route specific constants
export const ROUTE_CONFIG = {
  MAX_INTERMEDIATE_STOPS: 10,
  MIN_DISTANCE: 1, // km
  MAX_DISTANCE: 1000, // km
} as const;




export const DASHBOARD_CONFIG = {
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 50,
  REFRESH_INTERVAL: 30000, // 30 seconds
} as const;

// Analytics specific constants
export const ANALYTICS_CONFIG = {
  DEFAULT_PERIOD: ReportPeriod.MONTHLY,
  MAX_DATE_RANGE_DAYS: 365,
  CHART_COLORS: {
    PRIMARY: '#3B82F6',
    SUCCESS: '#10B981',
    WARNING: '#F59E0B',
    DANGER: '#EF4444',
    INFO: '#6B7280',
  }
} as const;