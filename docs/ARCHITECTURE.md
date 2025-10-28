# 🏗️ PUIUX Click - System Architecture

## 📋 Table of Contents

1. [Overview](#overview)
2. [High-Level Architecture](#high-level-architecture)
3. [Frontend Architecture](#frontend-architecture)
4. [Backend Architecture](#backend-architecture)
5. [Database Design](#database-design)
6. [AI Integration](#ai-integration)
7. [Multi-Tenancy](#multi-tenancy)
8. [Deployment Architecture](#deployment-architecture)
9. [Security](#security)
10. [Performance](#performance)

---

## Overview

PUIUX Click is a modern SaaS platform built on a **monorepo architecture** using cutting-edge technologies to deliver fast, scalable, and maintainable websites in minutes.

### Core Principles

1. **Speed First**: 2-5 minutes from start to published site
2. **AI-Powered**: Parallel AI processing for content generation
3. **Multi-tenant**: Isolated data per user/organization
4. **Scalable**: Ready for horizontal scaling
5. **Developer-Friendly**: TypeScript, monorepo, clear structure

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         End Users                            │
│                    (Web Browsers, Mobile)                    │
└───────────────────┬─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────────┐
│                      CDN / Edge Network                      │
│                  (Vercel Edge / Cloudflare)                  │
└───────────────────┬─────────────────────────────────────────┘
                    │
        ┌───────────┴───────────┐
        ▼                       ▼
┌───────────────┐       ┌───────────────┐
│   Frontend    │       │   Backend     │
│   (Next.js)   │◄─────►│   (NestJS)    │
│   Port: 3000  │       │   Port: 4000  │
└───────┬───────┘       └───────┬───────┘
        │                       │
        │              ┌────────┴────────┐
        │              ▼                 ▼
        │      ┌──────────────┐  ┌─────────────┐
        │      │  PostgreSQL  │  │    Redis    │
        │      │  Port: 5432  │  │  Port: 6379 │
        │      └──────────────┘  └─────────────┘
        │
        └──────────────┐
                       ▼
               ┌──────────────┐
               │  External    │
               │  Services    │
               ├──────────────┤
               │ • Claude AI  │
               │ • S3/CDN     │
               │ • Payments   │
               │ • Email      │
               └──────────────┘
```

---

## Frontend Architecture

### Tech Stack

```typescript
Frontend: Next.js 14 (App Router)
UI Library: React 18
Styling: Tailwind CSS + Shadcn/ui
State: Zustand
Forms: React Hook Form + Zod
i18n: next-intl
```

### Directory Structure

```
apps/web/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Auth layout group
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (dashboard)/       # Dashboard layout group
│   │   │   ├── sites/
│   │   │   ├── settings/
│   │   │   └── billing/
│   │   ├── (builder)/         # Builder layout group
│   │   │   ├── wizard/
│   │   │   ├── chat/
│   │   │   └── voice/
│   │   └── api/               # API routes
│   │
│   ├── components/
│   │   ├── builder/           # Builder-specific
│   │   ├── templates/         # Template components
│   │   ├── ui/                # Shadcn/ui primitives
│   │   └── shared/            # Shared components
│   │
│   ├── lib/
│   │   ├── ai/                # AI integration
│   │   ├── api/               # API client (GraphQL/REST)
│   │   ├── auth/              # Auth utilities
│   │   └── utils/             # General utilities
│   │
│   ├── hooks/                 # Custom React hooks
│   ├── stores/                # Zustand stores
│   ├── types/                 # TypeScript types
│   └── styles/                # Global styles
│
└── public/                    # Static assets
```

### Key Features

#### 1. App Router (Next.js 14)

```typescript
// Server Components by default
export default async function Page() {
  const data = await fetchData(); // No client-side fetch!
  return <View data={data} />;
}

// Client Components when needed
'use client';
export function InteractiveComponent() {
  const [state, setState] = useState();
  // ...
}
```

#### 2. State Management (Zustand)

```typescript
// stores/builder.store.ts
export const useBuilderStore = create<BuilderState>((set) => ({
  mode: 'wizard',
  step: 1,
  data: {},
  setMode: (mode) => set({ mode }),
  nextStep: () => set((state) => ({ step: state.step + 1 })),
}));
```

#### 3. API Integration

```typescript
// lib/api/client.ts
export class APIClient {
  async query<T>(query: string, variables?: any): Promise<T> {
    // GraphQL queries
  }

  async fetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
    // REST API calls
  }
}
```

---

## Backend Architecture

### Tech Stack

```typescript
Backend: NestJS
Database: PostgreSQL 15
ORM: TypeORM
Cache: Redis
GraphQL: Apollo Server
API: REST + GraphQL
Auth: JWT + Passport
```

### Directory Structure

```
apps/api/
├── src/
│   ├── modules/                # Feature modules
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.module.ts
│   │   │   ├── strategies/
│   │   │   └── guards/
│   │   │
│   │   ├── users/
│   │   ├── sites/
│   │   ├── builder/
│   │   │   ├── wizard/
│   │   │   ├── chat/
│   │   │   └── voice/
│   │   ├── templates/
│   │   ├── ai/
│   │   ├── cms/
│   │   ├── ecommerce/
│   │   ├── payments/
│   │   └── deployment/
│   │
│   ├── common/                 # Shared utilities
│   │   ├── decorators/
│   │   ├── guards/
│   │   ├── interceptors/
│   │   ├── pipes/
│   │   └── filters/
│   │
│   ├── config/                 # Configuration
│   │   ├── database.config.ts
│   │   ├── redis.config.ts
│   │   └── app.config.ts
│   │
│   ├── database/
│   │   ├── entities/
│   │   ├── migrations/
│   │   └── seeds/
│   │
│   └── graphql/
│       ├── schema.graphql
│       └── resolvers/
│
└── test/                       # Tests
```

### Module Architecture

```typescript
// Example: Builder Module
@Module({
  imports: [
    TypeOrmModule.forFeature([Site, Page, Template]),
    AIModule,
    TemplatesModule,
    DeploymentModule,
  ],
  controllers: [BuilderController],
  providers: [
    BuilderService,
    WizardBuilderService,
    ChatBuilderService,
    VoiceBuilderService,
  ],
  exports: [BuilderService],
})
export class BuilderModule {}
```

### Request Flow

```
1. Request → Middleware (logging, etc.)
2. Guards (authentication, authorization)
3. Interceptors (transform request)
4. Controller (route handler)
5. Pipes (validation)
6. Service (business logic)
7. Repository (database)
8. Response ← Interceptors (transform response)
```

---

## Database Design

### Overview

```sql
PostgreSQL 15
Multi-tenant: Row-Level Security (RLS)
Migrations: TypeORM
Backups: Automated daily
```

### Core Tables

```
users
├── organizations
│   ├── sites
│   │   ├── pages
│   │   ├── sections
│   │   ├── components
│   │   └── assets
│   │
│   ├── subscriptions
│   └── invoices
│
templates
├── template_categories
└── template_sections

cms_collections
├── cms_entries
└── cms_fields

products
├── categories
├── orders
└── order_items
```

### Multi-Tenancy Strategy

```sql
-- Row-Level Security (RLS)
CREATE POLICY tenant_isolation ON sites
  USING (organization_id = current_setting('app.current_tenant')::uuid);

-- All queries automatically filtered by tenant
SELECT * FROM sites;  -- Only returns sites for current tenant
```

### Indexes

```sql
-- Performance indexes
CREATE INDEX idx_sites_organization ON sites(organization_id);
CREATE INDEX idx_pages_site ON pages(site_id);
CREATE INDEX idx_sites_domain ON sites(domain);
CREATE INDEX idx_users_email ON users(email);
```

---

## AI Integration

### Architecture

```
┌────────────────┐
│   Client       │
└────────┬───────┘
         │
         ▼
┌────────────────┐
│ Builder Service│
└────────┬───────┘
         │
         ▼
┌────────────────┐      ┌──────────────┐
│   AI Service   │─────►│ Claude API   │
│  (Parallel)    │      │ (Anthropic)  │
└────────┬───────┘      └──────────────┘
         │
         ▼
┌────────────────────────────────┐
│     Promise.all([              │
│       generateBrand(),         │
│       generateContent(),       │
│       selectImages(),          │
│       generateSEO(),           │
│       generateLayout()         │
│     ])                         │
└────────────────────────────────┘
```

### Implementation

```typescript
class AIService {
  async buildSiteParallel(input: UserInput): Promise<SiteBlueprint> {
    // Execute all AI tasks in parallel
    const [brand, content, images, seo, layout] = await Promise.all([
      this.generateBrand(input), // 10s
      this.generateContent(input), // 20s (longest)
      this.selectImages(input), // 5s
      this.generateSEO(input), // 8s
      this.generateLayout(input), // 12s
    ]);

    // Total: ~20s (not 55s!)
    return this.assemble({ brand, content, images, seo, layout });
  }
}
```

---

## Multi-Tenancy

### Strategy

**Approach:** Schema-based isolation with Row-Level Security (RLS)

```typescript
// Every request includes tenant context
interface TenantContext {
  tenantId: string;
  userId: string;
  organizationId: string;
}

// Middleware sets context
app.use((req, res, next) => {
  req.tenant = extractTenant(req);
  next();
});

// All queries automatically scoped
const sites = await siteRepository.find(); // Only this tenant's sites
```

### Domain Routing

```
user1.puiuxclick.com → Tenant A
user2.puiuxclick.com → Tenant B
custom-domain.com    → Tenant C (custom domain)
```

---

## Deployment Architecture

### Production Setup

```
┌─────────────────────────────────────┐
│         Cloudflare DNS              │
│     (Domain Management + DDoS)      │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│      Vercel Edge Network            │
│   (Next.js Frontend + Edge SSR)     │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│     Load Balancer (AWS/Azure)       │
└──────────────┬──────────────────────┘
               │
       ┌───────┴───────┐
       ▼               ▼
┌─────────────┐ ┌─────────────┐
│  API Node 1 │ │  API Node 2 │
└──────┬──────┘ └──────┬──────┘
       │               │
       └───────┬───────┘
               ▼
┌─────────────────────────────────────┐
│       Database Cluster              │
│   Primary + Read Replicas           │
└─────────────────────────────────────┘
```

### Scaling Strategy

1. **Horizontal Scaling**: Add more API nodes
2. **Database**: Read replicas + connection pooling
3. **Cache**: Redis cluster
4. **CDN**: Static assets on edge
5. **Edge**: SSR on Vercel Edge

---

## Security

### Layers

```
1. Network: Cloudflare WAF + DDoS
2. Application: Rate limiting, input validation
3. Authentication: JWT + refresh tokens
4. Authorization: RBAC + RLS
5. Data: Encryption at rest + in transit
6. Monitoring: Sentry + logging
```

### Authentication Flow

```
1. User login → credentials
2. Verify → password hash (bcrypt)
3. Generate → JWT access token (15m)
4. Generate → Refresh token (7d)
5. Return → tokens to client
6. Client → stores in httpOnly cookies
7. Requests → include access token
8. Expired → use refresh token
```

---

## Performance

### Targets

```
⏱️ Time-to-Site: < 5 min
🚀 LCP: < 2.5s
📊 CLS: < 0.1
⚡ TTI: < 3.5s
🎯 Lighthouse: > 90
```

### Optimizations

1. **Frontend**
   - Next.js SSR/SSG
   - Image optimization (WebP, AVIF)
   - Code splitting
   - Tree shaking
   - Lazy loading

2. **Backend**
   - Redis caching
   - Database indexing
   - Connection pooling
   - Query optimization
   - N+1 prevention

3. **AI**
   - Parallel processing
   - Prompt caching
   - Response streaming
   - Rate limiting

4. **Deployment**
   - Edge deployment
   - CDN for static assets
   - Gzip/Brotli compression
   - HTTP/2 + HTTP/3

---

## Monitoring & Observability

### Stack

```
Errors:      Sentry
Logs:        CloudWatch / Datadog
Metrics:     Prometheus + Grafana
Uptime:      UptimeRobot
Analytics:   Mixpanel / PostHog
APM:         New Relic / DataDog
```

### Key Metrics

```typescript
// Application Metrics
- Request rate (req/s)
- Response time (p50, p95, p99)
- Error rate (%)
- Database query time
- Cache hit rate
- AI processing time

// Business Metrics
- Sites created/day
- Active users
- Conversion rate
- MRR growth
- NPS score
```

---

## Technology Stack Summary

### Frontend
- **Framework:** Next.js 14
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Components:** Shadcn/ui
- **State:** Zustand
- **Forms:** React Hook Form

### Backend
- **Framework:** NestJS
- **Language:** TypeScript
- **Database:** PostgreSQL 15
- **Cache:** Redis 7
- **ORM:** TypeORM
- **API:** GraphQL + REST

### Infrastructure
- **Hosting:** Vercel (Frontend), AWS/Azure (Backend)
- **CDN:** Cloudflare
- **Database:** AWS RDS / Azure Database
- **Storage:** S3 / Azure Blob
- **Email:** SendGrid / AWS SES

### External Services
- **AI:** Anthropic Claude
- **Payments:** Moyasar, Tap, Stripe, PayPal
- **Monitoring:** Sentry, Datadog
- **Analytics:** Mixpanel

---

**Last Updated:** 2025-10-28
**Version:** 2.0
