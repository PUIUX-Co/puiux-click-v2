import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { SitesService } from './sites.service';
import { CreateSiteDto, UpdateSiteDto, SiteResponseDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../auth/decorators/public.decorator';

/**
 * Sites Controller
 * All endpoints are protected by JWT authentication
 * Multi-tenancy is enforced via organizationId from JWT payload
 */
@Controller('sites')
@UseGuards(JwtAuthGuard)
export class SitesController {
  constructor(private readonly sitesService: SitesService) {}

  /**
   * POST /api/sites
   * Create a new site
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Request() req,
    @Body() createSiteDto: CreateSiteDto,
  ): Promise<{
    success: boolean;
    message: string;
    data: SiteResponseDto;
  }> {
    const site = await this.sitesService.create(
      req.user.sub,
      req.user.organizationId,
      createSiteDto,
    );

    return {
      success: true,
      message: 'تم إنشاء الموقع بنجاح',
      data: site,
    };
  }

  /**
   * GET /api/sites
   * Get all sites for authenticated user's organization
   */
  @Get()
  async findAll(@Request() req): Promise<{
    success: boolean;
    data: SiteResponseDto[];
    total: number;
  }> {
    const sites = await this.sitesService.findAll(req.user.organizationId);

    return {
      success: true,
      data: sites,
      total: sites.length,
    };
  }

  /**
   * GET /api/sites/stats
   * Get site statistics for organization
   */
  @Get('stats')
  async getStats(@Request() req): Promise<{
    success: boolean;
    data: any;
  }> {
    const stats = await this.sitesService.getStats(req.user.organizationId);

    return {
      success: true,
      data: stats,
    };
  }

  /**
   * GET /api/sites/:id
   * Get a single site by ID
   */
  @Get(':id')
  async findOne(
    @Request() req,
    @Param('id') id: string,
  ): Promise<{
    success: boolean;
    data: SiteResponseDto;
  }> {
    const site = await this.sitesService.findOne(id, req.user.organizationId);

    return {
      success: true,
      data: site,
    };
  }

  /**
   * PATCH /api/sites/:id
   * Update a site
   */
  @Patch(':id')
  async update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateSiteDto: UpdateSiteDto,
  ): Promise<{
    success: boolean;
    message: string;
    data: SiteResponseDto;
  }> {
    const site = await this.sitesService.update(
      id,
      req.user.organizationId,
      updateSiteDto,
    );

    return {
      success: true,
      message: 'تم تحديث الموقع بنجاح',
      data: site,
    };
  }

  /**
   * POST /api/sites/:id/publish
   * Publish a site
   */
  @Post(':id/publish')
  @HttpCode(HttpStatus.OK)
  async publish(
    @Request() req,
    @Param('id') id: string,
  ): Promise<{
    success: boolean;
    message: string;
    data: SiteResponseDto;
  }> {
    const site = await this.sitesService.publish(id, req.user.organizationId);

    return {
      success: true,
      message: 'تم نشر الموقع بنجاح',
      data: site,
    };
  }

  /**
   * POST /api/sites/:id/unpublish
   * Unpublish a site
   */
  @Post(':id/unpublish')
  @HttpCode(HttpStatus.OK)
  async unpublish(
    @Request() req,
    @Param('id') id: string,
  ): Promise<{
    success: boolean;
    message: string;
    data: SiteResponseDto;
  }> {
    const site = await this.sitesService.unpublish(id, req.user.organizationId);

    return {
      success: true,
      message: 'تم إلغاء نشر الموقع بنجاح',
      data: site,
    };
  }

  /**
   * DELETE /api/sites/:id
   * Delete a site
   */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(
    @Request() req,
    @Param('id') id: string,
  ): Promise<{
    success: boolean;
    message: string;
  }> {
    await this.sitesService.remove(id, req.user.organizationId);

    return {
      success: true,
      message: 'تم حذف الموقع بنجاح',
    };
  }

  /**
   * GET /api/sites/public/:slug
   * Public endpoint to get a published site by slug
   */
  @Public()
  @Get('public/:slug')
  async findBySlug(
    @Param('slug') slug: string,
  ): Promise<{
    success: boolean;
    data: SiteResponseDto;
  }> {
    const site = await this.sitesService.findBySlug(slug);

    return {
      success: true,
      data: site,
    };
  }
}
