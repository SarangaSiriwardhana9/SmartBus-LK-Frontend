// src/lib/auth.ts
import { STORAGE_KEYS, DASHBOARD_ROUTES } from '@/constants'
import type { User, UserRole } from '@/types'

export const getStoredUser = (): User | null => {
  if (typeof window === 'undefined') return null
  
  const userStr = localStorage.getItem(STORAGE_KEYS.USER)
  if (!userStr) return null
  
  try {
    return JSON.parse(userStr)
  } catch {
    return null
  }
}

export const getStoredToken = (): string | null => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
}

export const clearAuthStorage = (): void => {
  if (typeof window === 'undefined') return
  
  localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
  localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
  localStorage.removeItem(STORAGE_KEYS.USER)
}

export const getDashboardRoute = (role: UserRole): string => {
  return DASHBOARD_ROUTES[role] || '/dashboard/passenger'
}

export const getRolePermissions = (role: UserRole) => {
  const permissions = {
    admin: ['all'],
    bus_owner: ['manage_buses', 'manage_routes', 'view_bookings'],
    driver: ['view_trips', 'update_trip_status'],
    conductor: ['view_passengers', 'manage_boarding'],
    passenger: ['book_tickets', 'view_bookings']
  }
  
  return permissions[role] || permissions.passenger
}