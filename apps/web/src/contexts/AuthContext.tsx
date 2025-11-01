'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { authApi } from '@/lib/api/auth';
import { User, RegisterData, LoginData, AuthContextType } from '@/types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  /**
   * Initialize auth state from localStorage
   */
  useEffect(() => {
    const initAuth = () => {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('accessToken');

      if (storedUser && token) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error('Failed to parse stored user:', error);
          localStorage.removeItem('user');
          localStorage.removeItem('accessToken');
        }
      }

      setLoading(false);
    };

    initAuth();
  }, []);

  /**
   * Refresh user data from server
   */
  const refreshUser = useCallback(async () => {
    try {
      const { user: freshUser } = await authApi.getMe();
      setUser(freshUser);
    } catch (error) {
      console.error('Failed to refresh user:', error);
      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
      // Clear cookie as well
      if (typeof document !== 'undefined') {
        document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Strict';
      }
    }
  }, []);

  /**
   * Register new user
   */
  const register = useCallback(
    async (data: RegisterData) => {
      try {
        const response = await authApi.register(data);
        setUser(response.user);
        toast.success(response.message || 'تم التسجيل بنجاح!', {
          icon: '🎉',
          duration: 4000,
        });
        
        // Get redirect parameter from URL if exists
        const urlParams = new URLSearchParams(window.location.search);
        const redirectPath = urlParams.get('redirect') || '/dashboard';
        
        // Use window.location for full page reload to ensure fresh state
        window.location.href = redirectPath;
      } catch (error: any) {
        const message =
          error.response?.data?.message ||
          'فشل التسجيل. يرجى المحاولة مرة أخرى.';
        toast.error(message, {
          icon: '❌',
          duration: 4000,
        });
        throw error;
      }
    },
    []
  );

  /**
   * Login user
   */
  const login = useCallback(
    async (data: LoginData) => {
      try {
        const response = await authApi.login(data);
        setUser(response.user);
        toast.success(response.message || 'مرحباً بك!', {
          icon: '👋',
          duration: 3000,
        });
        
        // Get redirect parameter from URL if exists
        const urlParams = new URLSearchParams(window.location.search);
        const redirectPath = urlParams.get('redirect') || '/dashboard';
        
        // Use window.location for full page reload to ensure fresh state
        window.location.href = redirectPath;
      } catch (error: any) {
        const message =
          error.response?.data?.message ||
          'فشل تسجيل الدخول. يرجى التحقق من بياناتك.';
        toast.error(message, {
          icon: '❌',
          duration: 4000,
        });
        throw error;
      }
    },
    []
  );

  /**
   * Logout user
   */
  const logout = useCallback(async () => {
    try {
      await authApi.logout();
      setUser(null);
      toast.success('تم تسجيل الخروج بنجاح', {
        icon: '👋',
        duration: 3000,
      });
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local state even if API call fails
      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
      router.push('/login');
    }
  }, [router]);

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    refreshUser,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to use auth context
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
