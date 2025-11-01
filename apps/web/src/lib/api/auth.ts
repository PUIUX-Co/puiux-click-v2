import apiClient from './client';
import { RegisterData, LoginData, AuthResponse, User } from '@/types/auth';

/**
 * Helper function to set access token cookie
 */
function setAccessTokenCookie(token: string) {
  if (typeof document !== 'undefined') {
    // Set cookie with 15 minutes expiration (same as access token lifetime)
    const expires = new Date();
    expires.setMinutes(expires.getMinutes() + 15);
    document.cookie = `accessToken=${token}; path=/; expires=${expires.toUTCString()}; SameSite=Strict`;
  }
}

/**
 * Helper function to clear access token cookie
 */
function clearAccessTokenCookie() {
  if (typeof document !== 'undefined') {
    document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Strict';
  }
}

/**
 * Auth API endpoints
 */
export const authApi = {
  /**
   * Register a new user
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);

    // Save access token and user to localStorage and cookie
    if (response.data.accessToken) {
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setAccessTokenCookie(response.data.accessToken);
    }

    return response.data;
  },

  /**
   * Login user
   */
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', data);

    // Save access token and user to localStorage and cookie
    if (response.data.accessToken) {
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setAccessTokenCookie(response.data.accessToken);
    }

    return response.data;
  },

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      // Always clear local storage and cookie
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      clearAccessTokenCookie();
    }
  },

  /**
   * Get current user
   */
  async getMe(): Promise<{ user: User }> {
    const response = await apiClient.post<{ user: User }>('/auth/me');

    // Update user in localStorage
    if (response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }

    return response.data;
  },

  /**
   * Refresh access token
   */
  async refresh(): Promise<{ accessToken: string; expiresIn: number }> {
    const response = await apiClient.post<{ accessToken: string; expiresIn: number }>(
      '/auth/refresh'
    );

    // Save new access token to localStorage and cookie
    if (response.data.accessToken) {
      localStorage.setItem('accessToken', response.data.accessToken);
      setAccessTokenCookie(response.data.accessToken);
    }

    return response.data;
  },
};

export default authApi;
