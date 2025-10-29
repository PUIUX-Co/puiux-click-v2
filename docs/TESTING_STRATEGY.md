# 🧪 Testing Strategy

**Date:** 2025-10-29
**Status:** Active - TDD from Day 1
**Coverage Target:** ≥ 80%

---

## 🎯 Philosophy

**We follow Test-Driven Development (TDD):**

```
1. Write test first (RED) ❌
   ↓
2. Write minimal code to pass (GREEN) ✅
   ↓
3. Refactor for quality (REFACTOR) 🔄
   ↓
Repeat
```

**Why TDD?**
- ✅ Forces clear requirements before coding
- ✅ Catches bugs early (cheap to fix)
- ✅ Documentation through examples
- ✅ Confidence in refactoring
- ✅ Better architecture (testable code = good code)

---

## 📊 Testing Pyramid

```
           /\
          /  \
         / E2E \      ← 10% (slow, expensive, brittle)
        /--------\
       /          \
      / Integration\  ← 20% (moderate speed, focused)
     /--------------\
    /                \
   /   Unit Tests     \ ← 70% (fast, cheap, many)
  /____________________\
```

### Distribution:

| Type | Count | % | Speed | Cost | Focus |
|------|-------|---|-------|------|-------|
| **Unit** | ~500 | 70% | < 1ms | Low | Functions, classes, utils |
| **Integration** | ~100 | 20% | < 100ms | Medium | API endpoints, database |
| **E2E** | ~30 | 10% | 5-10s | High | Critical user flows |

---

## 🛠️ Testing Stack

### 1. Unit & Integration Tests: **Jest**

```json
{
  "framework": "Jest",
  "version": "^29.7.0",
  "features": [
    "Fast execution",
    "Built-in mocking",
    "Code coverage",
    "Snapshot testing",
    "Parallel execution"
  ]
}
```

**Configuration:** `jest.config.js`

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  testMatch: ['**/__tests__/**/*.test.ts', '**/*.spec.ts'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.interface.ts',
    '!src/main.ts',
    '!src/**/*.module.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  coverageReporters: ['text', 'lcov', 'html', 'json-summary'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@puiux/(.*)$': '<rootDir>/../../packages/$1/src',
  },
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  testTimeout: 10000,
};
```

### 2. E2E Tests: **Playwright**

```json
{
  "framework": "Playwright",
  "version": "^1.40.0",
  "browsers": ["chromium", "firefox"],
  "features": [
    "Cross-browser testing",
    "Auto-wait",
    "Screenshots on failure",
    "Video recording",
    "Parallel execution"
  ]
}
```

**Configuration:** `playwright.config.ts`

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
  ],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
  ],
  webServer: {
    command: 'pnpm dev',
    port: 3000,
    reuseExistingServer: !process.env.CI,
  },
});
```

### 3. API Testing: **Supertest**

```json
{
  "framework": "Supertest",
  "version": "^6.3.3",
  "use": "Integration tests for REST API"
}
```

---

## 📝 Testing Patterns & Examples

### 1️⃣ Unit Test Example

**File:** `src/services/template.service.spec.ts`

```typescript
import { TemplateService } from './template.service';
import { TemplateRepository } from './template.repository';

describe('TemplateService', () => {
  let service: TemplateService;
  let repository: jest.Mocked<TemplateRepository>;

  beforeEach(() => {
    // Setup: Create mocked dependencies
    repository = {
      findById: jest.fn(),
      findByIndustry: jest.fn(),
    } as any;

    service = new TemplateService(repository);
  });

  describe('getTemplateById', () => {
    it('should return template when found', async () => {
      // Arrange
      const mockTemplate = {
        id: '123',
        industry: 'restaurant',
        variant: 1,
        content: { hero: { title: 'Test' } },
      };
      repository.findById.mockResolvedValue(mockTemplate);

      // Act
      const result = await service.getTemplateById('123');

      // Assert
      expect(result).toEqual(mockTemplate);
      expect(repository.findById).toHaveBeenCalledWith('123');
      expect(repository.findById).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException when template not found', async () => {
      // Arrange
      repository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(service.getTemplateById('999')).rejects.toThrow(
        'Template not found'
      );
    });
  });

  describe('getTemplatesByIndustry', () => {
    it('should return 3 templates for valid industry', async () => {
      // Arrange
      const mockTemplates = [
        { id: '1', industry: 'restaurant', variant: 1 },
        { id: '2', industry: 'restaurant', variant: 2 },
        { id: '3', industry: 'restaurant', variant: 3 },
      ];
      repository.findByIndustry.mockResolvedValue(mockTemplates);

      // Act
      const result = await service.getTemplatesByIndustry('restaurant');

      // Assert
      expect(result).toHaveLength(3);
      expect(result[0].industry).toBe('restaurant');
    });
  });
});
```

