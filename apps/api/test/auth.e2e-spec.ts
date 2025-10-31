import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/common/prisma/prisma.service';

describe('Auth E2E Tests', () => {
  let app: INestApplication;
  let prismaService: PrismaService;

  // Test data
  const testUser = {
    email: 'e2e-test@example.com',
    password: 'Test123456!',
    name: 'E2E Test User',
    organizationName: 'E2E Test Organization',
  };

  let accessToken: string;
  let refreshToken: string;
  let userId: string;
  let organizationId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Apply global pipes (same as main.ts)
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
  });

  afterAll(async () => {
    // Clean up test data after all tests
    await cleanupTestData();
    await app.close();
  });

  const cleanupTestData = async () => {
    try {
      // Delete in correct order due to foreign key constraints
      await prismaService.session.deleteMany({
        where: {
          user: {
            email: testUser.email,
          },
        },
      });

      await prismaService.site.deleteMany({
        where: {
          user: {
            email: testUser.email,
          },
        },
      });

      await prismaService.user.deleteMany({
        where: {
          email: testUser.email,
        },
      });

      await prismaService.organization.deleteMany({
        where: {
          name: testUser.organizationName,
        },
      });
    } catch (error) {
      // Ignore errors during cleanup
    }
  };

  describe('POST /auth/register', () => {
    it('should register a new user successfully', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send(testUser)
        .expect(201);

      expect(response.body).toHaveProperty('message', 'تم التسجيل بنجاح');
      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('expiresIn');

      // User data
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user).toHaveProperty('email', testUser.email);
      expect(response.body.user).toHaveProperty('name', testUser.name);
      expect(response.body.user).toHaveProperty('organizationId');
      expect(response.body.user).not.toHaveProperty('password'); // Password should not be returned

      // Tokens
      expect(typeof response.body.accessToken).toBe('string');
      expect(response.body.accessToken.length).toBeGreaterThan(0);

      // Check refresh token in cookie
      const cookies = response.headers['set-cookie'];
      expect(cookies).toBeDefined();
      expect(Array.isArray(cookies)).toBe(true);
      const refreshCookie = cookies.find((c: string) => c.startsWith('refreshToken='));
      expect(refreshCookie).toBeDefined();
      expect(refreshCookie).toContain('HttpOnly');

      // Save for later tests
      userId = response.body.user.id;
      organizationId = response.body.user.organizationId;
      accessToken = response.body.accessToken;

      // Extract refresh token from cookie
      const refreshMatch = refreshCookie.match(/refreshToken=([^;]+)/);
      if (refreshMatch) {
        refreshToken = refreshMatch[1];
      }
    });

    it('should fail to register with missing fields', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'incomplete@example.com',
          // Missing password, name, organizationName
        })
        .expect(400);

      expect(response.body).toHaveProperty('statusCode', 400);
      expect(response.body).toHaveProperty('message');
    });

    it('should fail to register with invalid email format', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          ...testUser,
          email: 'invalid-email',
        })
        .expect(400);

      expect(response.body).toHaveProperty('statusCode', 400);
    });

    it('should fail to register with weak password', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          ...testUser,
          email: 'weakpass@example.com',
          password: '123', // Too weak
        })
        .expect(400);

      expect(response.body).toHaveProperty('statusCode', 400);
    });

    it('should fail to register with duplicate email', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send(testUser)
        .expect(409); // Conflict

      expect(response.body).toHaveProperty('statusCode', 409);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('POST /auth/login', () => {
    it('should login successfully with valid credentials', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        })
        .expect(200);

      expect(response.body).toHaveProperty('message', 'تم تسجيل الدخول بنجاح');
      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('expiresIn');

      // User data
      expect(response.body.user.email).toBe(testUser.email);
      expect(response.body.user).not.toHaveProperty('password');

      // Tokens
      expect(typeof response.body.accessToken).toBe('string');
      accessToken = response.body.accessToken;

      // Check refresh token in cookie
      const cookies = response.headers['set-cookie'];
      expect(cookies).toBeDefined();
      const refreshCookie = cookies.find((c: string) => c.startsWith('refreshToken='));
      expect(refreshCookie).toBeDefined();
    });

    it('should fail to login with non-existent email', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: testUser.password,
        })
        .expect(401);

      expect(response.body).toHaveProperty('statusCode', 401);
    });

    it('should fail to login with incorrect password', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: 'WrongPassword123!',
        })
        .expect(401);

      expect(response.body).toHaveProperty('statusCode', 401);
    });

    it('should fail to login with missing credentials', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: testUser.email,
          // Missing password
        })
        .expect(400);

      expect(response.body).toHaveProperty('statusCode', 400);
    });
  });

  describe('POST /auth/me', () => {
    it('should get current user profile with valid token', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('id', userId);
      expect(response.body.user).toHaveProperty('email', testUser.email);
      expect(response.body.user).toHaveProperty('organizationId', organizationId);
    });

    it('should fail to get profile without authorization token', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/me')
        .expect(401);

      expect(response.body).toHaveProperty('statusCode', 401);
    });

    it('should fail to get profile with invalid token', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/me')
        .set('Authorization', 'Bearer invalid-token-here')
        .expect(401);

      expect(response.body).toHaveProperty('statusCode', 401);
    });
  });

  describe('POST /auth/refresh', () => {
    it('should refresh access token with valid refresh token', async () => {
      // First login to get fresh tokens
      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        })
        .expect(200);

      const cookies = loginResponse.headers['set-cookie'];
      const refreshCookie = cookies.find((c: string) => c.startsWith('refreshToken='));

      // Now refresh using the cookie
      const response = await request(app.getHttpServer())
        .post('/auth/refresh')
        .set('Cookie', refreshCookie)
        .expect(200);

      expect(response.body).toHaveProperty('message', 'تم تحديث الرمز بنجاح');
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('expiresIn');

      // New tokens should be different
      expect(response.body.accessToken).not.toBe(loginResponse.body.accessToken);
    });

    it('should refresh access token with refresh token in body', async () => {
      // First login to get tokens
      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        })
        .expect(200);

      const cookies = loginResponse.headers['set-cookie'];
      const refreshCookie = cookies.find((c: string) => c.startsWith('refreshToken='));
      const refreshMatch = refreshCookie.match(/refreshToken=([^;]+)/);
      const refreshTokenValue = refreshMatch ? refreshMatch[1] : '';

      // Refresh using body instead of cookie
      const response = await request(app.getHttpServer())
        .post('/auth/refresh')
        .send({ refreshToken: refreshTokenValue })
        .expect(200);

      expect(response.body).toHaveProperty('accessToken');
    });

    it('should fail to refresh without refresh token', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/refresh')
        .expect(500); // Will throw error

      expect(response.body).toHaveProperty('statusCode', 500);
    });
  });

  describe('POST /auth/logout', () => {
    it('should logout successfully with valid token', async () => {
      // First login
      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        })
        .expect(200);

      const newAccessToken = loginResponse.body.accessToken;
      const cookies = loginResponse.headers['set-cookie'];
      const refreshCookie = cookies.find((c: string) => c.startsWith('refreshToken='));

      // Now logout
      const response = await request(app.getHttpServer())
        .post('/auth/logout')
        .set('Authorization', `Bearer ${newAccessToken}`)
        .set('Cookie', refreshCookie)
        .expect(200);

      expect(response.body).toHaveProperty('message', 'تم تسجيل الخروج بنجاح');

      // Check that refresh token cookie is cleared
      const logoutCookies = response.headers['set-cookie'];
      if (logoutCookies) {
        const clearedCookie = logoutCookies.find((c: string) =>
          c.startsWith('refreshToken=') && c.includes('Max-Age=0')
        );
        // Cookie should be cleared or have Max-Age=0
        expect(
          clearedCookie ||
          !logoutCookies.find((c: string) => c.startsWith('refreshToken='))
        ).toBeTruthy();
      }
    });

    it('should fail to logout without authorization token', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/logout')
        .expect(401);

      expect(response.body).toHaveProperty('statusCode', 401);
    });

    it('should fail to logout with invalid token', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/logout')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body).toHaveProperty('statusCode', 401);
    });
  });

  describe('Security & Edge Cases', () => {
    it('should not allow SQL injection in email field', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: "admin@example.com' OR '1'='1",
          password: 'anything',
        })
        .expect(401);

      expect(response.body).toHaveProperty('statusCode', 401);
    });

    it('should handle very long passwords gracefully', async () => {
      const veryLongPassword = 'a'.repeat(10000);
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: veryLongPassword,
        })
        .expect(401);

      expect(response.body).toHaveProperty('statusCode', 401);
    });

    it('should handle concurrent login requests', async () => {
      const requests = Array(5).fill(null).map(() =>
        request(app.getHttpServer())
          .post('/auth/login')
          .send({
            email: testUser.email,
            password: testUser.password,
          })
      );

      const responses = await Promise.all(requests);

      // All requests should succeed
      responses.forEach(response => {
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('accessToken');
      });

      // Each should have unique tokens
      const tokens = responses.map(r => r.body.accessToken);
      const uniqueTokens = new Set(tokens);
      expect(uniqueTokens.size).toBe(tokens.length);
    });
  });
});
