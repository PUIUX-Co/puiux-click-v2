# 🤝 Contributing to PUIUX Click

شكراً لاهتمامك بالمساهمة في PUIUX Click! هذا الدليل يشرح كيفية المساهمة في المشروع.

---

## 📋 Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Workflow](#development-workflow)
4. [Coding Standards](#coding-standards)
5. [Commit Guidelines](#commit-guidelines)
6. [Pull Request Process](#pull-request-process)
7. [Testing](#testing)
8. [Documentation](#documentation)

---

## 🤝 Code of Conduct

نتوقع من جميع المساهمين:
- الاحترام والمهنية
- التواصل البناء
- التركيز على الجودة
- المساعدة المتبادلة

---

## 🚀 Getting Started

### Prerequisites

```bash
Node.js: >= 18.x
pnpm: >= 8.x
PostgreSQL: >= 15.x
Redis: >= 7.x
Git: >= 2.x
```

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/PUIUX-Co/puiux-click-v2.git
cd puiux-click-v2

# 2. Install pnpm (if not installed)
npm install -g pnpm

# 3. Install dependencies
pnpm install

# 4. Copy environment files
cp .env.example .env
cp apps/web/.env.example apps/web/.env.local
cp apps/api/.env.example apps/api/.env

# 5. Setup database
pnpm db:setup

# 6. Start development servers
pnpm dev
```

### Verify Setup

```bash
# Run tests
pnpm test

# Run linter
pnpm lint

# Build all apps
pnpm build
```

---

## 🔄 Development Workflow

### 1. Create a Feature Branch

```bash
# Update main branch
git checkout main
git pull origin main

# Create feature branch
git checkout -b feature/your-feature-name

# Or for bug fixes
git checkout -b fix/bug-description

# Or for documentation
git checkout -b docs/what-you-are-documenting
```

### 2. Make Your Changes

```bash
# Start development server
pnpm dev

# Make changes...
# Test your changes...

# Run linter
pnpm lint

# Run tests
pnpm test
```

### 3. Commit Your Changes

Follow our [commit guidelines](#commit-guidelines):

```bash
git add .
git commit -m "feat: add new feature"
```

### 4. Push to GitHub

```bash
git push origin feature/your-feature-name
```

### 5. Create Pull Request

- Go to GitHub repository
- Click "New Pull Request"
- Fill in the PR template
- Request review

---

## 💻 Coding Standards

### TypeScript

```typescript
// ✅ Good
interface User {
  id: string;
  name: string;
  email: string;
}

function getUser(id: string): Promise<User> {
  // Implementation
}

// ❌ Bad
function getUser(id: any): any {
  // Implementation
}
```

### React Components

```typescript
// ✅ Good - Functional component with TypeScript
interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

export function Button({ label, onClick, disabled = false }: ButtonProps) {
  return (
    <button onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
}

// ❌ Bad - No types, inline styles
export function Button(props) {
  return (
    <button style={{ color: 'red' }} onClick={props.onClick}>
      {props.label}
    </button>
  );
}
```

### Naming Conventions

```typescript
// Components: PascalCase
export function UserProfile() {}

// Functions: camelCase
function fetchUserData() {}

// Constants: UPPER_SNAKE_CASE
const API_BASE_URL = 'https://api.example.com';

// Interfaces: PascalCase with 'I' prefix (optional)
interface IUserData {}
// Or without prefix
interface UserData {}

// Types: PascalCase
type ResponseData = {};

// Enums: PascalCase
enum UserRole {
  Admin = 'admin',
  User = 'user',
}
```

### File Structure

```
component/
├── Component.tsx           # Component implementation
├── Component.test.tsx      # Tests
├── Component.stories.tsx   # Storybook stories (if applicable)
├── Component.module.css    # Styles (if not using Tailwind)
└── index.ts               # Barrel export
```

### Code Style

- Use **2 spaces** for indentation
- Use **single quotes** for strings
- Use **semicolons**
- Max line length: **100 characters**
- Use **trailing commas**

```typescript
// ✅ Good
const user = {
  name: 'John',
  email: 'john@example.com',
};

// ❌ Bad
const user = {
  name: "John",
  email: "john@example.com"
}
```

### ESLint & Prettier

```bash
# Format code
pnpm format

# Check linting
pnpm lint

# Fix linting issues
pnpm lint:fix
```

---

## 📝 Commit Guidelines

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: ميزة جديدة
- **fix**: إصلاح خطأ
- **docs**: تغييرات في التوثيق
- **style**: تنسيق الكود (لا يؤثر على الوظيفة)
- **refactor**: إعادة هيكلة الكود
- **perf**: تحسينات الأداء
- **test**: إضافة أو تعديل الاختبارات
- **chore**: مهام صيانة
- **ci**: تغييرات في CI/CD

### Examples

```bash
# Feature
feat(builder): add wizard step navigation

# Bug fix
fix(auth): resolve login token expiration issue

# Documentation
docs(readme): update installation instructions

# Refactor
refactor(api): simplify user service logic

# Performance
perf(templates): optimize template rendering speed
```

### Commit Rules

1. استخدم المضارع: "add feature" وليس "added feature"
2. لا تنهي بنقطة
3. اجعله وصفياً ومختصراً
4. أضف scope إذا كان منطقياً
5. استخدم body للتفاصيل الإضافية

### Atomic Commits

```bash
# ✅ Good - Each commit is a logical unit
git commit -m "feat(auth): add login form"
git commit -m "feat(auth): add JWT validation"
git commit -m "test(auth): add login tests"

# ❌ Bad - Too many changes in one commit
git commit -m "add login, signup, tests, and fix bugs"
```

---

## 🔀 Pull Request Process

### Before Creating PR

- [ ] Code follows coding standards
- [ ] All tests pass (`pnpm test`)
- [ ] Linter passes (`pnpm lint`)
- [ ] Build succeeds (`pnpm build`)
- [ ] Documentation updated (if needed)
- [ ] Commit messages follow guidelines

### PR Title Format

```
<type>(<scope>): <description>

Examples:
feat(builder): add chat AI mode
fix(payments): resolve Moyasar webhook issue
docs(api): add GraphQL schema documentation
```

### PR Description Template

```markdown
## Description
[Describe what this PR does]

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Related Issues
Closes #123

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed

## Screenshots (if applicable)
[Add screenshots]

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings
- [ ] Tests added and passing
```

### Review Process

1. **Automated Checks**: CI/CD runs automatically
2. **Code Review**: At least 1 approval required
3. **Testing**: QA team tests (if applicable)
4. **Merge**: Squash and merge to main

### Review Time

- Minor fixes: 1-2 hours
- Features: 1-2 days
- Major changes: 2-5 days

---

## 🧪 Testing

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Run E2E tests
pnpm test:e2e
```

### Writing Tests

#### Unit Tests

```typescript
// UserService.test.ts
import { UserService } from './UserService';

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    service = new UserService();
  });

  it('should create a user', async () => {
    const user = await service.create({
      name: 'John',
      email: 'john@example.com',
    });

    expect(user).toBeDefined();
    expect(user.email).toBe('john@example.com');
  });
});
```

#### Component Tests

```typescript
// Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('should render with label', () => {
    render(<Button label="Click me" onClick={() => {}} />);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('should call onClick when clicked', () => {
    const onClick = jest.fn();
    render(<Button label="Click me" onClick={onClick} />);

    fireEvent.click(screen.getByText('Click me'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
```

### Test Coverage Goals

- Unit Tests: **> 80%**
- Integration Tests: **> 70%**
- E2E Tests: **Critical paths covered**

---

## 📚 Documentation

### Code Comments

```typescript
// ✅ Good - Explains WHY, not WHAT
// Using exponential backoff to handle API rate limits
async function retryWithBackoff(fn: Function, maxRetries = 3) {
  // Implementation
}

// ❌ Bad - States the obvious
// This function retries
async function retryWithBackoff(fn: Function, maxRetries = 3) {
  // Implementation
}
```

### JSDoc

```typescript
/**
 * Creates a new user in the database
 *
 * @param data - The user data to create
 * @returns The created user object
 * @throws {ValidationError} If the data is invalid
 * @throws {DuplicateError} If the email already exists
 *
 * @example
 * ```ts
 * const user = await createUser({
 *   name: 'John',
 *   email: 'john@example.com'
 * });
 * ```
 */
async function createUser(data: CreateUserDto): Promise<User> {
  // Implementation
}
```

### README Files

كل package/module يجب أن يحتوي على README.md:

```markdown
# Package Name

Brief description

## Installation
## Usage
## API
## Examples
```

---

## 🐛 Bug Reports

### Before Reporting

1. Search existing issues
2. Check if it's already fixed in `main`
3. Reproduce the bug
4. Collect error messages/logs

### Bug Report Template

```markdown
**Describe the bug**
A clear description of the bug

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What should happen

**Screenshots**
If applicable

**Environment:**
- OS: [e.g. macOS]
- Browser: [e.g. Chrome 120]
- Version: [e.g. 1.0.0]

**Additional context**
Any other relevant information
```

---

## 💡 Feature Requests

### Feature Request Template

```markdown
**Is your feature request related to a problem?**
A clear description

**Describe the solution**
What you want to happen

**Describe alternatives**
Other solutions you've considered

**Additional context**
Mockups, examples, etc.
```

---

## 📞 Getting Help

- **Documentation**: Check `/docs` folder
- **Issues**: Search GitHub issues
- **Discussions**: GitHub Discussions
- **Email**: dev@puiux.com

---

## 🎯 Priority Labels

- `P0`: Critical - fix immediately
- `P1`: High - fix in current sprint
- `P2`: Medium - fix in next sprint
- `P3`: Low - fix when possible

---

## ✅ Definition of Done

A task is "done" when:

- [ ] Code written and reviewed
- [ ] Tests written and passing
- [ ] Documentation updated
- [ ] No linting errors
- [ ] PR approved and merged
- [ ] Deployed to staging
- [ ] QA tested (if applicable)

---

## 🙏 Thank You!

شكراً لمساهمتك في PUIUX Click! كل مساهمة تساعد في تحسين المنصة.

---

**Last Updated:** 2025-10-28
