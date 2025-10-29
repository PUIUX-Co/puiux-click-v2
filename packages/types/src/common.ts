/**
 * Common Types
 */

export type Locale = 'ar' | 'en';

export type Industry = 'restaurant' | 'dental' | 'portfolio' | 'business' | 'store';

export type Plan = 'FREE' | 'STARTER' | 'PRO' | 'BUSINESS';

export type SiteStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export type UserRole = 'USER' | 'ADMIN' | 'SUPER_ADMIN';

export interface LocalizedString {
  ar: string;
  en: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

export interface ApiError {
  statusCode: number;
  message: string;
  error: string;
  timestamp: string;
  path: string;
}
