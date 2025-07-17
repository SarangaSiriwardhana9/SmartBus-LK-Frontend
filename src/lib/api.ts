// src/lib/api.ts
import { API_BASE_URL, STORAGE_KEYS } from '@/constants'
import type { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse, User, ApiError } from '@/types'

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
    
    // Fix: Properly type the headers object
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
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

  // Auth endpoints
  auth = {
    login: async (credentials: LoginRequest): Promise<LoginResponse> => {
      const response = await this.request<LoginResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      })
      
      // Store tokens
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
        // Clear tokens regardless of API response
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
}

export const apiClient = new ApiClient(API_BASE_URL)