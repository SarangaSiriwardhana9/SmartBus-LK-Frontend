// src/types/bus.ts
export interface BusOwnerProfile {
  _id: string
  userId: string
  businessName: string
  businessLicense: string
  taxId: string
  bankDetails: {
    bankName: string
    accountNumber: string
    accountHolderName: string
    branchCode: string
  }
  documents: string[]
  verificationStatus: 'pending' | 'approved' | 'rejected'
  approvedBy?: string
  createdAt: string
}

export interface Bus {
  _id: string
  ownerId: string
  registrationNumber: string
  busDetails: {
    make: string
    model: string
    year: number
    engineNumber: string
    chassisNumber: string
  }
  specifications: {
    totalSeats: number
    busType: 'ac' | 'non-ac' | 'semi-luxury' | 'luxury'
    facilities: string[]
  }
  seatConfiguration: {
    layoutType: string
    seatMap: SeatMapItem[]
    totalRows: number
    seatsPerRow: number
    aislePosition: number
  }
  documents: string[]
  images: string[]
  status: 'active' | 'inactive' | 'maintenance'
  createdAt: string
  updatedAt: string
}

export interface SeatMapItem {
  seatNumber: string
  position: { row: number; column: number }
  type: 'regular' | 'vip' | 'ladies'
  isActive: boolean
  priceMultiplier: number
}

 
