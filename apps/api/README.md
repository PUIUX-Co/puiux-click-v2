# @puiux/api - Backend API

NestJS backend API for PUIUX Click platform.

## Tech Stack

- **Framework:** NestJS
- **Language:** TypeScript
- **Database:** PostgreSQL 15 + Prisma ORM
- **Cache:** Redis 7
- **Authentication:** JWT + Passport
- **Documentation:** Swagger/OpenAPI
- **Validation:** class-validator + class-transformer

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0
- PostgreSQL >= 15
- Redis >= 7

### Installation

```bash
# From repository root
pnpm install

# Or from this directory
cd apps/api
pnpm install
```

### Database Setup

```bash
# Copy environment file
cp .env.example .env

# Update DATABASE_URL in .env

# Generate Prisma Client
pnpm db:generate

# Run migrations
pnpm db:migrate

# Seed database (optional)
pnpm db:seed

# Open Prisma Studio (database GUI)
pnpm db:studio
```

### Development

```bash
# Start development server (with watch mode)
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start:prod

# Run linter
pnpm lint

# Run type checker
pnpm typecheck

# Run tests
pnpm test

# Run tests with coverage
pnpm test:coverage

# Run E2E tests
pnpm test:e2e
```

## Project Structure

```
src/
├── modules/              # Feature modules
│   ├── auth/            # Authentication
│   ├── users/           # User management
│   ├── sites/           # Site management
│   └── templates/       # Template management
├── common/              # Shared code
│   ├── decorators/      # Custom decorators
│   ├── filters/         # Exception filters
│   ├── guards/          # Auth guards
│   ├── interceptors/    # Response interceptors
│   ├── pipes/           # Validation pipes
│   ├── middleware/      # Custom middleware
│   └── prisma/          # Prisma service
├── config/              # Configuration
│   └── configuration.ts # App config
├── app.module.ts        # Root module
├── app.controller.ts    # Root controller
├── app.service.ts       # Root service
└── main.ts              # Entry point
```

## API Documentation

When running in development mode, Swagger documentation is available at:

```
http://localhost:4000/api/docs
```

## Environment Variables

Copy `.env.example` to `.env` and configure:

**Required:**
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret key for JWT tokens (min 32 characters)

**Optional:**
- `REDIS_HOST` - Redis host (default: localhost)
- `REDIS_PORT` - Redis port (default: 6379)
- `PORT` - API port (default: 4000)

See [.env.example](./.env.example) for complete list.

## Database

### Prisma Commands

```bash
# Generate Prisma Client after schema changes
pnpm db:generate

# Create a new migration
pnpm db:migrate

# Deploy migrations to production
pnpm db:migrate:deploy

# Reset database (WARNING: deletes all data)
pnpm db:reset

# Open Prisma Studio (database GUI)
pnpm db:studio
```

### Multi-Tenancy

This API implements **application-level multi-tenancy** using `organizationId`:

- Every tenant-scoped model has an `organizationId` field
- All queries must filter by `organizationId`
- Indexes on `organizationId` for performance
- Cascade deletes when organization is removed

See [docs/MULTI_TENANCY_STRATEGY.md](../../docs/MULTI_TENANCY_STRATEGY.md) for details.

## Testing

### Unit Tests

```bash
# Run all unit tests
pnpm test

# Watch mode
pnpm test:watch

# With coverage
pnpm test:coverage
```

### E2E Tests

```bash
# Run E2E tests
pnpm test:e2e
```

### Coverage Requirements

- **Minimum:** 80% coverage for all metrics (lines, branches, functions, statements)
- CI will fail if coverage drops below threshold

## Features

### Phase 1 (Current)
- [x] Project setup & configuration
- [x] Database schema (Prisma)
- [x] Health check endpoint
- [ ] Authentication (JWT)
- [ ] User CRUD
- [ ] Site CRUD (template-based)
- [ ] Multi-tenancy middleware

### Phase 2 (Future)
- [ ] Real AI generation (Claude)
- [ ] Email notifications
- [ ] File uploads (S3)
- [ ] Advanced analytics

## Contributing

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for guidelines.

## License

MIT - See [LICENSE](../../LICENSE)
