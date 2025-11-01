import { IsString, IsNotEmpty, IsOptional, IsEnum, IsObject } from 'class-validator';

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

export class GenerateSectionDto {
  @IsEnum(SectionType)
  @IsNotEmpty({ message: 'نوع القسم مطلوب' })
  sectionType: SectionType;

  @IsString()
  @IsNotEmpty({ message: 'السياق مطلوب' })
  context: string; // Business info, industry, etc.

  @IsString()
  @IsOptional()
  businessName?: string;

  @IsString()
  @IsOptional()
  industry?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsObject()
  @IsOptional()
  colorPalette?: {
    primary?: string;
    secondary?: string;
    accent?: string;
  };

  @IsString()
  @IsOptional()
  language?: string; // 'ar' or 'en', default 'ar'
}

/**
 * Generated Section Response
 */
export interface GeneratedSection {
  html: string;
  css: string;
  js?: string;
  sectionId: string;
  sectionType: SectionType;
}
