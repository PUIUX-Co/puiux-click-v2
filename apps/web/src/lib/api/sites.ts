import { apiClient } from './client';

/**
 * Sites API Client
 * Handles all site-related API calls
 */

// Enums (matching Prisma schema)
export enum Industry {
  RESTAURANT = 'RESTAURANT',
  DENTAL = 'DENTAL',
  PORTFOLIO = 'PORTFOLIO',
  BUSINESS = 'BUSINESS',
  STORE = 'STORE',
}

export enum SiteStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

// Types
export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
}

export interface Site {
  id: string;
  name: string;
  slug: string;
  industry: Industry;
  templateId: string;
  businessName: string;
  description?: string;
  logo?: string;
  phone?: string;
  email?: string;
  address?: string;
  colorPalette: ColorPalette;
  pages: any;
  status: SiteStatus;
  publishedAt?: string;
  publishUrl?: string;
  viewCount: number;
  lastViewedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSiteDto {
  name: string;
  industry: Industry;
  businessName: string;
  description?: string;
  email?: string;
  phone?: string;
  address?: string;
  colorPalette: ColorPalette;
  selectedSections?: string[];
  templateId?: string;
}

export interface UpdateSiteDto {
  name?: string;
  industry?: Industry;
  businessName?: string;
  description?: string;
  email?: string;
  phone?: string;
  address?: string;
  colorPalette?: ColorPalette;
  status?: SiteStatus;
  pages?: any; // GrapesJS pages data (JSON structure)
}

export interface SiteStats {
  total: number;
  published: number;
  draft: number;
  archived: number;
  totalViews: number;
}

/**
 * Create a new site
 */
export async function createSite(data: CreateSiteDto): Promise<Site> {
  const response = await apiClient.post<{
    success: boolean;
    message: string;
    data: Site;
  }>('/sites', data);
  return response.data.data;
}

/**
 * Get all sites for authenticated user
 */
export async function getSites(): Promise<Site[]> {
  const response = await apiClient.get<{
    success: boolean;
    data: Site[];
    total: number;
  }>('/sites');
  return response.data.data;
}

/**
 * Get a single site by ID
 */
export async function getSite(id: string): Promise<Site> {
  const response = await apiClient.get<{
    success: boolean;
    data: Site;
  }>(`/sites/${id}`);
  return response.data.data;
}

/**
 * Update a site
 */
export async function updateSite(
  id: string,
  data: UpdateSiteDto,
): Promise<Site> {
  const response = await apiClient.patch<{
    success: boolean;
    message: string;
    data: Site;
  }>(`/sites/${id}`, data);
  return response.data.data;
}

/**
 * Publish a site
 */
export async function publishSite(id: string): Promise<Site> {
  const response = await apiClient.post<{
    success: boolean;
    message: string;
    data: Site;
  }>(`/sites/${id}/publish`);
  return response.data.data;
}

/**
 * Unpublish a site
 */
export async function unpublishSite(id: string): Promise<Site> {
  const response = await apiClient.post<{
    success: boolean;
    message: string;
    data: Site;
  }>(`/sites/${id}/unpublish`);
  return response.data.data;
}

/**
 * Delete a site
 */
export async function deleteSite(id: string): Promise<void> {
  await apiClient.delete(`/sites/${id}`);
}

/**
 * Get site statistics
 */
export async function getSiteStats(): Promise<SiteStats> {
  const response = await apiClient.get<{
    success: boolean;
    data: SiteStats;
  }>('/sites/stats');
  return response.data.data;
}

/**
 * Get a published site by slug (public)
 */
export async function getPublicSite(slug: string): Promise<Site> {
  const response = await apiClient.get<{
    success: boolean;
    data: Site;
  }>(`/sites/public/${slug}`);
  return response.data.data;
}
