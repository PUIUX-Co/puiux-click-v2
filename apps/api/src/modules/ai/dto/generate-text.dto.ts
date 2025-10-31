import { IsString, IsNotEmpty, IsOptional, IsEnum, IsNumber, Min, Max } from 'class-validator';

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

export class GenerateTextDto {
  @IsEnum(AIProvider)
  @IsOptional()
  provider?: AIProvider = AIProvider.CLAUDE;

  @IsEnum(ContentType)
  contentType: ContentType;

  @IsString()
  @IsNotEmpty({ message: 'السياق مطلوب' })
  context: string; // Business info, industry, etc.

  @IsString()
  @IsOptional()
  currentContent?: string; // Current text to improve/expand

  @IsString()
  @IsOptional()
  tone?: string; // professional, friendly, formal, casual

  @IsNumber()
  @Min(50)
  @Max(2000)
  @IsOptional()
  maxLength?: number = 500;
}
