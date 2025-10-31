import {
  IsString,
  IsEmail,
  IsOptional,
  IsEnum,
  IsObject,
  ValidateNested,
  IsNotEmpty,
  MaxLength,
  MinLength,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Industry } from '@prisma/client';

/**
 * DTO for creating a new site
 * Validates all required fields with professional constraints
 */

class ColorPaletteDto {
  @IsString()
  @Matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
    message: 'اللون الأساسي يجب أن يكون بصيغة HEX صحيحة',
  })
  primary: string;

  @IsString()
  @Matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
    message: 'اللون الثانوي يجب أن يكون بصيغة HEX صحيحة',
  })
  secondary: string;

  @IsString()
  @Matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
    message: 'اللون المميز يجب أن يكون بصيغة HEX صحيحة',
  })
  accent: string;
}

export class CreateSiteDto {
  @IsString()
  @IsNotEmpty({ message: 'اسم الموقع مطلوب' })
  @MinLength(2, { message: 'اسم الموقع يجب أن يكون على الأقل حرفين' })
  @MaxLength(100, { message: 'اسم الموقع يجب ألا يتجاوز 100 حرف' })
  name: string;

  @IsEnum(Industry, { message: 'نوع النشاط غير صحيح' })
  industry: Industry;

  @IsString()
  @IsNotEmpty({ message: 'اسم النشاط التجاري مطلوب' })
  @MinLength(2, { message: 'اسم النشاط يجب أن يكون على الأقل حرفين' })
  @MaxLength(200, { message: 'اسم النشاط يجب ألا يتجاوز 200 حرف' })
  businessName: string;

  @IsString()
  @IsOptional()
  @MaxLength(1000, { message: 'الوصف يجب ألا يتجاوز 1000 حرف' })
  description?: string;

  @IsEmail({}, { message: 'البريد الإلكتروني غير صحيح' })
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  @Matches(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/, {
    message: 'رقم الهاتف غير صحيح',
  })
  phone?: string;

  @IsString()
  @IsOptional()
  @MaxLength(500, { message: 'العنوان يجب ألا يتجاوز 500 حرف' })
  address?: string;

  @IsObject()
  @ValidateNested()
  @Type(() => ColorPaletteDto)
  colorPalette: ColorPaletteDto;

  @IsString()
  @IsOptional()
  templateId?: string; // Will be assigned based on industry if not provided
}
