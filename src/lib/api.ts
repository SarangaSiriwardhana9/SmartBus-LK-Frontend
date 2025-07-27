// src/lib/api.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { API_BASE_URL, STORAGE_KEYS } from '@/constants'
import type { 
  LoginRequest, LoginResponse, RegisterRequest, RegisterResponse, User, ApiError,
  BusOwnerProfile, Bus, SeatMapItem, Route, BusRouteAssignment, Trip, Booking,
  PassengerDetail, BookingReview, UploadedFile, DashboardData, AnalyticsData
} from '@/types'

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface SearchParams {
  page?: number
  limit?: number
  search?: string
  [key: string]: any
}

class ApiClient {
  private baseURL: string
  private token: string | null = null

  constructor(baseURL: string) {
    this.baseURL = baseURL
    
    // Initialize token from localStorage if available
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
    }
  }

  setToken(token: string | null) {
    this.token = token
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token)
      } else {
        localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
      }
    }
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    
    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string>),
    }

    // Don't set Content-Type for FormData
    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json'
    }

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      })

      if (!response.ok) {
        const errorData: ApiError = await response.json()
        throw new Error(errorData.message || `HTTP ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('API Request failed:', error)
      throw error
    }
  }

  private buildQueryString(params: Record<string, any>): string {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value))
      }
    })
    return searchParams.toString()
  }

  // Auth endpoints
  auth = {
    login: async (credentials: LoginRequest): Promise<LoginResponse> => {
      const response = await this.request<LoginResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      })
      
      this.setToken(response.accessToken)
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.refreshToken)
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user))
      }
      
      return response
    },

    register: async (userData: RegisterRequest): Promise<RegisterResponse> => {
      return this.request<RegisterResponse>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      })
    },

    logout: async (): Promise<void> => {
      try {
        await this.request('/auth/logout', { method: 'POST' })
      } finally {
        this.setToken(null)
        if (typeof window !== 'undefined') {
          localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
          localStorage.removeItem(STORAGE_KEYS.USER)
        }
      }
    },

    getCurrentUser: async (): Promise<{ user: User }> => {
      return this.request<{ user: User }>('/auth/me')
    },

    getProfile: async (): Promise<User> => {
      return this.request<User>('/auth/profile')
    }
  }

  // Bus Management
  buses = {
    // Bus Owner Profile Management
    createOwnerProfile: async (profileData: Partial<BusOwnerProfile>) => {
      return this.request<{ message: string; profile: BusOwnerProfile }>('/buses/owner/profile', {
        method: 'POST',
        body: JSON.stringify(profileData),
      })
    },

    getOwnerProfile: async () => {
      return this.request<BusOwnerProfile>('/buses/owner/profile')
    },

    approveOwnerProfile: async (id: string) => {
      return this.request<{ message: string }>(`/buses/owner/profile/${id}/approve`, {
        method: 'PATCH',
      })
    },

    rejectOwnerProfile: async (id: string) => {
      return this.request<{ message: string }>(`/buses/owner/profile/${id}/reject`, {
        method: 'PATCH',
      })
    },

    // Bus Registration & Management
    createBus: async (busData: Partial<Bus>) => {
      return this.request<{ message: string; bus: Bus }>('/buses', {
        method: 'POST',
        body: JSON.stringify(busData),
      })
    },

  getBuses: async (params: SearchParams = {}) => {
    const queryString = this.buildQueryString(params)
    // Handle the actual response structure (assuming similar to users)
    const response = await this.request<{
      buses?: Bus[]  // Handle if your API returns { buses: [...] }
      data?: Bus[]   // Handle if your API returns { data: [...] }
      pagination?: {
        total: number
        page: number
        limit: number
        totalPages: number
      }
      // Or if pagination is at root level
      total?: number
      page?: number
      limit?: number
      totalPages?: number
    }>(`/buses?${queryString}`)
    
    // Transform to match PaginatedResponse format
    let busesData: Bus[] = []
    let paginationData = {
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 1
    }

    // Handle different possible response structures
    if (response.buses) {
      busesData = response.buses
      if (response.pagination) {
        paginationData = response.pagination
      }
    } else if (response.data) {
      busesData = response.data
      paginationData = {
        total: response.total || 0,
        page: response.page || 1,
        limit: response.limit || 10,
        totalPages: response.totalPages || 1
      }
    }
    
    return {
      data: busesData,
      total: paginationData.total,
      page: paginationData.page,
      limit: paginationData.limit,
      totalPages: paginationData.totalPages
    }
  },

    getBusById: async (id: string) => {
      return this.request<Bus>(`/buses/${id}`)
    },

    updateBus: async (id: string, busData: Partial<Bus>) => {
      return this.request<{ message: string; bus: Bus }>(`/buses/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(busData),
      })
    },

    deleteBus: async (id: string) => {
      return this.request<{ message: string }>(`/buses/${id}`, {
        method: 'DELETE',
      })
    },

    updateSeatConfiguration: async (id: string, seatConfig: { seatMap: SeatMapItem[] }) => {
      return this.request<{ message: string }>(`/buses/${id}/seat-configuration`, {
        method: 'PATCH',
        body: JSON.stringify(seatConfig),
      })
    },

    getSeatMap: async (id: string) => {
      return this.request<{ seatMap: SeatMapItem[] }>(`/buses/${id}/seat-map`)
    },

    approveBus: async (id: string) => {
      return this.request<{ message: string }>(`/buses/${id}/approve`, {
        method: 'PATCH',
      })
    },

    rejectBus: async (id: string) => {
      return this.request<{ message: string }>(`/buses/${id}/reject`, {
        method: 'PATCH',
      })
    },
  }

  // Routes Management
  routes = {
    createRoute: async (routeData: Partial<Route>) => {
      return this.request<{ message: string; route: Route }>('/routes', {
        method: 'POST',
        body: JSON.stringify(routeData),
      })
    },

    getRoutes: async (params: SearchParams = {}) => {
      const queryString = this.buildQueryString(params)
      return this.request<PaginatedResponse<Route>>(`/routes?${queryString}`)
    },

    searchRoutes: async (origin: string, destination: string) => {
      const queryString = this.buildQueryString({ origin, destination })
      return this.request<Route[]>(`/routes/search?${queryString}`)
    },

    getPopularRoutes: async () => {
      return this.request<Route[]>('/routes/popular')
    },

    getRouteById: async (id: string) => {
      return this.request<Route>(`/routes/${id}`)
    },

    updateRoute: async (id: string, routeData: Partial<Route>) => {
      return this.request<{ message: string; route: Route }>(`/routes/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(routeData),
      })
    },

    deleteRoute: async (id: string) => {
      return this.request<{ message: string }>(`/routes/${id}`, {
        method: 'DELETE',
      })
    },

    // Bus Route Assignments
    createBusAssignment: async (assignmentData: Partial<BusRouteAssignment>) => {
      return this.request<{ message: string; assignment: BusRouteAssignment }>('/routes/bus-assignments', {
        method: 'POST',
        body: JSON.stringify(assignmentData),
      })
    },

    getBusAssignments: async (params: SearchParams = {}) => {
      const queryString = this.buildQueryString(params)
      return this.request<PaginatedResponse<BusRouteAssignment>>(`/routes/bus-assignments/list?${queryString}`)
    },

    getBusAssignmentById: async (id: string) => {
      return this.request<BusRouteAssignment>(`/routes/bus-assignments/${id}`)
    },

    updateBusAssignment: async (id: string, assignmentData: Partial<BusRouteAssignment>) => {
      return this.request<{ message: string; assignment: BusRouteAssignment }>(`/routes/bus-assignments/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(assignmentData),
      })
    },

    deleteBusAssignment: async (id: string) => {
      return this.request<{ message: string }>(`/routes/bus-assignments/${id}`, {
        method: 'DELETE',
      })
    },
  }

  // Bookings Management
  bookings = {
    // Trip Management
    createTrip: async (tripData: { busRouteId: string; tripDate: string; tripStatus?: string }) => {
      return this.request<{ message: string; trip: Trip }>('/bookings/trips', {
        method: 'POST',
        body: JSON.stringify(tripData),
      })
    },

    searchTrips: async (searchData: {
      originCity: string
      destinationCity: string
      journeyDate: string
      journeyTime?: string
      busType?: string
      passengerCount?: number
    }) => {
      return this.request<Trip[]>('/bookings/search', {
        method: 'POST',
        body: JSON.stringify(searchData),
      })
    },

    getTripSeats: async (tripId: string) => {
      return this.request<{ seatAvailability: any[] }>(`/bookings/trips/${tripId}/seats`)
    },

    // Booking Operations
    createBooking: async (bookingData: {
      tripId: string
      seatDetails: PassengerDetail[]
      journeyDetails: any
      paymentDetails: any
    }) => {
      return this.request<{ message: string; booking: Booking }>('/bookings', {
        method: 'POST',
        body: JSON.stringify(bookingData),
      })
    },

    getBookings: async (params: SearchParams = {}) => {
      const queryString = this.buildQueryString(params)
      return this.request<PaginatedResponse<Booking>>(`/bookings?${queryString}`)
    },

    getBookingById: async (id: string) => {
      return this.request<Booking>(`/bookings/${id}`)
    },

    modifyBooking: async (id: string, modificationData: Partial<Booking>) => {
      return this.request<{ message: string; booking: Booking }>(`/bookings/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(modificationData),
      })
    },

    cancelBooking: async (id: string, reason: string) => {
      return this.request<{ message: string }>(`/bookings/${id}/cancel`, {
        method: 'PATCH',
        body: JSON.stringify({ reason }),
      })
    },

    downloadTicket: async (id: string) => {
      return this.request<{ ticketUrl: string }>(`/bookings/${id}/ticket`)
    },

    getUserBookingHistory: async (userId: string, params: SearchParams = {}) => {
      const queryString = this.buildQueryString(params)
      return this.request<PaginatedResponse<Booking>>(`/bookings/history/${userId}?${queryString}`)
    },

    // Reviews and Suggestions
    addReview: async (bookingId: string, reviewData: BookingReview) => {
      return this.request<{ message: string }>(`/bookings/${bookingId}/review`, {
        method: 'POST',
        body: JSON.stringify(reviewData),
      })
    },

    getReviews: async (entityType: 'trip' | 'bus' | 'route', entityId: string) => {
      return this.request<any[]>(`/bookings/reviews/${entityType}/${entityId}`)
    },

    getSuggestions: async (query: string) => {
      return this.request<any[]>(`/bookings/suggestions?q=${query}`)
    },
  }

  // File Upload
  upload = {
    uploadSingle: async (file: File, fileType: string, options: {
      entityId?: string
      documentType?: string
      description?: string
    } = {}) => {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('fileType', fileType)
      if (options.entityId) formData.append('entityId', options.entityId)
      if (options.documentType) formData.append('documentType', options.documentType)
      if (options.description) formData.append('description', options.description)

      return this.request<{ message: string; file: UploadedFile }>('/upload/single', {
        method: 'POST',
        body: formData,
      })
    },

    uploadMultiple: async (files: File[], fileType: string, options: {
      entityId?: string
      documentType?: string
      description?: string
    } = {}) => {
      const formData = new FormData()
      files.forEach(file => formData.append('files', file))
      formData.append('fileType', fileType)
      if (options.entityId) formData.append('entityId', options.entityId)
      if (options.documentType) formData.append('documentType', options.documentType)
      if (options.description) formData.append('description', options.description)

      return this.request<{ message: string; files: UploadedFile[] }>('/upload/multiple', {
        method: 'POST',
        body: formData,
      })
    },

    uploadBusImages: async (busId: string, images: File[]) => {
      const formData = new FormData()
      images.forEach(image => formData.append('images', image))

      return this.request<{ message: string; files: UploadedFile[] }>(`/upload/bus/${busId}/images`, {
        method: 'POST',
        body: formData,
      })
    },

    uploadBusDocuments: async (busId: string, documents: File[], options: {
      documentType?: string
      description?: string
    } = {}) => {
      const formData = new FormData()
      documents.forEach(doc => formData.append('documents', doc))
      if (options.documentType) formData.append('documentType', options.documentType)
      if (options.description) formData.append('description', options.description)

      return this.request<{ message: string; files: UploadedFile[] }>(`/upload/bus/${busId}/documents`, {
        method: 'POST',
        body: formData,
      })
    },

    uploadProfilePicture: async (profilePicture: File) => {
      const formData = new FormData()
      formData.append('profilePicture', profilePicture)

      return this.request<{ message: string; file: UploadedFile }>('/upload/profile-picture', {
        method: 'POST',
        body: formData,
      })
    },

    getEntityFiles: async (entityType: 'bus' | 'user', entityId: string) => {
      return this.request<UploadedFile[]>(`/upload/entity/${entityType}/${entityId}`)
    },

    deleteFile: async (filename: string) => {
      return this.request<{ message: string }>(`/upload/files/${filename}`, {
        method: 'DELETE',
      })
    },
  }

  // Dashboard
  dashboard = {
    getAdminDashboard: async (params: {
      dateRange?: 'today' | 'week' | 'month' | 'year' | 'custom'
      startDate?: string
      endDate?: string
      limit?: number
    } = {}) => {
      const queryString = this.buildQueryString(params)
      return this.request<DashboardData>(`/dashboard/admin?${queryString}`)
    },

    getBusOwnerDashboard: async (params: {
      dateRange?: 'today' | 'week' | 'month' | 'year' | 'custom'
      startDate?: string
      endDate?: string
      limit?: number
    } = {}) => {
      const queryString = this.buildQueryString(params)
      return this.request<DashboardData>(`/dashboard/bus-owner?${queryString}`)
    },

    getPassengerDashboard: async (params: { limit?: number } = {}) => {
      const queryString = this.buildQueryString(params)
      return this.request<DashboardData>(`/dashboard/passenger?${queryString}`)
    },

    getDriverDashboard: async () => {
      return this.request<DashboardData>('/dashboard/driver')
    },

    getConductorDashboard: async () => {
      return this.request<DashboardData>('/dashboard/conductor')
    },
  }

  // User Management (Admin)
users = {
  getUsers: async (params: {
    page?: number
    limit?: number
    role?: string
    status?: string
    search?: string
  } = {}) => {
    const queryString = this.buildQueryString(params)
    // Handle the actual response structure from your API
    const response = await this.request<{
      users: User[]
      pagination: {
        total: number
        page: number
        limit: number
        totalPages: number
      }
    }>(`/users?${queryString}`)
    
    // Transform to match PaginatedResponse format
    return {
      data: response.users,
      total: response.pagination.total,
      page: response.pagination.page,
      limit: response.pagination.limit,
      totalPages: response.pagination.totalPages
    }
  },

  getUserStatistics: async () => {
    return this.request<any>('/users/statistics')
  },

  getPendingVerifications: async () => {
    return this.request<any[]>('/users/pending-verifications')
  },

  searchUsers: async (query: string, limit = 20) => {
    return this.request<User[]>(`/users/search?q=${query}&limit=${limit}`)
  },

  getUserById: async (id: string) => {
    return this.request<User>(`/users/${id}`)
  },

  updateUserStatus: async (id: string, status: string, reason?: string) => {
    return this.request<{ message: string }>(`/users/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, reason }),
    })
  },

  updateUserRole: async (id: string, role: string, reason?: string) => {
    return this.request<{ message: string }>(`/users/${id}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role, reason }),
    })
  },

  deleteUser: async (id: string) => {
    return this.request<{ message: string }>(`/users/${id}`, {
      method: 'DELETE',
    })
  },

  bulkUserOperation: async (userIds: string[], operation: string, reason?: string) => {
    return this.request<{ message: string }>('/users/bulk-operation', {
      method: 'POST',
      body: JSON.stringify({ userIds, operation, reason }),
    })
  },
}


  // Analytics & Reports
  analytics = {
    getRevenueReport: async (params: {
      period?: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom'
      startDate?: string
      endDate?: string
      busOwnerId?: string
      busIds?: string[]
      routeIds?: string[]
    } = {}) => {
      const queryString = this.buildQueryString(params)
      return this.request<AnalyticsData>(`/analytics/revenue?${queryString}`)
    },

    getBookingAnalytics: async (params: {
      period?: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom'
      startDate?: string
      endDate?: string
    } = {}) => {
      const queryString = this.buildQueryString(params)
      return this.request<AnalyticsData>(`/analytics/bookings?${queryString}`)
    },

    getPerformanceReport: async (params: {
      period?: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom'
      startDate?: string
      endDate?: string
    } = {}) => {
      const queryString = this.buildQueryString(params)
      return this.request<AnalyticsData>(`/analytics/performance?${queryString}`)
    },

    getOccupancyAnalysis: async (params: {
      period?: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom'
      startDate?: string
      endDate?: string
    } = {}) => {
      const queryString = this.buildQueryString(params)
      return this.request<AnalyticsData>(`/analytics/occupancy?${queryString}`)
    },

    getFinancialSummary: async (params: {
      period?: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom'
      startDate?: string
      endDate?: string
    } = {}) => {
      const queryString = this.buildQueryString(params)
      return this.request<AnalyticsData>(`/analytics/financial-summary?${queryString}`)
    },
  }
}

export const apiClient = new ApiClient(API_BASE_URL)