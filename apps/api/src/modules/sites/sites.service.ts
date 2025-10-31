import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateSiteDto, UpdateSiteDto, SiteResponseDto } from './dto';
import { Industry, SiteStatus, Site } from '@prisma/client';
import { plainToInstance } from 'class-transformer';

/**
 * Sites Service
 * Handles all business logic for site management
 * Enforces multi-tenancy and organization limits
 */
@Injectable()
export class SitesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Template mapping based on industry
   * Can be extended with actual template IDs from a templates table
   */
  private readonly INDUSTRY_TEMPLATES: Record<Industry, string> = {
    RESTAURANT: 'template-restaurant-01',
    DENTAL: 'template-dental-01',
    PORTFOLIO: 'template-portfolio-01',
    BUSINESS: 'template-business-01',
    STORE: 'template-store-01',
  };

  /**
   * Create a new site
   * Enforces organization limits and multi-tenancy
   */
  async create(
    userId: string,
    organizationId: string,
    createSiteDto: CreateSiteDto,
  ): Promise<SiteResponseDto> {
    // 1. Check organization limits
    await this.checkOrganizationLimits(organizationId);

    // 2. Generate unique slug
    const slug = await this.generateUniqueSlug(createSiteDto.businessName);

    // 3. Assign template based on industry if not provided
    const templateId =
      createSiteDto.templateId ||
      this.INDUSTRY_TEMPLATES[createSiteDto.industry];

    // 4. Generate initial pages structure based on template
    const pages = this.generateInitialPages(
      createSiteDto.industry,
      createSiteDto,
    );

    // 5. Create site
    try {
      const site = await this.prisma.site.create({
        data: {
          name: createSiteDto.name,
          slug,
          organizationId,
          userId,
          industry: createSiteDto.industry,
          templateId,
          businessName: createSiteDto.businessName,
          description: createSiteDto.description,
          phone: createSiteDto.phone,
          email: createSiteDto.email,
          address: createSiteDto.address,
          colorPalette: createSiteDto.colorPalette,
          pages,
          publishUrl: `https://${slug}.puiuxclick.com`,
        },
      });

      return this.toResponseDto(site);
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('الموقع بهذا الاسم موجود مسبقاً');
      }
      throw error;
    }
  }

  /**
   * Find all sites for an organization
   */
  async findAll(organizationId: string): Promise<SiteResponseDto[]> {
    const sites = await this.prisma.site.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'desc' },
    });

    return sites.map((site) => this.toResponseDto(site));
  }

  /**
   * Find one site by ID
   * Enforces multi-tenancy
   */
  async findOne(
    id: string,
    organizationId: string,
  ): Promise<SiteResponseDto> {
    const site = await this.prisma.site.findFirst({
      where: { id, organizationId },
    });

    if (!site) {
      throw new NotFoundException('الموقع غير موجود');
    }

    return this.toResponseDto(site);
  }

  /**
   * Find site by slug (for public access)
   */
  async findBySlug(slug: string): Promise<SiteResponseDto> {
    const site = await this.prisma.site.findUnique({
      where: { slug, status: SiteStatus.PUBLISHED },
    });

    if (!site) {
      throw new NotFoundException('الموقع غير موجود');
    }

    // Increment view count
    await this.incrementViewCount(site.id);

    return this.toResponseDto(site);
  }

  /**
   * Update a site
   * Enforces multi-tenancy
   */
  async update(
    id: string,
    organizationId: string,
    updateSiteDto: UpdateSiteDto,
  ): Promise<SiteResponseDto> {
    // Verify ownership
    await this.findOne(id, organizationId);

    const site = await this.prisma.site.update({
      where: { id },
      data: updateSiteDto,
    });

    return this.toResponseDto(site);
  }

  /**
   * Publish a site
   */
  async publish(id: string, organizationId: string): Promise<SiteResponseDto> {
    await this.findOne(id, organizationId);

    const site = await this.prisma.site.update({
      where: { id },
      data: {
        status: SiteStatus.PUBLISHED,
        publishedAt: new Date(),
      },
    });

    return this.toResponseDto(site);
  }

  /**
   * Unpublish a site
   */
  async unpublish(
    id: string,
    organizationId: string,
  ): Promise<SiteResponseDto> {
    await this.findOne(id, organizationId);

    const site = await this.prisma.site.update({
      where: { id },
      data: {
        status: SiteStatus.DRAFT,
      },
    });

    return this.toResponseDto(site);
  }

  /**
   * Delete a site
   * Enforces multi-tenancy
   */
  async remove(id: string, organizationId: string): Promise<void> {
    await this.findOne(id, organizationId);

    await this.prisma.site.delete({
      where: { id },
    });
  }

  /**
   * Get site statistics
   */
  async getStats(organizationId: string) {
    const [total, published, draft, archived, totalViews] =
      await Promise.all([
        this.prisma.site.count({ where: { organizationId } }),
        this.prisma.site.count({
          where: { organizationId, status: SiteStatus.PUBLISHED },
        }),
        this.prisma.site.count({
          where: { organizationId, status: SiteStatus.DRAFT },
        }),
        this.prisma.site.count({
          where: { organizationId, status: SiteStatus.ARCHIVED },
        }),
        this.prisma.site.aggregate({
          where: { organizationId },
          _sum: { viewCount: true },
        }),
      ]);

    return {
      total,
      published,
      draft,
      archived,
      totalViews: totalViews._sum.viewCount || 0,
    };
  }

  // ============================================================================
  // Private Helper Methods
  // ============================================================================

  /**
   * Check if organization has reached site creation limit
   */
  private async checkOrganizationLimits(organizationId: string) {
    const organization = await this.prisma.organization.findUnique({
      where: { id: organizationId },
      include: {
        _count: {
          select: { sites: true },
        },
      },
    });

    if (!organization) {
      throw new NotFoundException('المنظمة غير موجودة');
    }

    // Check if limit reached (unlimited = -1 or maxSites = 0 means no limit)
    if (
      organization.maxSites > 0 &&
      organization._count.sites >= organization.maxSites
    ) {
      throw new ForbiddenException(
        `لقد وصلت للحد الأقصى من المواقع (${organization.maxSites}). قم بالترقية للخطة الأعلى.`,
      );
    }
  }

  /**
   * Generate unique slug from business name
   */
  private async generateUniqueSlug(businessName: string): Promise<string> {
    // Convert to slug format
    let baseSlug = businessName
      .toLowerCase()
      .trim()
      .replace(/[\s_]+/g, '-') // Replace spaces and underscores with hyphens
      .replace(/[^\w\-]+/g, '') // Remove non-word chars except hyphens
      .replace(/\-\-+/g, '-') // Replace multiple hyphens with single
      .replace(/^-+/, '') // Trim hyphens from start
      .replace(/-+$/, ''); // Trim hyphens from end

    // If slug is empty or too short, use random
    if (baseSlug.length < 3) {
      baseSlug = 'site-' + Math.random().toString(36).substring(2, 8);
    }

    // Check uniqueness and add suffix if needed
    let slug = baseSlug;
    let counter = 1;

    while (await this.prisma.site.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    return slug;
  }

  /**
   * Generate initial pages structure based on industry
   */
  private generateInitialPages(industry: Industry, dto: CreateSiteDto): any {
    const commonPages = {
      home: {
        title: 'الرئيسية',
        sections: [
          {
            type: 'hero',
            title: dto.businessName,
            subtitle: dto.description || '',
            cta: { text: 'اتصل بنا', link: '#contact' },
          },
        ],
      },
      contact: {
        title: 'اتصل بنا',
        sections: [
          {
            type: 'contact-form',
            phone: dto.phone,
            email: dto.email,
            address: dto.address,
          },
        ],
      },
    };

    // Industry-specific pages
    const industryPages: Record<Industry, any> = {
      RESTAURANT: {
        ...commonPages,
        menu: {
          title: 'قائمة الطعام',
          sections: [{ type: 'menu-grid', items: [] }],
        },
      },
      DENTAL: {
        ...commonPages,
        services: {
          title: 'خدماتنا',
          sections: [{ type: 'services-grid', items: [] }],
        },
      },
      PORTFOLIO: {
        ...commonPages,
        projects: {
          title: 'أعمالي',
          sections: [{ type: 'portfolio-grid', items: [] }],
        },
      },
      BUSINESS: {
        ...commonPages,
        about: {
          title: 'من نحن',
          sections: [{ type: 'about-section' }],
        },
      },
      STORE: {
        ...commonPages,
        products: {
          title: 'المنتجات',
          sections: [{ type: 'products-grid', items: [] }],
        },
      },
    };

    return industryPages[industry] || commonPages;
  }

  /**
   * Increment view count for analytics
   */
  private async incrementViewCount(siteId: string) {
    await this.prisma.site.update({
      where: { id: siteId },
      data: {
        viewCount: { increment: 1 },
        lastViewedAt: new Date(),
      },
    });
  }

  /**
   * Convert Site entity to SiteResponseDto
   */
  private toResponseDto(site: Site): SiteResponseDto {
    return plainToInstance(SiteResponseDto, site, {
      excludeExtraneousValues: true,
    });
  }
}