### 2️⃣ Integration Test Example (API)

**File:** `tests/integration/auth.test.ts`

```typescript
import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '@/app.module';

describe('AuthController (Integration)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /api/v1/auth/register', () => {
    it('should register new user with valid data', async () => {
      // Arrange
      const userData = {
        email: 'test@example.com',
        password: 'SecurePassword123!',
        name: 'Test User',
      };

      // Act & Assert
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body).toMatchObject({
        user: {
          email: userData.email,
          name: userData.name,
        },
        token: expect.any(String),
      });
      expect(response.body.user).not.toHaveProperty('password');
    });

    it('should reject registration with weak password', async () => {
      // Arrange
      const userData = {
        email: 'test2@example.com',
        password: '123', // Too weak
        name: 'Test User 2',
      };

      // Act & Assert
      await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send(userData)
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain('Password must be');
        });
    });

    it('should reject duplicate email registration', async () => {
      // Arrange
      const userData = {
        email: 'duplicate@example.com',
        password: 'SecurePassword123!',
        name: 'Test User',
      };

      // First registration
      await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send(userData)
        .expect(201);

      // Act & Assert: Second registration should fail
      await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send(userData)
        .expect(409)
        .expect((res) => {
          expect(res.body.message).toContain('Email already exists');
        });
    });
  });

  describe('POST /api/v1/auth/login', () => {
    beforeAll(async () => {
      // Create test user
      await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({
          email: 'login-test@example.com',
          password: 'SecurePassword123!',
          name: 'Login Test',
        });
    });

    it('should login with valid credentials', async () => {
      // Act & Assert
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          email: 'login-test@example.com',
          password: 'SecurePassword123!',
        })
        .expect(200);

      expect(response.body).toMatchObject({
        token: expect.any(String),
        user: {
          email: 'login-test@example.com',
        },
      });
    });

    it('should reject invalid credentials', async () => {
      // Act & Assert
      await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          email: 'login-test@example.com',
          password: 'WrongPassword',
        })
        .expect(401);
    });
  });
});
```

### 3️⃣ E2E Test Example

