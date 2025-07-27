import { apiClient } from './api-client';
import { API_ENDPOINTS, STORAGE_KEYS } from './constants';
import type { 
  LoginDto, 
  RegisterDto, 
  AuthResponse, 
  User, 
  ApiResponse 
} from './types';

export class AuthService {
  // Authentication methods
  async register(data: RegisterDto): Promise<ApiResponse<{ user: User }>> {
    const response = await apiClient.post<ApiResponse<{ user: User }>>(
      API_ENDPOINTS.AUTH.REGISTER,
      data
    );
    return response;
  }

  async login(data: LoginDto): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      data
    );
    
    // Store tokens and user data
    if (response.accessToken) {
      this.setTokens(response.accessToken, response.refreshToken);
      this.setUser(response.user);
    }
    
    return response;
  }

  async logout(): Promise<ApiResponse> {
    try {
      const response = await apiClient.post<ApiResponse>(API_ENDPOINTS.AUTH.LOGOUT);
      this.clearAuth();
      return response;
    } catch (error) {
      // Clear local storage even if API call fails
      this.clearAuth();
      throw error;
    }
  }

  async getProfile(): Promise<User> {
    const response = await apiClient.get<User>(API_ENDPOINTS.AUTH.PROFILE);
    return response;
  }

  async getCurrentUser(): Promise<{ user: User; message: string }> {
    const response = await apiClient.get<{ user: User; message: string }>(
      API_ENDPOINTS.AUTH.ME
    );
    return response;
  }

  async forgotPassword(email: string): Promise<ApiResponse> {
    return apiClient.post<ApiResponse>(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
  }

  async resetPassword(token: string, password: string): Promise<ApiResponse> {
    return apiClient.post<ApiResponse>(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
      token,
      password,
    });
  }

  async verifyEmail(token: string): Promise<ApiResponse> {
    return apiClient.post<ApiResponse>(API_ENDPOINTS.AUTH.VERIFY_EMAIL, { token });
  }

  async verifyPhone(phone: string, code: string): Promise<ApiResponse> {
    return apiClient.post<ApiResponse>(API_ENDPOINTS.AUTH.VERIFY_PHONE, {
      phone,
      code,
    });
  }

  // Token management
  setTokens(accessToken: string, refreshToken: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
  }

  getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  }

  getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  }

  // User management
  setUser(user: User): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  }

  getUser(): User | null {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem(STORAGE_KEYS.USER);
    return userStr ? JSON.parse(userStr) : null;
  }

  clearAuth(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
  }

  // Auth state checks
  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  hasRole(role: string): boolean {
    const user = this.getUser();
    return user?.role === role;
  }

  hasAnyRole(roles: string[]): boolean {
    const user = this.getUser();
    return user ? roles.includes(user.role) : false;
  }
}

export const authService = new AuthService();