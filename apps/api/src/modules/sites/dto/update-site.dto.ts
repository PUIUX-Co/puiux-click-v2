import { PartialType } from '@nestjs/mapped-types';
import { CreateSiteDto } from './create-site.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { SiteStatus } from '@prisma/client';

/**
 * DTO for updating a site
 * All fields are optional - uses PartialType from CreateSiteDto
 */
export class UpdateSiteDto extends PartialType(CreateSiteDto) {
  @IsEnum(SiteStatus, { message: 'حالة الموقع غير صحيحة' })
  @IsOptional()
  status?: SiteStatus;
}