**File:** `tests/e2e/site-creation.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('Site Creation Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="password"]', 'SecurePassword123!');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');
  });

  test('should complete full wizard flow and publish site', async ({ page }) => {
    // Start wizard
    await page.click('text=Create New Site');
    await expect(page).toHaveURL('/builder/wizard');

    // Step 1: Industry selection
    await expect(page.locator('h1')).toContainText('Choose Your Industry');
    await page.click('[data-industry="restaurant"]');
    await page.click('button:has-text("Next")');

    // Step 2: Business info
    await expect(page.locator('h1')).toContainText('Business Information');
    await page.fill('[name="businessName"]', 'مطعم النخيل');
    await page.fill('[name="description"]', 'أفضل مطعم في الرياض');
    await page.click('button:has-text("Next")');

    // Step 3: Contact details
    await expect(page.locator('h1')).toContainText('Contact Details');
    await page.fill('[name="phone"]', '+966501234567');
    await page.fill('[name="email"]', 'info@alnakheel.com');
    await page.fill('[name="address"]', 'الرياض، المملكة العربية السعودية');
    await page.click('button:has-text("Next")');

    // Step 4: Color selection
    await expect(page.locator('h1')).toContainText('Choose Colors');
    await page.click('[data-palette="modern"]');
    await page.click('button:has-text("Next")');

    // Step 5: Review
    await expect(page.locator('h1')).toContainText('Review Your Site');
    await expect(page.locator('text=مطعم النخيل')).toBeVisible();
    await expect(page.locator('text=+966501234567')).toBeVisible();

    // Generate site
    await page.click('button:has-text("Generate Site")');

    // Wait for generation (with loading state)
    await expect(page.locator('text=Generating your site')).toBeVisible();
    await page.waitForURL('/builder/preview/**', { timeout: 10000 });

    // Preview page
    await expect(page.locator('h1')).toContainText('Preview Your Site');

    // Check iframe preview
    const iframe = page.frameLocator('iframe[data-testid="site-preview"]');
    await expect(iframe.locator('text=مطعم النخيل')).toBeVisible();

    // Publish
    await page.click('button:has-text("Publish Site")');

    // Success modal
    await expect(page.locator('text=Site Published Successfully!')).toBeVisible();
    const siteUrl = await page.locator('[data-testid="site-url"]').textContent();
    expect(siteUrl).toMatch(/^https:\/\/.*\.puiuxclick\.com$/);

    // Visit live site
    await page.click('text=View Live Site');
    await expect(page).toHaveURL(/.*\.puiuxclick\.com/);
    await expect(page.locator('text=مطعم النخيل')).toBeVisible();
  });

  test('should save progress and allow editing', async ({ page }) => {
    // Create site
    await page.click('text=Create New Site');
    await page.click('[data-industry="portfolio"]');
    await page.click('button:has-text("Next")');
    await page.fill('[name="businessName"]', 'Portfolio Test');
    await page.click('button:has-text("Next")');

    // Navigate away (should auto-save)
    await page.click('text=Dashboard');
    await expect(page).toHaveURL('/dashboard');

    // Check drafts
    await expect(page.locator('text=Portfolio Test')).toBeVisible();
    await expect(page.locator('[data-status="draft"]')).toBeVisible();

    // Resume editing
    await page.click('text=Portfolio Test');
    await expect(page).toHaveURL('/builder/wizard');
    await expect(page.getByRole('textbox', { name: 'businessName' })).toHaveValue(
      'Portfolio Test'
    );
  });
});
```

---

## 🎯 Coverage Requirements

### Minimum Thresholds:

```json
{
  "global": {
    "branches": 80,
    "functions": 80,
    "lines": 80,
    "statements": 80
  }
}
```

### What to Test:

✅ **MUST TEST:**
- Business logic
- Data transformations
- Validation logic
- Error handling
- Edge cases
- Security-critical code
- Payment processing
- Authentication & authorization

⚠️ **OPTIONAL:**
- Simple getters/setters
- Type definitions
- Configuration files
- Constants

❌ **DON'T TEST:**
- Third-party libraries
- Framework code
- Auto-generated code

---

## 📦 Test Organization

```
apps/
├── web/
│   ├── src/
│   │   └── components/
│   │       └── Button/
│   │           ├── Button.tsx
│   │           └── Button.test.tsx    ← Unit tests co-located
│   └── tests/
│       └── e2e/
│           └── site-creation.spec.ts  ← E2E tests separate
│
├── api/
│   ├── src/
│   │   └── services/
│   │       └── template.service.ts
│   └── tests/
│       ├── unit/
│       │   └── template.service.spec.ts
│       └── integration/
│           └── auth.test.ts
│
└── tests/                             ← Shared E2E tests
    └── fixtures/
        └── test-data.ts
```

---

## 🚀 Running Tests

### Development:

```bash
# Run all tests
pnpm test

# Watch mode (TDD workflow)
pnpm test:watch

# Specific file
pnpm test template.service.spec.ts

# With coverage
pnpm test:coverage
```

### CI/CD:

```bash
# Full test suite with coverage
pnpm test:coverage

# E2E tests
pnpm test:e2e

# Type checking
pnpm typecheck
```

---

## 🔧 Test Utilities

### Test Fixtures:

```typescript
// tests/fixtures/users.ts
export const mockUser = {
  id: '123',
  email: 'test@example.com',
  name: 'Test User',
  organizationId: 'org-123',
};

export const mockOrganization = {
  id: 'org-123',
  name: 'Test Organization',
  plan: 'starter',
};
```

### Test Helpers:

```typescript
// tests/helpers/auth.ts
export async function createAuthenticatedRequest(app: INestApplication) {
  const response = await request(app.getHttpServer())
    .post('/api/v1/auth/login')
    .send({
      email: 'test@example.com',
      password: 'SecurePassword123!',
    });

  return {
    token: response.body.token,
    headers: { Authorization: `Bearer ${response.body.token}` },
  };
}
```

### Database Seeding:

