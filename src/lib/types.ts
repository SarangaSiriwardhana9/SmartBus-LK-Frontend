/* eslint-disable @typescript-eslint/no-explicit-any */
export enum UserRole {
  ADMIN = 'admin',
  BUS_OWNER = 'bus_owner',
  DRIVER = 'driver',
  CONDUCTOR = 'conductor',
  PASSENGER = 'passenger',
}

export enum UserStatus {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  PENDING = 'pending',
}

export enum BookingStatus {
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
  NO_SHOW = 'no-show',
}

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

export enum TripStatus {
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'in-progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum BusType {
  AC = 'ac',
  NON_AC = 'non-ac',
  SEMI_LUXURY = 'semi-luxury',
  LUXURY = 'luxury',
}

export enum BusStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  MAINTENANCE = 'maintenance',
  PENDING = 'pending',
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

// Upload related enums (regular exports)
export enum FileType {
  IMAGE = 'image',
  DOCUMENT = 'document',
  PROFILE_PICTURE = 'profile_picture',
}

export enum DocumentType {
  INSURANCE = 'insurance',
  LICENSE = 'license',
  PERMIT = 'permit',
  FITNESS_CERTIFICATE = 'fitness_certificate',
  OTHER = 'other',
}

export enum VerificationStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

// Constants (regular export, not type)
export const FILE_CONSTRAINTS = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'] as const,
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'image/jpeg', 'image/png'] as const,
  MAX_FILES_PER_UPLOAD: 10,
  MAX_BUS_IMAGES: 5,
  MAX_BUS_DOCUMENTS: 5,
} as const;

