import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/common/prisma/prisma.service';

describe('Sites E2E Tests', () => {
  let app: INestApplication;
  let prismaService: PrismaService;

  // Test data
  const testUser1 = {
    email: 'sites-e2e-user1@example.com',
    password: 'Test123456!',
    name: 'Sites E2E User 1',
    organizationName: 'Sites E2E Org 1',
  };

  const testUser2 = {
    email: 'sites-e2e-user2@example.com',
    password: 'Test123456!',
    name: 'Sites E2E User 2',
    organizationName: 'Sites E2E Org 2',
  };

  const testSite = {
    name: 'E2E Test Dental Clinic',
    slug: 'e2e-test-dental-clinic',
    industry: 'DENTAL_CLINIC',
    templateId: 'template-1',
    businessName: 'E2E Test Dental Clinic',
    description: 'A modern dental clinic for E2E testing',
    phone: '+966501234567',
    email: 'info@e2e-test-clinic.com',
    address: 'Riyadh, Saudi Arabia',
    colorPalette: {
      primary: '#00A6A6',
      secondary: '#EFDC05',
    },
    pages: [],
  };

  let accessToken1: string;
  let accessToken2: string;
  let organizationId1: string;
  let organizationId2: string;
  let siteId1: string;
  let siteSlug: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );

    await app.init();

    prismaService = app.get<PrismaService>(PrismaService);

    // Clean up test data before running tests
    await cleanupTestData();

    // Register and login test users
    await setupTestUsers();
  });

  afterAll(async () => {
    // Clean up test data after all tests
    await cleanupTestData();
    await app.close();
  });

  const cleanupTestData = async () => {
    try {
      // Delete test sites
      await prismaService.site.deleteMany({
        where: {
          OR: [
            { slug: { contains: 'e2e-test' } },
            { user: { email: { in: [testUser1.email, testUser2.email] } } },
          ],
        },
      });

      // Delete sessions
      await prismaService.session.deleteMany({
        where: {
          user: {
            email: { in: [testUser1.email, testUser2.email] },
          },
        },
      });

      // Delete users
      await prismaService.user.deleteMany({
        where: {
          email: { in: [testUser1.email, testUser2.email] },
        },
      });

      // Delete organizations
      await prismaService.organization.deleteMany({
        where: {
          name: {
            in: [testUser1.organizationName, testUser2.organizationName],
          },
        },
      });
    } catch (error) {
      // Ignore errors during cleanup
    }
  };

  const setupTestUsers = async () => {
    // Register user 1
    const reg1 = await request(app.getHttpServer())
      .post('/auth/register')
      .send(testUser1);

    accessToken1 = reg1.body.accessToken;
    organizationId1 = reg1.body.user.organizationId;

    // Register user 2 (different organization for multi-tenancy testing)
    const reg2 = await request(app.getHttpServer())
      .post('/auth/register')
      .send(testUser2);

    accessToken2 = reg2.body.accessToken;
    organizationId2 = reg2.body.user.organizationId;
  };

  describe('POST /sites', () => {
    it('should create a new site successfully', async () => {
      const response = await request(app.getHttpServer())
        .post('/sites')
        .set('Authorization', `Bearer ${accessToken1}`)
        .send(testSite)
        .expect(201);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message', 'تم إنشاء الموقع بنجاح');
      expect(response.body).toHaveProperty('data');

      const site = response.body.data;
      expect(site).toHaveProperty('id');
      expect(site).toHaveProperty('name', testSite.name);
      expect(site).toHaveProperty('slug');
      expect(site).toHaveProperty('industry', testSite.industry);
      expect(site).toHaveProperty('status', 'DRAFT');
      expect(site).toHaveProperty('organizationId', organizationId1);

      // Save for later tests
      siteId1 = site.id;
      siteSlug = site.slug;
    });

    it('should fail to create site without authentication', async () => {
      const response = await request(app.getHttpServer())
        .post('/sites')
        .send(testSite)
        .expect(401);

      expect(response.body).toHaveProperty('statusCode', 401);
    });

    it('should fail to create site with missing required fields', async () => {
      const response = await request(app.getHttpServer())
        .post('/sites')
        .set('Authorization', `Bearer ${accessToken1}`)
        .send({
          name: 'Incomplete Site',
          // Missing required fields: industry, businessName, etc.
        })
        .expect(400);

      expect(response.body).toHaveProperty('statusCode', 400);
    });

    it('should fail to create site with invalid industry', async () => {
      const response = await request(app.getHttpServer())
        .post('/sites')
        .set('Authorization', `Bearer ${accessToken1}`)
        .send({
          ...testSite,
          slug: 'invalid-industry-site',
          industry: 'INVALID_INDUSTRY',
        })
        .expect(400);

      expect(response.body).toHaveProperty('statusCode', 400);
    });

    it('should generate unique slug if slug already exists', async () => {
      // Try to create another site with same slug
      const response = await request(app.getHttpServer())
        .post('/sites')
        .set('Authorization', `Bearer ${accessToken1}`)
        .send({
          ...testSite,
          name: 'Another Site with Same Slug',
        })
        .expect(201);

      expect(response.body.data.slug).not.toBe(siteSlug);
      expect(response.body.data.slug).toContain('e2e-test');
    });
  });

  describe('GET /sites', () => {
    it('should get all sites for authenticated user organization', async () => {
      const response = await request(app.getHttpServer())
        .get('/sites')
        .set('Authorization', `Bearer ${accessToken1}`)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('total');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);

      // All sites should belong to user's organization
      response.body.data.forEach((site: any) => {
        expect(site.organizationId).toBe(organizationId1);
      });
    });

    it('should not return sites from other organizations', async () => {
      // User 2 should not see User 1's sites
      const response = await request(app.getHttpServer())
        .get('/sites')
        .set('Authorization', `Bearer ${accessToken2}`)
        .expect(200);

      expect(response.body.data).toHaveLength(0);
      expect(response.body.total).toBe(0);
    });

    it('should fail to get sites without authentication', async () => {
      const response = await request(app.getHttpServer())
        .get('/sites')
        .expect(401);

      expect(response.body).toHaveProperty('statusCode', 401);
    });
  });

  describe('GET /sites/stats', () => {
    it('should get site statistics for organization', async () => {
      const response = await request(app.getHttpServer())
        .get('/sites/stats')
        .set('Authorization', `Bearer ${accessToken1}`)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('total');
      expect(response.body.data).toHaveProperty('published');
      expect(response.body.data).toHaveProperty('draft');
      expect(response.body.data).toHaveProperty('totalViews');
    });

    it('should show correct stats per organization', async () => {
      const response1 = await request(app.getHttpServer())
        .get('/sites/stats')
        .set('Authorization', `Bearer ${accessToken1}`)
        .expect(200);

      const response2 = await request(app.getHttpServer())
        .get('/sites/stats')
        .set('Authorization', `Bearer ${accessToken2}`)
        .expect(200);

      // User 1 should have sites, User 2 should not
      expect(response1.body.data.total).toBeGreaterThan(0);
      expect(response2.body.data.total).toBe(0);
    });
  });

  describe('GET /sites/:id', () => {
    it('should get a single site by id', async () => {
      const response = await request(app.getHttpServer())
        .get(`/sites/${siteId1}`)
        .set('Authorization', `Bearer ${accessToken1}`)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('id', siteId1);
      expect(response.body.data).toHaveProperty('name', testSite.name);
    });

    it('should fail to get site from different organization', async () => {
      // User 2 trying to access User 1's site
      const response = await request(app.getHttpServer())
        .get(`/sites/${siteId1}`)
        .set('Authorization', `Bearer ${accessToken2}`)
        .expect(404);

      expect(response.body).toHaveProperty('statusCode', 404);
    });

    it('should fail to get non-existent site', async () => {
      const response = await request(app.getHttpServer())
        .get('/sites/non-existent-id')
        .set('Authorization', `Bearer ${accessToken1}`)
        .expect(404);

      expect(response.body).toHaveProperty('statusCode', 404);
    });

    it('should fail to get site without authentication', async () => {
      const response = await request(app.getHttpServer())
        .get(`/sites/${siteId1}`)
        .expect(401);

      expect(response.body).toHaveProperty('statusCode', 401);
    });
  });

  describe('PATCH /sites/:id', () => {
    it('should update a site successfully', async () => {
      const updateData = {
        name: 'Updated E2E Dental Clinic',
        description: 'Updated description for E2E testing',
        phone: '+966509876543',
      };

      const response = await request(app.getHttpServer())
        .patch(`/sites/${siteId1}`)
        .set('Authorization', `Bearer ${accessToken1}`)
        .send(updateData)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message', 'تم تحديث الموقع بنجاح');
      expect(response.body.data).toHaveProperty('name', updateData.name);
      expect(response.body.data).toHaveProperty('description', updateData.description);
      expect(response.body.data).toHaveProperty('phone', updateData.phone);
    });

    it('should fail to update site from different organization', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/sites/${siteId1}`)
        .set('Authorization', `Bearer ${accessToken2}`)
        .send({ name: 'Hacked Name' })
        .expect(404);

      expect(response.body).toHaveProperty('statusCode', 404);
    });

    it('should fail to update non-existent site', async () => {
      const response = await request(app.getHttpServer())
        .patch('/sites/non-existent-id')
        .set('Authorization', `Bearer ${accessToken1}`)
        .send({ name: 'Test' })
        .expect(404);

      expect(response.body).toHaveProperty('statusCode', 404);
    });

    it('should fail to update site without authentication', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/sites/${siteId1}`)
        .send({ name: 'Test' })
        .expect(401);

      expect(response.body).toHaveProperty('statusCode', 401);
    });
  });

  describe('POST /sites/:id/publish', () => {
    it('should publish a site successfully', async () => {
      const response = await request(app.getHttpServer())
        .post(`/sites/${siteId1}/publish`)
        .set('Authorization', `Bearer ${accessToken1}`)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message', 'تم نشر الموقع بنجاح');
      expect(response.body.data).toHaveProperty('status', 'PUBLISHED');
      expect(response.body.data).toHaveProperty('publishedAt');
      expect(response.body.data).toHaveProperty('publishUrl');
      expect(response.body.data.publishUrl).toContain(siteSlug);
    });

    it('should fail to publish site from different organization', async () => {
      const response = await request(app.getHttpServer())
        .post(`/sites/${siteId1}/publish`)
        .set('Authorization', `Bearer ${accessToken2}`)
        .expect(404);

      expect(response.body).toHaveProperty('statusCode', 404);
    });

    it('should fail to publish without authentication', async () => {
      const response = await request(app.getHttpServer())
        .post(`/sites/${siteId1}/publish`)
        .expect(401);

      expect(response.body).toHaveProperty('statusCode', 401);
    });
  });

  describe('GET /sites/public/:slug', () => {
    it('should get published site by slug without authentication', async () => {
      const response = await request(app.getHttpServer())
        .get(`/sites/public/${siteSlug}`)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('slug', siteSlug);
      expect(response.body.data).toHaveProperty('status', 'PUBLISHED');
    });

    it('should fail to get non-existent site by slug', async () => {
      const response = await request(app.getHttpServer())
        .get('/sites/public/non-existent-slug')
        .expect(404);

      expect(response.body).toHaveProperty('statusCode', 404);
    });
  });

  describe('POST /sites/:id/unpublish', () => {
    it('should unpublish a site successfully', async () => {
      const response = await request(app.getHttpServer())
        .post(`/sites/${siteId1}/unpublish`)
        .set('Authorization', `Bearer ${accessToken1}`)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message', 'تم إلغاء نشر الموقع بنجاح');
      expect(response.body.data).toHaveProperty('status', 'DRAFT');
    });

    it('should fail to unpublish site from different organization', async () => {
      const response = await request(app.getHttpServer())
        .post(`/sites/${siteId1}/unpublish`)
        .set('Authorization', `Bearer ${accessToken2}`)
        .expect(404);

      expect(response.body).toHaveProperty('statusCode', 404);
    });
  });

  describe('DELETE /sites/:id', () => {
    it('should fail to delete site from different organization', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/sites/${siteId1}`)
        .set('Authorization', `Bearer ${accessToken2}`)
        .expect(404);

      expect(response.body).toHaveProperty('statusCode', 404);
    });

    it('should fail to delete without authentication', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/sites/${siteId1}`)
        .expect(401);

      expect(response.body).toHaveProperty('statusCode', 401);
    });

    it('should delete a site successfully', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/sites/${siteId1}`)
        .set('Authorization', `Bearer ${accessToken1}`)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message', 'تم حذف الموقع بنجاح');

      // Verify site is deleted
      const getResponse = await request(app.getHttpServer())
        .get(`/sites/${siteId1}`)
        .set('Authorization', `Bearer ${accessToken1}`)
        .expect(404);
    });

    it('should fail to delete non-existent site', async () => {
      const response = await request(app.getHttpServer())
        .delete('/sites/non-existent-id')
        .set('Authorization', `Bearer ${accessToken1}`)
        .expect(404);

      expect(response.body).toHaveProperty('statusCode', 404);
    });
  });

  describe('Multi-tenancy & Security', () => {
    let site1: string;
    let site2: string;

    beforeAll(async () => {
      // Create a site for each user
      const res1 = await request(app.getHttpServer())
        .post('/sites')
        .set('Authorization', `Bearer ${accessToken1}`)
        .send({
          ...testSite,
          slug: 'security-test-site-1',
          name: 'Security Test Site 1',
        });
      site1 = res1.body.data.id;

      const res2 = await request(app.getHttpServer())
        .post('/sites')
        .set('Authorization', `Bearer ${accessToken2}`)
        .send({
          ...testSite,
          slug: 'security-test-site-2',
          name: 'Security Test Site 2',
        });
      site2 = res2.body.data.id;
    });

    it('should enforce strict tenant isolation', async () => {
      // User 1 cannot access User 2's site
      await request(app.getHttpServer())
        .get(`/sites/${site2}`)
        .set('Authorization', `Bearer ${accessToken1}`)
        .expect(404);

      // User 2 cannot access User 1's site
      await request(app.getHttpServer())
        .get(`/sites/${site1}`)
        .set('Authorization', `Bearer ${accessToken2}`)
        .expect(404);
    });

    it('should prevent cross-tenant site updates', async () => {
      // User 1 cannot update User 2's site
      await request(app.getHttpServer())
        .patch(`/sites/${site2}`)
        .set('Authorization', `Bearer ${accessToken1}`)
        .send({ name: 'Hacked' })
        .expect(404);

      // User 2 cannot update User 1's site
      await request(app.getHttpServer())
        .patch(`/sites/${site1}`)
        .set('Authorization', `Bearer ${accessToken2}`)
        .send({ name: 'Hacked' })
        .expect(404);
    });

    it('should prevent cross-tenant site deletions', async () => {
      // User 1 cannot delete User 2's site
      await request(app.getHttpServer())
        .delete(`/sites/${site2}`)
        .set('Authorization', `Bearer ${accessToken1}`)
        .expect(404);

      // User 2 cannot delete User 1's site
      await request(app.getHttpServer())
        .delete(`/sites/${site1}`)
        .set('Authorization', `Bearer ${accessToken2}`)
        .expect(404);
    });
  });
});
