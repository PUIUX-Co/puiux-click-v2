import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateSiteDto, UpdateSiteDto, SiteResponseDto } from './dto';
import { Industry, SiteStatus, Site } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { AiService } from '../ai/ai.service';
import { GeneratedWebsite } from '../ai/dto';
import { Prisma } from '@prisma/client';

/**
 * Sites Service
 * Handles all business logic for site management
 * Enforces multi-tenancy and organization limits
 */
@Injectable()
export class SitesService {
  private readonly logger = new Logger(SitesService.name);

  constructor(
    private prisma: PrismaService,
    private aiService: AiService,
  ) {}

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
   * Generates complete website with AI
   */
  async create(
    userId: string,
    organizationId: string,
    createSiteDto: CreateSiteDto,
  ): Promise<SiteResponseDto> {
    try {
      // 1. Check organization limits
      await this.checkOrganizationLimits(organizationId);

      // 2. Generate unique slug
      const slug = await this.generateUniqueSlug(createSiteDto.businessName);

      // 3. Assign template based on industry if not provided
      const templateId =
        createSiteDto.templateId ||
        this.INDUSTRY_TEMPLATES[createSiteDto.industry] ||
        'template-default-01'; // Fallback template

      // 4. Create site record first (with empty pages)
      let site: Site;
      try {
        site = await this.prisma.site.create({
          data: {
            name: createSiteDto.name,
            slug,
            organization: {
              connect: { id: organizationId },
            },
            user: {
              connect: { id: userId },
            },
            industry: createSiteDto.industry,
            templateId,
            businessName: createSiteDto.businessName,
            description: createSiteDto.description,
            phone: createSiteDto.phone,
            email: createSiteDto.email,
            address: createSiteDto.address,
            colorPalette: createSiteDto.colorPalette as unknown as Prisma.InputJsonValue,
            pages: {}, // Empty initially
            publishUrl: `https://${slug}.puiuxclick.com`,
          },
        });
      } catch (error) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === 'P2002'
        ) {
          throw new ConflictException('الموقع بهذا الاسم موجود مسبقاً');
        }
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        const errorStack = error instanceof Error ? error.stack : undefined;
        this.logger.error(`Failed to create site record: ${errorMessage}`, errorStack);
        throw error;
      }

      // 5. Generate complete website with AI in background
      try {
        this.logger.log(`Generating initial site with AI for site ${site.id}`);

        const generatedSite = await this.aiService.generateInitialSite({
          industry: createSiteDto.industry,
          businessName: createSiteDto.businessName,
          description: createSiteDto.description,
          colorPalette: createSiteDto.colorPalette,
          contactInfo: {
            phone: createSiteDto.phone,
            email: createSiteDto.email,
            address: createSiteDto.address,
          },
          language: 'ar', // Default to Arabic
        });

        // 6. Convert AI-generated HTML/CSS to GrapesJS format
        const grapesJSPages = this.convertToGrapesJSFormat(generatedSite);

        // 7. Update site with generated pages
        site = await this.prisma.site.update({
          where: { id: site.id },
          data: { pages: grapesJSPages },
        });

        this.logger.log(`Successfully generated site ${site.id} with AI`);
      } catch (error) {
        // If AI generation fails, keep site with simple structure
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        const errorStack = error instanceof Error ? error.stack : undefined;
        
        this.logger.warn(`AI generation failed for site ${site.id}, using fallback structure`);
        this.logger.debug(`AI generation error: ${errorMessage}`, errorStack);

        // Fallback to simple pages structure - always succeed with fallback
        try {
          const fallbackPages = this.generateInitialPages(
            createSiteDto.industry,
            createSiteDto,
          );

          site = await this.prisma.site.update({
            where: { id: site.id },
            data: { pages: fallbackPages },
          });

          this.logger.log(`Site ${site.id} created with fallback structure`);
        } catch (fallbackError) {
          // Even fallback failed - log but don't fail site creation
          const fallbackErrorMessage = 
            fallbackError instanceof Error ? fallbackError.message : 'Unknown error';
          this.logger.error(
            `Fallback structure update failed for site ${site.id}: ${fallbackErrorMessage}`,
          );
          // Continue anyway - site is already created, just with empty pages
        }
      }

      // Return the site after all operations complete successfully
      return this.toResponseDto(site);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(`Failed to create site: ${errorMessage}`, errorStack);
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

