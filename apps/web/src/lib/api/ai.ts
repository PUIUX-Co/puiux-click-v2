import { apiClient } from './client';

/**
 * AI API Client
 * Handles AI text generation and image search
 */

// Types
export enum AIProvider {
  CLAUDE = 'claude',
  OPENAI = 'openai',
}

export enum ContentType {
  HERO_TITLE = 'hero_title',
  HERO_SUBTITLE = 'hero_subtitle',
  ABOUT_SECTION = 'about_section',
  SERVICE_DESCRIPTION = 'service_description',
  PRODUCT_DESCRIPTION = 'product_description',
  CTA_TEXT = 'cta_text',
  TESTIMONIAL = 'testimonial',
  BLOG_POST = 'blog_post',
  CUSTOM = 'custom',
}

export interface GenerateTextDto {
  provider?: AIProvider;
  contentType: ContentType;
  context: string;
  currentContent?: string;
  tone?: string;
  maxLength?: number;
}

export interface GenerateTextResponse {
  content: string;
  provider: string;
}

export interface SearchImagesDto {
  query: string;
  perPage?: number;
  page?: number;
  orientation?: 'landscape' | 'portrait' | 'squarish';
  color?: string;
}

export interface UnsplashImage {
  id: string;
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  alt_description: string;
  description: string;
  width: number;
  height: number;
  color: string;
  user: {
    name: string;
    username: string;
    portfolio_url: string;
  };
  links: {
    download: string;
    download_location: string;
  };
}

export interface SearchImagesResponse {
  total: number;
  totalPages: number;
  results: UnsplashImage[];
}

/**
 * Generate text content using AI
 */
export async function generateText(data: GenerateTextDto): Promise<GenerateTextResponse> {
  const response = await apiClient.post<{
    success: boolean;
    data: GenerateTextResponse;
  }>('/ai/generate-text', data);
  return response.data.data;
}

/**
 * Search images from Unsplash
 */
export async function searchImages(params: SearchImagesDto): Promise<SearchImagesResponse> {
  const response = await apiClient.get<{
    success: boolean;
    data: SearchImagesResponse;
  }>('/ai/search-images', { params });
  return response.data.data;
}

/**
 * Get smart image suggestions for a section
 */
export async function suggestImagesForSection(
  industry: string,
  sectionType: string,
  context?: string,
): Promise<SearchImagesResponse> {
  const response = await apiClient.get<{
    success: boolean;
    data: SearchImagesResponse;
  }>(`/ai/suggest-images/${industry}/${sectionType}`, {
    params: context ? { context } : undefined,
  });
  return response.data.data;
}

/**
 * Trigger Unsplash download (required by Unsplash API)
 */
export async function triggerImageDownload(downloadLocation: string): Promise<void> {
  await apiClient.post('/ai/trigger-download', { downloadLocation });
}

// Section Generation Types
export enum SectionType {
  ABOUT = 'about',
  SERVICES = 'services',
  PRODUCTS = 'products',
  TEAM = 'team',
  TESTIMONIALS = 'testimonials',
  GALLERY = 'gallery',
  CONTACT = 'contact',
  FEATURES = 'features',
  HERO = 'hero',
}

export interface GenerateSectionDto {
  sectionType: SectionType;
  context: string;
  businessName?: string;
  industry?: string;
  description?: string;
  colorPalette?: {
    primary?: string;
    secondary?: string;
    accent?: string;
  };
  language?: string;
}

export interface GeneratedSection {
  html: string;
  css: string;
  js?: string;
  sectionId: string;
  sectionType: SectionType;
}

/**
 * Generate a complete section (HTML/CSS) that can be added to a page
 */
export async function generateSection(data: GenerateSectionDto): Promise<GeneratedSection> {
  const response = await apiClient.post<{
    success: boolean;
    data: GeneratedSection;
  }>('/ai/generate-section', data);
  return response.data.data;
}
