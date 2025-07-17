// src/constants/index.ts
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

export const USER_ROLES = {
  ADMIN: 'admin',
  BUS_OWNER: 'bus_owner', 
  DRIVER: 'driver',
  CONDUCTOR: 'conductor',
  PASSENGER: 'passenger'
} as const

export const ROLE_LABELS = {
  admin: 'System Administrator',
  bus_owner: 'Bus Owner',
  driver: 'Driver', 
  conductor: 'Conductor',
  passenger: 'Passenger'
} as const

export const DASHBOARD_ROUTES = {
  admin: '/dashboard/admin',
  bus_owner: '/dashboard/bus-owner',
  driver: '/dashboard/driver',
  conductor: '/dashboard/conductor', 
  passenger: '/dashboard/passenger'
} as const

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user'
} as const