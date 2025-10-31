import { test, expect } from '@playwright/test';

/**
 * Authentication E2E Tests
 *
 * Tests the complete user authentication flow:
 * - Registration
 * - Login
 * - Protected routes access
 * - Logout
 */

test.describe('Authentication Flow', () => {
  const testUser = {
    name: 'Test User E2E',
    email: `test-${Date.now()}@example.com`, // Unique email for each test run
    password: 'TestPassword123!',
  };

  test.beforeEach(async ({ page }) => {
    // Navigate to homepage
    await page.goto('/');
  });

  test('should register a new user successfully', async ({ page }) => {
    // Navigate to register page
    await page.click('text=/تسجيل|Register|Sign up/i');
    await expect(page).toHaveURL('/register');

    // Fill registration form
    await page.fill('input[name="name"]', testUser.name);
    await page.fill('input[name="email"]', testUser.email);
    await page.fill('input[name="password"]', testUser.password);
    await page.fill('input[name="confirmPassword"]', testUser.password);

    // Submit form
    await page.click('button[type="submit"]');

    // Wait for redirect to dashboard
    await page.waitForURL('/dashboard', { timeout: 10000 });

    // Verify user is logged in
    await expect(page.locator('text=/مرحباً|Welcome|Hello/i')).toBeVisible();
    await expect(page.locator(`text=${testUser.name}`)).toBeVisible();
  });

  test('should show validation errors for invalid registration', async ({ page }) => {
    // Navigate to register page
    await page.click('text=/تسجيل|Register|Sign up/i');

    // Try to submit empty form
    await page.click('button[type="submit"]');

    // Check for validation errors
    await expect(page.locator('text=/الاسم مطلوب|Name is required/i')).toBeVisible();
    await expect(page.locator('text=/البريد الإلكتروني مطلوب|Email is required/i')).toBeVisible();
    await expect(page.locator('text=/كلمة المرور مطلوبة|Password is required/i')).toBeVisible();
  });

  test('should not allow registration with existing email', async ({ page }) => {
    // First, register a user
    await page.goto('/register');
    await page.fill('input[name="name"]', testUser.name);
    await page.fill('input[name="email"]', testUser.email);
    await page.fill('input[name="password"]', testUser.password);
    await page.fill('input[name="confirmPassword"]', testUser.password);
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');

    // Logout
    await page.click('button:has-text("خروج"), button:has-text("Logout")');
    await page.waitForURL('/login');

    // Try to register again with same email
    await page.goto('/register');
    await page.fill('input[name="name"]', 'Another User');
    await page.fill('input[name="email"]', testUser.email);
    await page.fill('input[name="password"]', testUser.password);
    await page.fill('input[name="confirmPassword"]', testUser.password);
    await page.click('button[type="submit"]');

    // Check for error message
    await expect(
      page.locator('text=/البريد الإلكتروني مستخدم بالفعل|Email already exists/i')
    ).toBeVisible();
  });

  test('should login with valid credentials', async ({ page }) => {
    // Assuming user is already registered
    await page.goto('/login');

    // Fill login form
    await page.fill('input[name="email"]', testUser.email);
    await page.fill('input[name="password"]', testUser.password);

    // Submit form
    await page.click('button[type="submit"]');

    // Wait for redirect to dashboard
    await page.waitForURL('/dashboard', { timeout: 10000 });

    // Verify user is logged in
    await expect(page.locator('text=/مرحباً|Welcome/i')).toBeVisible();
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/login');

    // Fill with invalid credentials
    await page.fill('input[name="email"]', 'invalid@example.com');
    await page.fill('input[name="password"]', 'WrongPassword123!');

    // Submit form
    await page.click('button[type="submit"]');

    // Check for error message
    await expect(
      page.locator('text=/بيانات الدخول غير صحيحة|Invalid credentials/i')
    ).toBeVisible();
  });

  test('should not access protected routes without authentication', async ({ page }) => {
    // Try to access dashboard without logging in
    await page.goto('/dashboard');

    // Should redirect to login page
    await page.waitForURL('/login', { timeout: 5000 });

    // Check for message
    await expect(
      page.locator('text=/يجب تسجيل الدخول|Please login/i')
    ).toBeVisible();
  });

  test('should logout successfully', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('input[name="email"]', testUser.email);
    await page.fill('input[name="password"]', testUser.password);
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');

    // Click logout button
    await page.click('button:has-text("خروج"), button:has-text("Logout")');

    // Should redirect to login or home page
    await page.waitForURL(/\/(login|)/);

    // Try to access dashboard again
    await page.goto('/dashboard');
    await page.waitForURL('/login');
  });

  test('should maintain session across page reloads', async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.fill('input[name="email"]', testUser.email);
    await page.fill('input[name="password"]', testUser.password);
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');

    // Reload page
    await page.reload();

    // Should still be on dashboard (not redirected to login)
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('text=/مرحباً|Welcome/i')).toBeVisible();
  });
});

test.describe('Password Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/register');
  });

  test('should reject weak passwords', async ({ page }) => {
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', '123'); // Too short
    await page.fill('input[name="confirmPassword"]', '123');
    await page.click('button[type="submit"]');

    await expect(
      page.locator('text=/كلمة المرور ضعيفة|Password is too weak|at least/i')
    ).toBeVisible();
  });

  test('should accept strong passwords', async ({ page }) => {
    const strongPassword = 'StrongP@ssw0rd123!';

    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', `strong-${Date.now()}@example.com`);
    await page.fill('input[name="password"]', strongPassword);
    await page.fill('input[name="confirmPassword"]', strongPassword);
    await page.click('button[type="submit"]');

    // Should not show validation error
    await expect(
      page.locator('text=/كلمة المرور ضعيفة|Password is too weak/i')
    ).not.toBeVisible();
  });
});