    const data: Prisma.SiteUpdateInput = {
      name: updateSiteDto.name,
      industry: updateSiteDto.industry,
      businessName: updateSiteDto.businessName,
      description: updateSiteDto.description,
      phone: updateSiteDto.phone,
      email: updateSiteDto.email,
      address: updateSiteDto.address,
      templateId: updateSiteDto.templateId,
      status: updateSiteDto.status,
      colorPalette:
        (updateSiteDto as any).colorPalette !== undefined
          ? (updateSiteDto as any).colorPalette
          : undefined,
    };

    // Remove undefined fields to prevent overwriting with null
    Object.keys(data).forEach((key) =>
      (data as any)[key] === undefined ? delete (data as any)[key] : null,
    );

    if (data.colorPalette !== undefined) {
      data.colorPalette = data.colorPalette as unknown as Prisma.InputJsonValue;
    }

    const site = await this.prisma.site.update({
      where: { id },
      data,
    });

    return this.toResponseDto(site);
  }

  /**
   * Publish a site
   * Generates publishUrl based on slug
   */
  async publish(id: string, organizationId: string): Promise<SiteResponseDto> {
    const existingSite = await this.findOne(id, organizationId);

    // Generate publishUrl from slug
    const publishUrl = `https://${existingSite.slug}.puiuxclick.com`;

    const site = await this.prisma.site.update({
      where: { id },
      data: {
        status: SiteStatus.PUBLISHED,
        publishedAt: new Date(),
        publishUrl,
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
   * Returns GrapesJS-compatible format
   */
  private generateInitialPages(industry: Industry, dto: CreateSiteDto): any {
    const { primary, secondary, accent } = dto.colorPalette as any;

    // Create a professional landing page with GrapesJS format
    const defaultHTML = `
      <section class="hero-section" style="min-height: 100vh; background: linear-gradient(135deg, ${primary} 0%, ${secondary} 100%); display: flex; align-items: center; justify-content: center; padding: 2rem; text-align: center; color: white;">
        <div class="container" style="max-width: 1200px; margin: 0 auto;">
          <h1 style="font-size: 3.5rem; font-weight: bold; margin-bottom: 1.5rem; text-shadow: 0 2px 10px rgba(0,0,0,0.2);">${dto.businessName}</h1>
          <p style="font-size: 1.5rem; margin-bottom: 2rem; opacity: 0.95;">${dto.description || 'موقعك الاحترافي جاهز الآن!'}</p>
          <a href="#contact" style="display: inline-block; background: white; color: ${primary}; padding: 1rem 2.5rem; border-radius: 50px; font-weight: bold; font-size: 1.1rem; text-decoration: none; box-shadow: 0 4px 15px rgba(0,0,0,0.2); transition: transform 0.2s;">تواصل معنا الآن</a>
        </div>
      </section>

      <section class="features-section" style="padding: 5rem 2rem; background: #f8f9fa;">
        <div class="container" style="max-width: 1200px; margin: 0 auto; text-align: center;">
          <h2 style="font-size: 2.5rem; font-weight: bold; margin-bottom: 3rem; color: ${primary};">لماذا نحن؟</h2>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem;">
            <div class="feature-card" style="background: white; padding: 2rem; border-radius: 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
              <div style="width: 60px; height: 60px; background: ${primary}; border-radius: 50%; margin: 0 auto 1rem; display: flex; align-items: center; justify-content: center; color: white; font-size: 1.8rem;">✨</div>
              <h3 style="font-size: 1.3rem; font-weight: bold; margin-bottom: 0.5rem; color: #333;">جودة عالية</h3>
              <p style="color: #666;">نقدم أفضل الخدمات بجودة استثنائية</p>
            </div>
            <div class="feature-card" style="background: white; padding: 2rem; border-radius: 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
              <div style="width: 60px; height: 60px; background: ${secondary}; border-radius: 50%; margin: 0 auto 1rem; display: flex; align-items: center; justify-content: center; color: white; font-size: 1.8rem;">⚡</div>
              <h3 style="font-size: 1.3rem; font-weight: bold; margin-bottom: 0.5rem; color: #333;">سرعة في التنفيذ</h3>
              <p style="color: #666;">نلتزم بالمواعيد ونسلم في الوقت المحدد</p>
            </div>
            <div class="feature-card" style="background: white; padding: 2rem; border-radius: 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
              <div style="width: 60px; height: 60px; background: ${accent}; border-radius: 50%; margin: 0 auto 1rem; display: flex; align-items: center; justify-content: center; color: white; font-size: 1.8rem;">🎯</div>
              <h3 style="font-size: 1.3rem; font-weight: bold; margin-bottom: 0.5rem; color: #333;">احترافية</h3>
              <p style="color: #666;">فريق محترف وخبرة واسعة في المجال</p>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" class="contact-section" style="padding: 5rem 2rem; background: linear-gradient(135deg, ${secondary} 0%, ${primary} 100%); color: white;">
        <div class="container" style="max-width: 800px; margin: 0 auto; text-align: center;">
          <h2 style="font-size: 2.5rem; font-weight: bold; margin-bottom: 2rem;">تواصل معنا</h2>
          <p style="font-size: 1.2rem; margin-bottom: 3rem; opacity: 0.95;">نسعد بخدمتك! تواصل معنا الآن</p>
          <div style="background: white; padding: 2.5rem; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.2);">
            ${dto.phone ? `<div style="margin-bottom: 1.5rem;"><span style="color: ${primary}; font-size: 1.5rem; margin-left: 0.5rem;">📱</span><a href="tel:${dto.phone}" style="color: #333; text-decoration: none; font-size: 1.2rem; font-weight: 500;">${dto.phone}</a></div>` : ''}
            ${dto.email ? `<div style="margin-bottom: 1.5rem;"><span style="color: ${secondary}; font-size: 1.5rem; margin-left: 0.5rem;">📧</span><a href="mailto:${dto.email}" style="color: #333; text-decoration: none; font-size: 1.2rem; font-weight: 500;">${dto.email}</a></div>` : ''}
            ${dto.address ? `<div><span style="color: ${accent}; font-size: 1.5rem; margin-left: 0.5rem;">📍</span><span style="color: #666; font-size: 1.1rem;">${dto.address}</span></div>` : ''}
          </div>
        </div>
      </section>

      <footer style="background: #1a1a1a; color: white; text-align: center; padding: 2rem;">
        <p style="margin: 0; opacity: 0.8;">© ${new Date().getFullYear()} ${dto.businessName}. جميع الحقوق محفوظة.</p>
        <p style="margin: 0.5rem 0 0; opacity: 0.6; font-size: 0.9rem;">تم الإنشاء بواسطة <a href="https://puiux.com" style="color: ${primary}; text-decoration: none;">PUIUX Click</a></p>
      </footer>
    `;

    // Return GrapesJS-compatible structure
    return {
      assets: [],
      styles: [],
      pages: [
        {
          id: 'home',
          name: 'الصفحة الرئيسية',
          frames: [
            {
              component: {
                type: 'wrapper',
                stylable: ['background', 'background-color'],
                components: [
                  {
                    tagName: 'div',
                    type: 'default',
                    components: defaultHTML,
                  },
                ],
              },
              head: {
                type: 'head',
                components: [
                  {
                    type: 'link',
                    attributes: {
                      rel: 'stylesheet',
                      href: 'https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap',
                    },
                  },
                ],
              },
            },
          ],
        },
      ],
    };
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

  /**
   * Convert AI-generated HTML/CSS to GrapesJS format
   * GrapesJS expects a specific JSON structure with components, styles, etc.
   */
  private convertToGrapesJSFormat(generated: GeneratedWebsite): any {
    // Create a GrapesJS project structure
    // This is a simplified conversion - GrapesJS will parse the HTML into components
    const grapesJSProject = {
      assets: [],
      styles: [
        {
          selectors: [],
          style: generated.css || '',
          mediaText: '',
          atRuleType: '',
        },
      ],
      pages: [
        {
          id: 'home',
          name: 'الصفحة الرئيسية',
          frames: [
            {
              component: {
                type: 'wrapper',
                components: [
                  {
                    type: 'html',
                    content: generated.html || '<div>موقعك جاهز للتحرير</div>',
                    attributes: {
                      class: 'gjs-html-component',
                    },
                  },
                ],
              },
              head: {
                type: 'head',
                components: [
                  {
                    type: 'link',
                    attributes: {
                      rel: 'stylesheet',
                      href: 'https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css',
                    },
                  },
                ],
              },
            },
          ],
        },
      ],
    };

    // Add sections metadata if available
    if (generated.sections && generated.sections.length > 0) {
      grapesJSProject['sections'] = generated.sections;
    }

    // Add JavaScript if available
    if (generated.js) {
      grapesJSProject['scripts'] = [
        {
          type: 'text/javascript',
          content: generated.js,
        },
      ];
    }

    return grapesJSProject;
  }
}
