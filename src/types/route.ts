
// src/types/route.ts
export interface Route {
  _id: string
  routeName: string
  origin: LocationPoint
  destination: LocationPoint
  intermediateStops: IntermediateStop[]
  totalDistance: number
  estimatedDuration: number
  isActive: boolean
  createdBy: string
  createdAt: string
}

export interface LocationPoint {
  city: string
  station: string
  coordinates: [number, number]
}

export interface IntermediateStop extends LocationPoint {
  arrivalTime: string
  departureTime: string
  distanceFromOrigin: number
  fareFromOrigin: number
}

export interface BusRouteAssignment {
  _id: string
  busId: string
  routeId: string
  schedule: {
    departureTime: string
    arrivalTime: string
    frequency: 'daily' | 'weekly' | 'custom'
    operatingDays: number[]
    effectiveFrom: string
    effectiveTo: string
  }
  pricing: {
    baseFare: number
    farePerKm: number
    dynamicPricing: boolean
    peakHourMultiplier: number
  }
  driverAssignment: {
    primaryDriver?: string
    secondaryDriver?: string
    conductor?: string
  }
  status: 'active' | 'suspended'
  createdAt: string
}
