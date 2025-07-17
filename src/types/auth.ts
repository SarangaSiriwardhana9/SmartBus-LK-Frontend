// src/types/auth.ts
export type UserRole = 'admin' | 'bus_owner' | 'driver' | 'conductor' | 'passenger'

export interface User {
  _id: string
  email: string
  role: UserRole
  profile: {
    firstName: string
    lastName: string
    phone?: string
    dateOfBirth?: string
    gender?: 'male' | 'female' | 'other'
  }
  verification: {
    emailVerified: boolean
    phoneVerified: boolean
    documentsVerified: boolean
  }
  status: 'active' | 'suspended' | 'pending'
  createdAt: string
  updatedAt?: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  message: string
  user: User
  accessToken: string
  refreshToken: string
}

export interface RegisterRequest {
  email: string
  password: string
  role: UserRole
  profile: {
    firstName: string
    lastName: string
    phone: string
    dateOfBirth?: string
    gender?: 'male' | 'female' | 'other'
  }
}

export interface RegisterResponse {
  message: string
  user: User
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  token: string | null
}