# 📦 Shared Packages

This directory contains shared packages used across multiple applications in the monorepo.

## Structure

```
packages/
├── ui/           # Shared UI Components
├── config/       # Shared Configurations
├── types/        # TypeScript Type Definitions
├── utils/        # Utility Functions
└── ai/           # AI Utilities & Prompts
```

## Packages

### 🎨 @puiux/ui
Shared React components library.

**Includes:**
- Button, Input, Modal, etc.
- Form components
- Layout components
- Hooks
- Styles

**Usage:**
```typescript
import { Button, Input } from '@puiux/ui';
```

---

### ⚙️ @puiux/config
Shared configuration files.

**Includes:**
- Brand configuration (rebranding)
- Color system
- Template configurations
- Constants

**Usage:**
```typescript
import { BRAND_CONFIG, COLOR_SYSTEM } from '@puiux/config';
```

---

### 📝 @puiux/types
Shared TypeScript types and interfaces.

**Includes:**
- Builder types
- Site types
- User types
- API types

**Usage:**
```typescript
import type { SiteBlueprint, UserProfile } from '@puiux/types';
```

---

### 🛠️ @puiux/utils
Utility functions used across the platform.

**Includes:**
- String utilities
- Date utilities
- Validation helpers
- Formatters

**Usage:**
```typescript
import { slugify, formatDate } from '@puiux/utils';
```

---

### 🤖 @puiux/ai
AI-related utilities and prompts.

**Includes:**
- Claude client
- Prompt templates
- AI processors
- Parallel execution

**Usage:**
```typescript
import { ClaudeClient, generateContent } from '@puiux/ai';
```

---

## Creating a New Package

```bash
# Create package directory
mkdir packages/my-package
cd packages/my-package

# Initialize package
pnpm init

# Update package.json name
{
  "name": "@puiux/my-package",
  "version": "0.0.0",
  "private": true,
  "main": "./src/index.ts"
}

# Create src directory
mkdir src
touch src/index.ts
```

## Package Naming Convention

All packages follow the naming pattern:
```
@puiux/<package-name>
```

Examples:
- `@puiux/ui`
- `@puiux/config`
- `@puiux/types`

---

## Development

Packages are automatically linked in the monorepo workspace.

### Installing Package in an App

```json
// In apps/web/package.json
{
  "dependencies": {
    "@puiux/ui": "workspace:*",
    "@puiux/config": "workspace:*"
  }
}
```

### Building Packages

Some packages need to be built before use:

```bash
# Build all packages
pnpm --filter "@puiux/*" build

# Build specific package
pnpm --filter @puiux/ui build
```

---

## Best Practices

1. **Keep packages small and focused**
   - Each package should have a single responsibility

2. **Export everything through index.ts**
   ```typescript
   // src/index.ts
   export * from './components';
   export * from './hooks';
   export * from './types';
   ```

3. **Use TypeScript**
   - All packages should be fully typed

4. **Write tests**
   - Each package should have tests

5. **Document exports**
   - Use JSDoc comments for public APIs

6. **Version independently**
   - Use changesets for versioning

---

## Dependencies

Packages can depend on other packages:

```typescript
// @puiux/ui can use @puiux/types
import type { ButtonProps } from '@puiux/types';
```

But avoid circular dependencies!

---

## Publishing (Future)

Currently, packages are private and only used within the monorepo.

In the future, we may publish selected packages to npm.

---

**For detailed information about each package, see its individual README.**
