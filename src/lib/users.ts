import { apiClient } from './api-client';
import { API_ENDPOINTS, DEFAULT_PAGINATION } from './constants';
// Fix imports - use regular imports instead of type imports for enums
import {
  User,
  UsersResponse,
  UserStatistics,
  PendingVerifications,
  SearchUsersResult,
  UpdateUserStatusDto,
  UpdateUserRoleDto,
  BulkUserOperationDto,
  BulkOperationResult,
  UserRole, // Regular import
  UserStatus, // Regular import
  PaginationParams,
  ApiResponse,
} from './types';
export class UsersService {
  // Get all users with filters (Admin only)
async getUsers(
    params: PaginationParams & {
      role?: UserRole;
      status?: UserStatus;
      search?: string;
    } = {}
  ): Promise<UsersResponse> {
    const {
      page = DEFAULT_PAGINATION.PAGE,
      limit = DEFAULT_PAGINATION.LIMIT,
      role,
      status,
      search,
    } = params;

    const queryParams: Record<string, string> = {
      page: page.toString(),
      limit: limit.toString(),
    };

    if (role) queryParams.role = role;
    if (status) queryParams.status = status;
    if (search) queryParams.search = search;

    return apiClient.get<UsersResponse>(API_ENDPOINTS.USERS.BASE, queryParams);
  }


  // Get user by ID
  async getUserById(id: string): Promise<User> {
    return apiClient.get<User>(API_ENDPOINTS.USERS.BY_ID(id));
  }

  // Update user status
  async updateUserStatus(
    id: string,
    statusData: UpdateUserStatusDto
  ): Promise<ApiResponse<{ user: User }>> {
    return apiClient.patch<ApiResponse<{ user: User }>>(
      API_ENDPOINTS.USERS.UPDATE_STATUS(id),
      statusData
    );
  }

  // Update user role
  async updateUserRole(
    id: string,
    roleData: UpdateUserRoleDto
  ): Promise<ApiResponse<{ user: User }>> {
    return apiClient.patch<ApiResponse<{ user: User }>>(
      API_ENDPOINTS.USERS.UPDATE_ROLE(id),
      roleData
    );
  }

  // Delete user
  async deleteUser(id: string): Promise<ApiResponse> {
    return apiClient.delete<ApiResponse>(API_ENDPOINTS.USERS.BY_ID(id));
  }

  // Bulk operations
  async bulkUserOperation(operationData: BulkUserOperationDto): Promise<BulkOperationResult> {
    return apiClient.post<BulkOperationResult>(
      API_ENDPOINTS.USERS.BULK_OPERATION,
      operationData
    );
  }

  // Get user statistics
  async getUserStatistics(): Promise<UserStatistics> {
    return apiClient.get<UserStatistics>(API_ENDPOINTS.USERS.STATISTICS);
  }

  // Get pending verifications
  async getPendingVerifications(): Promise<PendingVerifications> {
    return apiClient.get<PendingVerifications>(API_ENDPOINTS.USERS.PENDING_VERIFICATIONS);
  }

  // Search users
  async searchUsers(query: string, limit?: number): Promise<SearchUsersResult> {
    const queryParams: Record<string, string> = { q: query };
    if (limit) queryParams.limit = limit.toString();

    return apiClient.get<SearchUsersResult>(API_ENDPOINTS.USERS.SEARCH, queryParams);
  }

  // Convenience methods for specific operations
  async activateUser(id: string, reason?: string): Promise<ApiResponse<{ user: User }>> {
    return this.updateUserStatus(id, { status: UserStatus.ACTIVE, reason });
  }

  async suspendUser(id: string, reason?: string): Promise<ApiResponse<{ user: User }>> {
    return this.updateUserStatus(id, { status: UserStatus.SUSPENDED, reason });
  }

  async setPendingUser(id: string, reason?: string): Promise<ApiResponse<{ user: User }>> {
    return this.updateUserStatus(id, { status: UserStatus.PENDING, reason });
  }

  // Bulk convenience methods
  async bulkActivateUsers(userIds: string[], reason?: string): Promise<BulkOperationResult> {
    return this.bulkUserOperation({
      userIds,
      operation: 'activate',
      reason,
    });
  }

