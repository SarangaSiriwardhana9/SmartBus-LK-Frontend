// src/providers/auth-provider.tsx
'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { apiClient } from '@/lib/api'
import { getStoredUser, getStoredToken, clearAuthStorage, getDashboardRoute } from '@/lib/auth'
import type { User, UserRole, AuthState, LoginRequest, RegisterRequest } from '@/types'

interface AuthContextType extends AuthState {
  login: (credentials: LoginRequest) => Promise<void>
  register: (userData: RegisterRequest) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    token: null
  })
  
  const router = useRouter()

  // Initialize auth state from storage
  useEffect(() => {
    const initializeAuth = () => {
      const storedUser = getStoredUser()
      const storedToken = getStoredToken()
      
      if (storedUser && storedToken) {
        setState({
          user: storedUser,
          isAuthenticated: true,
          isLoading: false,
          token: storedToken
        })
        apiClient.setToken(storedToken)
      } else {
        setState(prev => ({ ...prev, isLoading: false }))
      }
    }

    initializeAuth()
  }, [])

  const login = async (credentials: LoginRequest) => {
    try {
      setState(prev => ({ ...prev, isLoading: true }))
      
      const response = await apiClient.auth.login(credentials)
      
      setState({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
        token: response.accessToken
      })

      // Redirect to appropriate dashboard
      const dashboardRoute = getDashboardRoute(response.user.role)
      router.push(dashboardRoute)
      
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }))
      throw error
    }
  }

  const register = async (userData: RegisterRequest) => {
    try {
      setState(prev => ({ ...prev, isLoading: true }))
      
      await apiClient.auth.register(userData)
      
      setState(prev => ({ ...prev, isLoading: false }))
      
      // Redirect to login after successful registration
      router.push('/login')
      
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }))
      throw error
    }
  }

  const logout = async () => {
    try {
      await apiClient.auth.logout()
    } finally {
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        token: null
      })
      clearAuthStorage()
      router.push('/')
    }
  }

  const refreshUser = async () => {
    try {
      const response = await apiClient.auth.getCurrentUser()
      setState(prev => ({
        ...prev,
        user: response.user
      }))
    } catch (error) {
      console.error('Failed to refresh user:', error)
      logout()
    }
  }

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    refreshUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}