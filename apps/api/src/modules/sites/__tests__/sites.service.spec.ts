import { Test, TestingModule } from '@nestjs/testing';
import { SitesService } from '../sites.service';
import { PrismaService } from '@/common/prisma/prisma.service';
import { AiService } from '@/modules/ai/ai.service';
import { NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';

describe('SitesService', () => {
  let service: SitesService;
  let prismaService: PrismaService;

  const mockOrganization = {
    id: 'org-123',
    name: 'Test Org',
    slug: 'test-org',
    plan: 'FREE',
    maxSites: 1,
    maxStorage: 100,
    createdAt: new Date(),
    updatedAt: new Date(),
    _count: {
      sites: 0,
    },
  };

  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    password: 'hashed',
    name: 'Test User',
    role: 'USER',
    organizationId: 'org-123',
    emailVerified: false,
    emailVerifiedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockSite = {
    id: 'site-123',
    name: 'Test Site',
    slug: 'test-site',
    organizationId: 'org-123',
    userId: 'user-123',
    industry: 'DENTAL_CLINIC',
    templateId: 'template-1',
    businessName: 'Test Dental Clinic',
    description: 'A test dental clinic',
    logo: null,
    phone: '+966501234567',
    email: 'clinic@example.com',
    address: 'Riyadh, Saudi Arabia',
    colorPalette: { primary: '#00A6A6', secondary: '#EFDC05' },
    pages: [],
    status: 'DRAFT',
    publishedAt: null,
    publishUrl: null,
    views: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    user: mockUser,
    organization: mockOrganization,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SitesService,
        {
          provide: PrismaService,
          useValue: {
            site: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              findFirst: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
              count: jest.fn(),
            },
            organization: {
              findUnique: jest.fn(),
            },
            user: {
              findUnique: jest.fn(),
            },
          },
        },
        {
          provide: AiService,
          useValue: {
            generateWebsite: jest.fn(),
            generateContent: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<SitesService>(SitesService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const createDto = {
      name: 'Test Site',
      slug: 'test-site',
      industry: 'DENTAL_CLINIC' as any,
      templateId: 'template-1',
      businessName: 'Test Dental Clinic',
      description: 'A test dental clinic',
      phone: '+966501234567',
      email: 'clinic@example.com',
      address: 'Riyadh, Saudi Arabia',
      colorPalette: { primary: '#00A6A6', secondary: '#EFDC05' },
      pages: [],
    };

    it('should successfully create a new site', async () => {
      // Arrange
      jest.spyOn(prismaService.organization, 'findUnique').mockResolvedValue(mockOrganization);
      jest.spyOn(prismaService.site, 'count').mockResolvedValue(0);
      jest.spyOn(prismaService.site, 'findFirst').mockResolvedValue(null);
      jest.spyOn(prismaService.site, 'create').mockResolvedValue(mockSite);

      // Act
      const result = await service.create('user-123', 'org-123', createDto);

      // Assert
      expect(result).toBeDefined();
      expect(result.name).toBe(mockSite.name);
      expect(result.slug).toBe(mockSite.slug);
      expect(prismaService.site.create).toHaveBeenCalled();
    });

    it('should throw ForbiddenException if site limit exceeded', async () => {
      // Arrange
      const fullOrg = { ...mockOrganization, _count: { sites: 1 } }; // Already at max
      jest.spyOn(prismaService.organization, 'findUnique').mockResolvedValue(fullOrg);

      // Act & Assert
      await expect(
        service.create('user-123', 'org-123', createDto)
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw BadRequestException if slug already exists', async () => {
      // Arrange
      jest.spyOn(prismaService.organization, 'findUnique').mockResolvedValue(mockOrganization);
      jest.spyOn(prismaService.site, 'count').mockResolvedValue(0);
      jest.spyOn(prismaService.site, 'findFirst').mockResolvedValue(mockSite); // Slug exists

      // Act & Assert
      await expect(
        service.create('user-123', 'org-123', createDto)
      ).rejects.toThrow(BadRequestException);
    });

    it('should enforce multi-tenancy isolation', async () => {
      // Arrange
      jest.spyOn(prismaService.organization, 'findUnique').mockResolvedValue(mockOrganization);
      jest.spyOn(prismaService.site, 'count').mockResolvedValue(0);
      jest.spyOn(prismaService.site, 'findFirst').mockResolvedValue(null);
      jest.spyOn(prismaService.site, 'create').mockResolvedValue(mockSite);

      // Act
      await service.create('user-123', 'org-123', createDto);

      // Assert
      expect(prismaService.site.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          organizationId: 'org-123',
          userId: 'user-123',
        }),
      });
    });
  });

  describe('findAll', () => {
    it('should return all sites for an organization', async () => {
      // Arrange
      const sites = [mockSite, { ...mockSite, id: 'site-456', name: 'Site 2' }];
      jest.spyOn(prismaService.site, 'findMany').mockResolvedValue(sites);

      // Act
      const result = await service.findAll('org-123');

      // Assert
      expect(result).toHaveLength(2);
      expect(prismaService.site.findMany).toHaveBeenCalledWith({
        where: { organizationId: 'org-123' },
        orderBy: { createdAt: 'desc' },
      });
    });

    it('should filter by organization only (no user filter)', async () => {
      // Arrange
      jest.spyOn(prismaService.site, 'findMany').mockResolvedValue([mockSite]);

      // Act
      await service.findAll('org-123');

      // Assert - userId filter not supported in current implementation
      expect(prismaService.site.findMany).toHaveBeenCalledWith({
        where: { organizationId: 'org-123' },
        orderBy: { createdAt: 'desc' },
      });
    });

    it('should enforce multi-tenancy isolation', async () => {
      // Arrange
      jest.spyOn(prismaService.site, 'findMany').mockResolvedValue([mockSite]);

      // Act
      await service.findAll('org-123');

      // Assert - should always filter by organizationId
      expect(prismaService.site.findMany).toHaveBeenCalledWith({
        where: { organizationId: 'org-123' },
        orderBy: { createdAt: 'desc' },
      });
      });
    });
  });

  describe('findOne', () => {
    it('should return a site by id', async () => {
      // Arrange
      jest.spyOn(prismaService.site, 'findFirst').mockResolvedValue(mockSite);

      // Act
      const result = await service.findOne('site-123', 'org-123');

      // Assert
      expect(result).toBeDefined();
      expect(result.id).toBe('site-123');
      expect(prismaService.site.findFirst).toHaveBeenCalledWith({
        where: { id: 'site-123', organizationId: 'org-123' },
      });
    });

    it('should throw NotFoundException if site not found', async () => {
      // Arrange
      jest.spyOn(prismaService.site, 'findFirst').mockResolvedValue(null);

      // Act & Assert
      await expect(
        service.findOne('nonexistent', 'org-123')
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if accessing site from different organization', async () => {
      // Arrange - findFirst with wrong org returns null (security by obscurity)
      jest.spyOn(prismaService.site, 'findFirst').mockResolvedValue(null);

      // Act & Assert
      await expect(
        service.findOne('site-123', 'different-org')
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    const updateDto = {
      name: 'Updated Site Name',
      description: 'Updated description',
    };

    it('should successfully update a site', async () => {
      // Arrange
      const updatedSite = { ...mockSite, ...updateDto };
      jest.spyOn(prismaService.site, 'findFirst').mockResolvedValue(mockSite);
      jest.spyOn(prismaService.site, 'update').mockResolvedValue(updatedSite);

      // Act
      const result = await service.update('site-123', 'org-123', updateDto);

      // Assert
      expect(result.name).toBe(updateDto.name);
      expect(result.description).toBe(updateDto.description);
      expect(prismaService.site.update).toHaveBeenCalled();
    });

    it('should throw NotFoundException if site not found', async () => {
      // Arrange
      jest.spyOn(prismaService.site, 'findFirst').mockResolvedValue(null);

      // Act & Assert
      await expect(
        service.update('nonexistent', 'org-123', updateDto)
      ).rejects.toThrow(NotFoundException);
    });

    it('should enforce multi-tenancy on update', async () => {
      // Arrange - findFirst with wrong org returns null
      jest.spyOn(prismaService.site, 'findFirst').mockResolvedValue(null);

      // Act & Assert
      await expect(
        service.update('site-123', 'different-org', updateDto)
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('publish', () => {
    it('should successfully publish a site', async () => {
      // Arrange
      const publishedSite = {
        ...mockSite,
        status: 'PUBLISHED',
        publishedAt: new Date(),
        publishUrl: 'https://test-site.puiuxclick.com',
      };
      jest.spyOn(prismaService.site, 'findFirst').mockResolvedValue(mockSite);
      jest.spyOn(prismaService.site, 'update').mockResolvedValue(publishedSite);

      // Act
      const result = await service.publish('site-123', 'org-123');

      // Assert
      expect(result.status).toBe('PUBLISHED');
      expect(result.publishedAt).toBeDefined();
      expect(result.publishUrl).toBeDefined();
    });

    it('should generate correct publish URL', async () => {
      // Arrange
      jest.spyOn(prismaService.site, 'findFirst').mockResolvedValue(mockSite);
      jest.spyOn(prismaService.site, 'update').mockResolvedValue({
        ...mockSite,
        status: 'PUBLISHED',
        publishUrl: 'https://test-site.puiuxclick.com',
      });

      // Act
      const result = await service.publish('site-123', 'org-123');

      // Assert
      expect(result.publishUrl).toContain(mockSite.slug);
      expect(result.publishUrl).toContain('puiuxclick.com');
    });
  });

  describe('unpublish', () => {
    it('should successfully unpublish a site', async () => {
      // Arrange
      const publishedSite = {
        ...mockSite,
        status: 'PUBLISHED',
        publishedAt: new Date(),
        publishUrl: 'https://test-site.puiuxclick.com',
      };
      jest.spyOn(prismaService.site, 'findUnique').mockResolvedValue(publishedSite);
      jest.spyOn(prismaService.site, 'update').mockResolvedValue({
        ...publishedSite,
        status: 'DRAFT',
      });

      // Act
      const result = await service.unpublish('site-123', 'org-123');

      // Assert
      expect(result.status).toBe('DRAFT');
    });
  });

  describe('remove', () => {
    it('should successfully delete a site', async () => {
      // Arrange
      jest.spyOn(prismaService.site, 'findFirst').mockResolvedValue(mockSite);
      jest.spyOn(prismaService.site, 'delete').mockResolvedValue(mockSite);

      // Act
      await service.remove('site-123', 'org-123');

      // Assert
      expect(prismaService.site.delete).toHaveBeenCalledWith({
        where: { id: 'site-123' },
      });
    });

    it('should throw NotFoundException if site not found', async () => {
      // Arrange
      jest.spyOn(prismaService.site, 'findFirst').mockResolvedValue(null);

      // Act & Assert
      await expect(
        service.remove('nonexistent', 'org-123')
      ).rejects.toThrow(NotFoundException);
    });

    it('should enforce multi-tenancy on delete', async () => {
      // Arrange - findFirst with wrong org returns null
      jest.spyOn(prismaService.site, 'findFirst').mockResolvedValue(null);

      // Act & Assert
      await expect(
        service.remove('site-123', 'different-org')
      ).rejects.toThrow(NotFoundException);
    });
  });
});
