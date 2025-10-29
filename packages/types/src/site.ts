import type { Industry, SiteStatus } from './common';

/**
 * Site Types
 */

export interface Site {
  id: string;
  name: string;
  slug: string;
  organizationId: string;
  userId: string;
  industry: Industry;
  templateId: string;
  businessName: string;
  description?: string;
  logo?: string;
  phone?: string;
  email?: string;
  address?: string;
  colorPalette: ColorPalette;
  pages: Page[];
  status: SiteStatus;
  publishedAt?: Date;
  publishUrl?: string;
  viewCount: number;
  lastViewedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  foreground: string;
  muted: string;
}

export interface Page {
  id: string;
  name: string;
  slug: string;
  title: string;
  description?: string;
  sections: Section[];
  order: number;
}

export interface Section {
  id: string;
  type: SectionType;
  content: any;
  order: number;
}

export type SectionType =
  | 'hero'
  | 'about'
  | 'services'
  | 'features'
  | 'testimonials'
  | 'gallery'
  | 'contact'
  | 'pricing'
  | 'team'
  | 'faq'
  | 'cta';

export interface CreateSiteDto {
  industry: Industry;
  businessName: string;
  description?: string;
  phone?: string;
  email?: string;
  address?: string;
  colorPaletteId: string;
  logo?: File;
}

export interface UpdateSiteDto {
  name?: string;
  businessName?: string;
  description?: string;
  phone?: string;
  email?: string;
  address?: string;
  colorPaletteId?: string;
  logo?: File;
}

export interface PublishSiteDto {
  slug: string;
}

export interface SiteTemplate {
  id: string;
  industry: Industry;
  variant: number;
  name: string;
  description: string;
  thumbnail: string;
  structure: {
    pages: string[];
  };
  content: any;
  colorPalettes: ColorPalette[];
}
