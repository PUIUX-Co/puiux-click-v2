import { Industry, SiteStatus } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';

/**
 * DTO for Site response
 * Controls what data is exposed to clients
 */
export class SiteResponseDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  slug: string;

  @Expose()
  industry: Industry;

  @Expose()
  templateId: string;

  @Expose()
  businessName: string;

  @Expose()
  description?: string;

  @Expose()
  logo?: string;

  @Expose()
  phone?: string;

  @Expose()
  email?: string;

  @Expose()
  address?: string;

  @Expose()
  colorPalette: {
    primary: string;
    secondary: string;
    accent: string;
  };

  @Expose()
  pages: any; // JSON structure

  @Expose()
  status: SiteStatus;

  @Expose()
  publishedAt?: Date;

  @Expose()
  publishUrl?: string;

  @Expose()
  viewCount: number;

  @Expose()
  lastViewedAt?: Date;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  // Exclude sensitive fields (if any)
  @Exclude()
  organizationId: string;

  @Exclude()
  userId: string;

  constructor(partial: Partial<SiteResponseDto>) {
    Object.assign(this, partial);
  }
}