```typescript
// tests/setup.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

beforeAll(async () => {
  // Clear database
  await prisma.site.deleteMany();
  await prisma.user.deleteMany();

  // Seed test data
  await prisma.user.create({
    data: {
      email: 'test@example.com',
      password: 'hashed_password',
      name: 'Test User',
    },
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});
```

---

## 📊 Test Reporting

### Coverage Report:

```bash
pnpm test:coverage

# Output:
# ---------------------|---------|----------|---------|---------|
# File                 | % Stmts | % Branch | % Funcs | % Lines |
# ---------------------|---------|----------|---------|---------|
# All files            |   85.2  |   82.4   |   86.1  |   85.5  |
#   services/          |   92.1  |   89.3   |   94.2  |   92.5  |
#   controllers/       |   88.3  |   85.1   |   87.9  |   88.7  |
# ---------------------|---------|----------|---------|---------|
```

### E2E Report:

```bash
pnpm test:e2e

# Generates: test-results/index.html
# View: open test-results/index.html
```

---

## 🎓 Best Practices

### 1. Test Naming:

```typescript
// ✅ GOOD: Descriptive, clear intent
it('should reject registration when email already exists', async () => {});

// ❌ BAD: Vague, unclear
it('test email validation', async () => {});
```

### 2. Arrange-Act-Assert (AAA):

```typescript
it('should calculate total price', () => {
  // Arrange: Setup test data
  const items = [
    { price: 10, quantity: 2 },
    { price: 5, quantity: 3 },
  ];

  // Act: Execute the function
  const total = calculateTotal(items);

  // Assert: Verify the result
  expect(total).toBe(35); // (10*2) + (5*3) = 35
});
```

### 3. One Assertion Per Test:

```typescript
// ✅ GOOD: Single responsibility
it('should set status to published', () => {
  const site = publishSite(draft);
  expect(site.status).toBe('published');
});

it('should set publishedAt timestamp', () => {
  const site = publishSite(draft);
  expect(site.publishedAt).toBeInstanceOf(Date);
});

// ❌ BAD: Multiple responsibilities
it('should publish site', () => {
  const site = publishSite(draft);
  expect(site.status).toBe('published');
  expect(site.publishedAt).toBeInstanceOf(Date);
  expect(site.slug).toBe('test-site');
  // What if middle assertion fails? Hard to debug!
});
```

### 4. Avoid Test Interdependence:

```typescript
// ✅ GOOD: Independent tests
beforeEach(() => {
  // Fresh setup for each test
  database.reset();
  user = createTestUser();
});

// ❌ BAD: Tests depend on order
it('1. should create user', () => {
  user = createUser();
});

it('2. should update user', () => {
  // Assumes test 1 ran first!
  updateUser(user.id);
});
```

### 5. Mock External Dependencies:

```typescript
// ✅ GOOD: Mock external API
jest.mock('@anthropic-ai/sdk');
const mockAnthropicClient = {
  messages: {
    create: jest.fn().mockResolvedValue({ content: 'Mocked response' }),
  },
};

// ❌ BAD: Real API call in tests (slow, flaky, expensive!)
const response = await anthropic.messages.create({ ... });
```

---

## 📋 Checklist: Writing New Features

Before marking a feature "done":

- [ ] Unit tests written (and passing)
- [ ] Integration tests for API endpoints
- [ ] E2E tests for critical user flows
- [ ] Coverage ≥ 80% for new code
- [ ] All tests pass locally
- [ ] CI/CD pipeline passes
- [ ] Edge cases covered
- [ ] Error handling tested
- [ ] Documentation updated

---

## 🎯 Testing Milestones

### Week 2-3: Foundation
- [ ] Testing infrastructure setup
- [ ] Jest & Playwright configured
- [ ] First unit tests for auth service
- [ ] First integration tests for auth API
- [ ] CI/CD enforces coverage

### Week 4-5: Builder Tests
- [ ] Template service tests
- [ ] Site generation tests
- [ ] Wizard flow E2E test
- [ ] Preview & publish E2E test

### Week 6: Pre-Launch
- [ ] All critical flows have E2E tests
- [ ] Coverage ≥ 80% achieved
- [ ] Load testing (optional)
- [ ] Security testing (OWASP checks)

---

**Status:** ✅ Ready to implement
**Next:** Begin with auth tests (TDD)
**Updated:** 2025-10-29