  async bulkSuspendUsers(userIds: string[], reason?: string): Promise<BulkOperationResult> {
    return this.bulkUserOperation({
      userIds,
      operation: 'suspend',
      reason,
    });
  }

  async bulkChangeUserRoles(
    userIds: string[],
    newRole: UserRole,
    reason?: string
  ): Promise<BulkOperationResult> {
    return this.bulkUserOperation({
      userIds,
      operation: 'change_role',
      newRole,
      reason,
    });
  }

  async bulkDeleteUsers(userIds: string[], reason?: string): Promise<BulkOperationResult> {
    return this.bulkUserOperation({
      userIds,
      operation: 'delete',
      reason,
    });
  }

  // Utility methods
  getUserDisplayName(user: User): string {
    if (user.profile?.firstName && user.profile?.lastName) {
      return `${user.profile.firstName} ${user.profile.lastName}`;
    }
    return user.email;
  }

  formatUserRole(role: UserRole): string {
    const roleMap: Record<UserRole, string> = {
      [UserRole.ADMIN]: 'Administrator',
      [UserRole.BUS_OWNER]: 'Bus Owner',
      [UserRole.DRIVER]: 'Driver',
      [UserRole.CONDUCTOR]: 'Conductor',
      [UserRole.PASSENGER]: 'Passenger',
    };
    return roleMap[role] || role;
  }

  formatUserStatus(status: UserStatus): string {
    const statusMap: Record<UserStatus, string> = {
      [UserStatus.ACTIVE]: 'Active',
      [UserStatus.SUSPENDED]: 'Suspended',
      [UserStatus.PENDING]: 'Pending Approval',
    };
    return statusMap[status] || status;
  }

  getUserStatusColor(status: UserStatus): string {
    const colorMap: Record<UserStatus, string> = {
      [UserStatus.ACTIVE]: 'green',
      [UserStatus.SUSPENDED]: 'red',
      [UserStatus.PENDING]: 'yellow',
    };
    return colorMap[status] || 'gray';
  }

  getUserRoleColor(role: UserRole): string {
    const colorMap: Record<UserRole, string> = {
      [UserRole.ADMIN]: 'purple',
      [UserRole.BUS_OWNER]: 'blue',
      [UserRole.DRIVER]: 'green',
      [UserRole.CONDUCTOR]: 'orange',
      [UserRole.PASSENGER]: 'gray',
    };
    return colorMap[role] || 'gray';
  }

  isUserPendingVerification(user: User): boolean {
    return (
      !user.verification?.emailVerified ||
      !user.verification?.phoneVerified ||
      !user.verification?.documentsVerified
    );
  }

  getUserVerificationStatus(user: User): {
    email: boolean;
    phone: boolean;
    documents: boolean;
    overall: boolean;
  } {
    const email = user.verification?.emailVerified || false;
    const phone = user.verification?.phoneVerified || false;
    const documents = user.verification?.documentsVerified || false;
    const overall = email && phone && documents;

    return { email, phone, documents, overall };
  }

  canModifyUser(targetUser: User): boolean {
    // Cannot modify admin users
    return targetUser.role !== UserRole.ADMIN;
  }

  getUserJoinDate(user: User): string {
    return new Date(user.createdAt).toLocaleDateString('en-LK', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  // Filter users by criteria
  filterUsersByRole(users: User[], role: UserRole): User[] {
    return users.filter(user => user.role === role);
  }

  filterUsersByStatus(users: User[], status: UserStatus): User[] {
    return users.filter(user => user.status === status);
  }

  filterPendingVerificationUsers(users: User[]): User[] {
    return users.filter(user => this.isUserPendingVerification(user));
  }

  // Sort users
  sortUsersByName(users: User[]): User[] {
    return users.sort((a, b) => {
      const nameA = this.getUserDisplayName(a);
      const nameB = this.getUserDisplayName(b);
      return nameA.localeCompare(nameB);
    });
  }

  sortUsersByJoinDate(users: User[], ascending = false): User[] {
    return users.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return ascending ? dateA - dateB : dateB - dateA;
    });
  }
}

export const usersService = new UsersService();