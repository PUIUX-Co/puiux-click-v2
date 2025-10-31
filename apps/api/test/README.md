# E2E Tests

## Overview
This directory contains End-to-End (E2E) tests for the PUIUX Click API. These tests verify the complete functionality of the application by making actual HTTP requests to a running instance of the API.

## Test Files
- `auth.e2e-spec.ts` - Authentication flow tests (register, login, logout, refresh, me)
- `sites.e2e-spec.ts` - Sites management tests (CRUD operations, publish/unpublish, multi-tenancy)

## Prerequisites

### Database
E2E tests require a PostgreSQL database. Make sure you have PostgreSQL running and create a test database:

```bash
# Create test database
createdb puiux_click_test

# Run Prisma migrations on test database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/puiux_click_test" pnpm prisma migrate deploy
```

### Environment Variables
E2E tests use `.env.test` file located in the API root directory. Make sure it contains:
- `DATABASE_URL` - pointing to the test database
- `JWT_SECRET` - JWT secret key
- `JWT_REFRESH_SECRET` - JWT refresh secret key
- All other required environment variables (see `.env.example`)

## Running E2E Tests

```bash
# Run all E2E tests
pnpm test:e2e

# Run specific test file
pnpm test:e2e auth.e2e-spec.ts

# Run with verbose output
pnpm test:e2e --verbose
```

## Test Coverage

### Authentication Tests (20 tests)
- **Registration (5 tests)**
  - ✅ Register new user successfully
  - ✅ Fail with missing fields
  - ✅ Fail with invalid email format
  - ✅ Fail with weak password
  - ✅ Fail with duplicate email

- **Login (4 tests)**
  - ✅ Login with valid credentials
  - ✅ Fail with non-existent email
  - ✅ Fail with incorrect password
  - ✅ Fail with missing credentials

- **User Profile (3 tests)**
  - ✅ Get profile with valid token
  - ✅ Fail without token
  - ✅ Fail with invalid token

- **Token Refresh (3 tests)**
  - ✅ Refresh with valid token
  - ✅ Refresh using body instead of cookie
  - ✅ Fail without refresh token

- **Logout (3 tests)**
  - ✅ Logout successfully
  - ✅ Fail without token
  - ✅ Fail with invalid token

- **Security (2 tests)**
  - ✅ Prevent SQL injection
  - ✅ Handle very long passwords
  - ✅ Handle concurrent login requests

### Sites Tests (33 tests)
- **Create Site (5 tests)**
  - ✅ Create successfully
  - ✅ Fail without authentication
  - ✅ Fail with missing fields
  - ✅ Fail with invalid industry
  - ✅ Generate unique slug on conflict

- **List Sites (3 tests)**
  - ✅ Get all sites for organization
  - ✅ Not return sites from other organizations
  - ✅ Fail without authentication

- **Site Statistics (2 tests)**
  - ✅ Get statistics for organization
  - ✅ Show correct stats per organization

- **Get Single Site (4 tests)**
  - ✅ Get by ID successfully
  - ✅ Fail from different organization
  - ✅ Fail with non-existent site
  - ✅ Fail without authentication

- **Update Site (4 tests)**
  - ✅ Update successfully
  - ✅ Fail from different organization
  - ✅ Fail with non-existent site
  - ✅ Fail without authentication

- **Publish Site (3 tests)**
  - ✅ Publish successfully
  - ✅ Fail from different organization
  - ✅ Fail without authentication

- **Public Access (2 tests)**
  - ✅ Get published site by slug (public)
  - ✅ Fail with non-existent slug

- **Unpublish Site (2 tests)**
  - ✅ Unpublish successfully
  - ✅ Fail from different organization

- **Delete Site (4 tests)**
  - ✅ Delete successfully
  - ✅ Fail from different organization
  - ✅ Fail with non-existent site
  - ✅ Fail without authentication

- **Multi-tenancy & Security (4 tests)**
  - ✅ Enforce strict tenant isolation
  - ✅ Prevent cross-tenant updates
  - ✅ Prevent cross-tenant deletions
  - ✅ Verify organization-level access control

## Configuration

### jest-e2e.json
- Uses ts-jest preset for TypeScript support
- Test timeout: 30 seconds
- Loads environment variables from `.env.test` via `setup-e2e.ts`
- Module path mapping for `@/`, `@common/`, `@modules/`

### setup-e2e.ts
- Loads environment variables from `.env.test` before running tests
- Ensures proper configuration for test environment

## Best Practices

1. **Database Cleanup**: Each test suite cleans up its test data before and after running
2. **Test Isolation**: Tests don't depend on each other and can run in any order
3. **Multi-tenancy**: Tests verify that organizations cannot access each other's data
4. **Security**: Tests verify authentication, authorization, and input validation
5. **Real Requests**: Tests make actual HTTP requests using supertest

## Troubleshooting

### "Can't reach database server"
- Make sure PostgreSQL is running
- Verify DATABASE_URL in `.env.test` is correct
- Check that test database exists

### "JWT secret required"
- Verify `.env.test` contains JWT_SECRET and JWT_REFRESH_SECRET
- Make sure `setup-e2e.ts` is loading environment variables

### Tests timing out
- Increase testTimeout in `jest-e2e.json`
- Check database connection is fast
- Verify no hanging promises or open connections

## CI/CD Integration

To run E2E tests in CI/CD pipelines:

```yaml
# Example GitHub Actions workflow
- name: Setup PostgreSQL
  run: |
    docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=postgres postgres:15

- name: Run migrations
  run: |
    DATABASE_URL="postgresql://postgres:postgres@localhost:5432/puiux_click_test" pnpm prisma migrate deploy

- name: Run E2E tests
  run: pnpm test:e2e
```

## Future Improvements

- Add E2E tests for Forms module
- Add E2E tests for AI generation endpoints
- Add performance testing (response times, concurrent users)
- Add rate limiting tests
- Add file upload tests
- Add WebSocket tests (if applicable)
