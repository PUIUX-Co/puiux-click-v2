import apiClient from './client';
import { RegisterData, LoginData, AuthResponse, User } from '@/types/auth';

/**
 * Auth API endpoints
 */
export const authApi = {
  /**
   * Register a new user
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);

    // Save access token and user to localStorage
    if (response.data.accessToken) {
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }

    return response.data;
  },

  /**
   * Login user
   */
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', data);

    // Save access token and user to localStorage
    if (response.data.accessToken) {
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));
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
      // Always clear local storage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
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

    // Save new access token
    if (response.data.accessToken) {
      localStorage.setItem('accessToken', response.data.accessToken);
    }

    return response.data;
  },
};

export default authApi;