// Base interfaces
export interface ApiResponse<T = any> {
  message: string;
  data?: T;
  error?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginationResponse {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// User interfaces
export interface UserProfile {
  firstName: string;
  lastName: string;
  phone: string;
  dateOfBirth?: string;
  gender?: Gender;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  profilePicture?: string;
}

export interface User {
  _id: string;
  email: string;
  role: UserRole;
  profile: UserProfile;
  status: UserStatus;
  verification: {
    emailVerified: boolean;
    phoneVerified: boolean;
    documentsVerified: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

// Auth interfaces
export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  role: UserRole;
  profile: UserProfile;
}

export interface AuthResponse {
  message: string;
  user: User;
  accessToken: string;
  refreshToken: string;
}

// Location interfaces
export interface Location {
  city: string;
  station: string;
  coordinates: [number, number];  
}

export interface IntermediateStop extends Location {
  arrivalTime: string;
  departureTime: string;
  distanceFromOrigin: number;
  fareFromOrigin: number;
}

// Bus interfaces
export interface BusSpecifications {
  totalSeats: number;
  busType: BusType;
  facilities: string[];
}

export interface SeatConfiguration {
  layoutType: string;
  seatMap: SeatMapItem[];
  totalRows: number;
  seatsPerRow: number;
  aislePosition: number;
}

export interface SeatMapItem {
  seatNumber: string;
  position: { row: number; column: number };
  type: 'regular' | 'vip' | 'ladies';
  isActive: boolean;
  priceMultiplier: number;
}

export interface BusDetails {
  make: string;
  model: string;
  year: number;
  engineNumber: string;
  chassisNumber: string;
}

export interface CreateBusDto {
  registrationNumber: string;
  busDetails: BusDetails;
  specifications: BusSpecifications;
  seatConfiguration?: SeatConfiguration;
  documents?: string[];
  images?: string[];
}

export interface UpdateBusDto extends Partial<CreateBusDto> {
  status?: BusStatus;
  rejectionReason?: string;
}

 
export interface Bus {
  _id: string;
  ownerId: string;
  registrationNumber: string;
  busDetails: BusDetails;
  specifications: BusSpecifications;
  seatConfiguration: SeatConfiguration;
  documents: string[];
  images: string[];
  status: BusStatus; // Use BusStatus enum consistently
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

// Bus Owner Profile interfaces
export interface BusOwnerProfile {
  _id: string;
  userId: string;
  businessName: string;
  businessLicense: string;
  taxId: string;
  bankDetails: {
    bankName: string;
    accountNumber: string;
    accountHolderName: string;
    branchCode?: string;
  };
  documents: string[];
  verificationStatus: VerificationStatus;
  approvedBy?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBusOwnerProfileDto {
  businessName: string;
  businessLicense: string;
  taxId: string;
  bankDetails: {
    bankName: string;
    accountNumber: string;
    accountHolderName: string;
    branchCode?: string;
  };
  documents?: string[];
}

// Route interfaces
export interface Route {
  _id: string;
  routeName: string;
  origin: Location;
  destination: Location;
  intermediateStops: IntermediateStop[];
  totalDistance: number;
  estimatedDuration: number;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
}

export interface CreateRouteDto {
  routeName: string;
  origin: Location;
  destination: Location;
  intermediateStops?: IntermediateStop[];
  totalDistance: number;
  estimatedDuration: number;
}

export interface UpdateRouteDto extends Partial<CreateRouteDto> {
  isActive?: boolean;
}

// Bus Route interfaces
export interface BusRouteSchedule {
  departureTime: string;
  arrivalTime: string;
  frequency: 'daily' | 'weekly' | 'custom';
  operatingDays: number[];
  effectiveFrom: string;
  effectiveTo: string;
}

export interface BusRoutePricing {
  baseFare: number;
  farePerKm: number;
  dynamicPricing: boolean;
  peakHourMultiplier: number;
}

export interface DriverAssignment {
  primaryDriver?: string;
  secondaryDriver?: string;
  conductor?: string;
}

export interface CreateBusRouteDto {
  busId: string;
  routeId: string;
  schedule: BusRouteSchedule;
  pricing: BusRoutePricing;
  driverAssignment?: DriverAssignment;
  specialNotes?: string;
}

export interface UpdateBusRouteDto extends Partial<CreateBusRouteDto> {
  status?: 'active' | 'suspended';
}

export interface BusRoute {
  _id: string;
  busId: string;
  routeId: string;
  schedule: BusRouteSchedule;
  pricing: BusRoutePricing;
  driverAssignment: DriverAssignment;
  status: 'active' | 'suspended';
  specialNotes?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// Trip interfaces
export interface SeatAvailability {
  seatNumber: string;
  isBooked: boolean;
  bookingId?: string;
}

export interface TripMetrics {
  totalRevenue: number;
  totalPassengers: number;
  occupancyRate: number;
  onTimePerformance: boolean;
}

export interface Trip {
  _id: string;
  busRouteId: string;
  tripDate: string;
  tripStatus: TripStatus;
  actualDeparture?: string;
  actualArrival?: string;
  currentLocation?: {
    coordinates: [number, number];
    lastUpdated: string;
    speed: number;
    nextStop: string;
  };
  seatAvailability: SeatAvailability[];
  tripMetrics?: TripMetrics;
  createdAt: string;
  updatedAt: string;
}

export interface PopulatedTrip extends Omit<Trip, 'busRouteId'> {
  busRouteId: BusRoute & {
    busId: Bus;
    routeId: Route;
  };
}

// Booking interfaces
export interface SeatDetail {
  seatNumber: string;
  passengerName: string;
  passengerAge: number;
  passengerGender: Gender;
  isBoarded?: boolean;
}

export interface JourneyDetails {
  boardingPoint: string;
  droppingPoint: string;
  journeyDate: string;
  journeyTime: string;
}

export interface PricingDetails {
  baseFare: number;
  taxes: number;
  discount: number;
  totalAmount: number;
  priceMultiplier?: number;
}

export interface PaymentDetails {
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  transactionId?: string;
  paidAt?: string;
  refundedAt?: string;
  refundAmount?: number;
}

export interface Booking {
  _id: string;
  bookingReference: string;
  passengerId: string;
  tripId: string;
  seatDetails: SeatDetail[];
  journeyDetails: JourneyDetails;
  pricing: PricingDetails;
  paymentDetails: PaymentDetails;
  status: BookingStatus;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
}

// DTOs for API calls
export interface CreateTripDto {
  busRouteId: string;
  tripDate: string;
  tripStatus?: TripStatus;
}

export interface SearchTripsDto {
  originCity: string;
  destinationCity: string;
  journeyDate: string;
  journeyTime?: string;
  busType?: BusType;
  passengerCount?: number;
}

export interface CreateBookingDto {
  tripId: string;
  seatDetails: Omit<SeatDetail, 'isBoarded'>[];
  journeyDetails: JourneyDetails;
  paymentDetails: Omit<PaymentDetails, 'paymentStatus' | 'paidAt'>;
}

export interface ModifyBookingDto {
  newSeatDetails?: Omit<SeatDetail, 'isBoarded'>[];
  newBoardingPoint?: string;
  newDroppingPoint?: string;
  reason?: string;
}

export interface BookingReviewDto {
  overallRating: number;
  reviewText?: string;
  busConditionRating?: number;
  driverBehaviorRating?: number;
  punctualityRating?: number;
  comfortRating?: number;
  valueForMoneyRating?: number;
  suggestions?: string;
}

// Upload related types
export interface FileUploadDto {
  fileType: FileType;
  entityId?: string;
  documentType?: DocumentType;
  description?: string;
}

export interface UploadedFileInfo {
  id: string;
  originalName: string;
  size: number;
  type: string;
  url: string;
  uploadedAt: Date;
}

export interface SingleUploadResult {
  message: string;
  file: UploadedFileInfo;
}

export interface MultipleUploadResult {
  message: string;
  files: UploadedFileInfo[];
}

export interface EntityFile {
  type: string;
  filename: string;
  url: string;
}

export interface EntityFilesResult {
  files: EntityFile[];
}

export interface DeleteResult {
  message: string;
}

// User management types
export interface UpdateUserStatusDto {
  status: UserStatus;
  reason?: string;
}

export interface UpdateUserRoleDto {
  role: UserRole;
  reason?: string;
}

export interface BulkUserOperationDto {
  userIds: string[];
  operation: 'activate' | 'suspend' | 'change_role' | 'delete';
  newRole?: UserRole;
  reason?: string;
}

export interface UserStatistics {
  totalUsers: number;
  usersByRole: Array<{ _id: UserRole; count: number }>;
  usersByStatus: Array<{ _id: UserStatus; count: number }>;
  recentRegistrations: number;
}

export interface PendingVerifications {
  users: User[];
  count: number;
}

export interface SearchUsersResult {
  users: User[];
  count: number;
}

export interface UsersResponse {
  users: User[];
  pagination: PaginationResponse;
}

export interface BulkOperationResult {
  message: string;
  affectedCount: number;
  reason?: string;
}

// Response interfaces
export interface SearchTripsResponse {
  trips: PopulatedTrip[];
  count: number;
  searchCriteria: SearchTripsDto;
}

export interface BookingsResponse {
  bookings: Booking[];
  pagination: PaginationResponse;
}

export interface SeatAvailabilityResponse {
  tripId: string;
  seatAvailability: SeatAvailability[];
  seatConfiguration: SeatConfiguration;
  totalSeats: number;
}

export interface TicketResponse {
  message: string;
  ticket: {
    bookingReference: string;
    passenger: string;
    journey: JourneyDetails;
    seats: SeatDetail[];
    pricing: PricingDetails;
    qrCode: string;
  };
}

export interface BusesResponse {
  buses: Bus[];
  pagination: PaginationResponse;
}

export interface RoutesResponse {
  routes: Route[];
  pagination: PaginationResponse;
}

export interface BusRoutesResponse {
  busRoutes: BusRoute[];
  pagination: PaginationResponse;
}

export interface PopularRoutesResponse {
  routes: (Route & { busCount: number })[];
  message: string;
}

export interface SearchRoutesResponse {
  routes: Route[];
  count: number;
}

export interface SeatMapResponse {
  seatConfiguration: SeatConfiguration;
  totalSeats: number;
}



export enum DateRange {
  TODAY = 'today',
  WEEK = 'week',
  MONTH = 'month',
  YEAR = 'year',
  CUSTOM = 'custom',
}

export interface DashboardFilterDto {
  dateRange?: DateRange;
  startDate?: string;
  endDate?: string;
  limit?: number;
}

// Dashboard Response Types
export interface AdminDashboardOverview {
  totalUsers: number;
  totalBuses: number;
  totalRoutes: number;
  totalBookings: number;
}

export interface PendingApprovals {
  busOwners: number;
  buses: number;
  total: number;
}

export interface RevenueDataPoint {
  _id: {
    year: number;
    month: number;
    day?: number;
  };
  totalRevenue: number;
  totalBookings: number;
}

export interface RevenueData {
  dailyRevenue: RevenueDataPoint[];
  totalRevenue: number;
}

export interface TopRoute {
  _id: string;
  routeName: string;
  origin: Location;
  destination: Location;
  totalBookings: number;
  totalRevenue: number;
}

export interface SystemStats {
  usersByRole: Array<{ _id: UserRole; count: number }>;
  busesByStatus: Array<{ _id: BusStatus; count: number }>;
  bookingsByStatus: Array<{ _id: BookingStatus; count: number }>;
}

export interface AdminDashboardResponse {
  overview: AdminDashboardOverview;
  pendingApprovals: PendingApprovals;
  recentUsers: User[];
  revenueData: RevenueData;
  topRoutes: TopRoute[];
  systemStats: SystemStats;
}

// Bus Owner Dashboard Types
export interface FleetOverview {
  total: number;
  active: number;
  maintenance: number;
  pendingApproval: number;
}

export interface TodaysTrip {
  _id: string;
  busRouteId: {
    _id: string;
    routeId: Route;
    busId: Bus;
    schedule: BusRouteSchedule;
  };
  tripDate: string;
  tripStatus: TripStatus;
}

export interface BusPerformanceMetric {
  _id: string;
  busRegistration: string;
  totalBookings: number;
  totalRevenue: number;
  totalSeats: number;
  occupancyRate: number;
}

export interface BusOwnerDashboardResponse {
  fleetOverview: FleetOverview;
  todaysTrips: TodaysTrip[];
  recentBookings: Booking[];
  revenueData: RevenueDataPoint[];
  busPerformance: BusPerformanceMetric[];
}

// Passenger Dashboard Types
export interface BookingHistorySummary {
  total: number;
  confirmed: number;
  cancelled: number;
  completed: number;
}

export interface FavoriteRoute {
  _id: string;
  routeName: string;
  origin: Location;
  destination: Location;
  bookingCount: number;
}

export interface PassengerDashboardResponse {
  upcomingTrips: Booking[];
  recentBookings: Booking[];
  bookingHistory: BookingHistorySummary;
  favoriteRoutes: FavoriteRoute[];
}

// Driver Dashboard Types
export interface DriverAssignment {
  _id: string;
  busId: {
    registrationNumber: string;
    specifications: BusSpecifications;
  };
  routeId: Route;
}

export interface DriverStats {
  totalTrips: number;
  completedTrips: number;
  thisMonthTrips: number;
  completionRate: number;
}

export interface DriverDashboardResponse {
  todaysAssignments: DriverAssignment[];
  upcomingTrips: TodaysTrip[];
  completedTrips: TodaysTrip[];
  driverStats: DriverStats;
}

// Conductor Dashboard Types
export interface PassengerManifest {
  trips: TodaysTrip[];
  bookings: Booking[];
  totalPassengers: number;
}

export interface CollectionSummary {
  totalCollection: number;
  thisMonthCollection: number;
}

export interface ConductorStats {
  totalTrips: number;
  totalPassengers: number;
  thisMonthPassengers: number;
}

export interface ConductorDashboardResponse {
  todaysAssignments: DriverAssignment[];
  passengerManifests: PassengerManifest;
  collectionSummary: CollectionSummary;
  conductorStats: ConductorStats;
}

// Analytics Types
export enum ReportPeriod {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
  CUSTOM = 'custom',
}

export interface ReportFilterDto {
  period?: ReportPeriod;
  startDate?: string;
  endDate?: string;
  busOwnerId?: string;
}

export interface RevenueSummary {
  totalRevenue: number;
  totalBookings: number;
  totalTaxes: number;
  totalDiscounts: number;
  averageBookingValue: number;
}

export interface RevenueReportResponse {
  revenueData: RevenueDataPoint[];
  totalSummary: RevenueSummary;
  period: ReportPeriod;
}

export interface BookingTrend {
  _id: {
    year: number;
    month?: number;
    day?: number;
    week?: number;
  };
  totalBookings: number;
  confirmedBookings: number;
  cancelledBookings: number;
}

export interface PeakTime {
  _id: {
    hour: number;
    dayOfWeek: number;
  };
  bookingCount: number;
}

export interface CancellationAnalysis {
  cancellationData: Array<{ _id: BookingStatus; count: number }>;
  cancellationRate: number;
}

export interface BookingAnalyticsResponse {
  bookingTrends: BookingTrend[];
  topRoutes: TopRoute[];
  peakTimes: PeakTime[];
  cancellationAnalysis: CancellationAnalysis;
  bookingsByStatus: Array<{ _id: BookingStatus; count: number; totalAmount: number }>;
}

export interface BusPerformanceReport {
  _id: string;
  busRegistration: string;
  busType: BusType;
  totalSeats: number;
  totalBookings: number;
  totalRevenue: number;
  totalPassengers: number;
  tripCount: number;
  occupancyRate: number;
  revenuePerTrip: number;
}

export interface BusPerformanceReportResponse {
  busPerformance: BusPerformanceReport[];
  totalBuses: number;
}

export interface OccupancyData {
  _id: string;
  routeName: string;
  averageOccupancy: number;
  totalTrips: number;
  totalBookedSeats: number;
  totalAvailableSeats: number;
}

export interface OccupancyAnalysisResponse {
  occupancyData: OccupancyData[];
  overallOccupancy: number;
}

export interface RevenueByPaymentMethod {
  _id: string;
  totalRevenue: number;
  bookingCount: number;
}

export interface MonthlyRevenueTrend {
  _id: {
    year: number;
    month: number;
  };
  totalRevenue: number;
  bookingCount: number;
}

export interface FinancialSummaryResponse {
  totalRevenue: number;
  totalTaxes: number;
  totalDiscounts: number;
  netRevenue: number;
  revenueByPaymentMethod: RevenueByPaymentMethod[];
  monthlyTrends: MonthlyRevenueTrend[];
}