import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsObject,
  ValidateNested,
  IsOptional,
  IsArray,
  ArrayMinSize,
  ArrayMaxSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Industry } from '@prisma/client';

/**
 * Color Palette DTO
 */
class ColorPaletteDto {
  @IsString()
  @IsNotEmpty()
  primary: string;

  @IsString()
  @IsNotEmpty()
  secondary: string;

  @IsString()
  @IsNotEmpty()
  accent: string;
}

/**
 * Contact Information DTO
 */
class ContactInfoDto {
  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  whatsapp?: string;

  @IsString()
  @IsOptional()
  facebook?: string;

  @IsString()
  @IsOptional()
  instagram?: string;
}

/**
 * Generate Initial Site DTO
 * Used to generate a complete website with AI based on wizard data
 */
export class GenerateInitialSiteDto {
  @IsEnum(Industry)
  industry: Industry;

  @IsString()
  @IsNotEmpty()
  businessName: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsObject()
  @ValidateNested()
  @Type(() => ColorPaletteDto)
  colorPalette: ColorPaletteDto;

  @IsObject()
  @ValidateNested()
  @Type(() => ContactInfoDto)
  @IsOptional()
  contactInfo?: ContactInfoDto;

  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(3, { message: 'يجب اختيار 3 أقسام على الأقل' })
  @ArrayMaxSize(5, { message: 'يمكنك اختيار 5 أقسام كحد أقصى' })
  @IsOptional()
  selectedSections?: string[]; // e.g. ['hero', 'about', 'menu', 'contact']

  @IsString()
  @IsOptional()
  language?: string; // 'ar' or 'en'
}

/**
 * Generated Website Response
 */
export interface GeneratedWebsite {
  html: string;
  css: string;
  js?: string;
  sections: {
    id: string;
    type: string;
    title: string;
    order: number;
  }[];
}

/**
 * GrapesJS Page Format
 * Compatible with GrapesJS editor
 */
export interface GrapesJSPage {
  id: string;
  name: string;
  frames: Array<{
    component: {
      type: string;
      components: any[];
      styles?: string;
    };
  }>;
  styles: Array<{
    selectors: string[];
    style: Record<string, string>;
  }>;
}
