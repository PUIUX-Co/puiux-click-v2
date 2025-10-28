# 📁 PUIUX Click - Project Structure

## 🏗️ هيكل المشروع

```
puiux-click-v2/
│
├── 📱 apps/                          # التطبيقات الرئيسية
│   ├── web/                          # Frontend (Next.js 14+)
│   │   ├── src/
│   │   │   ├── app/                  # App Router
│   │   │   │   ├── (auth)/          # Auth routes
│   │   │   │   ├── (dashboard)/     # Dashboard routes
│   │   │   │   ├── (builder)/       # Builder routes
│   │   │   │   └── api/             # API routes
│   │   │   ├── components/
│   │   │   │   ├── builder/         # Builder components
│   │   │   │   ├── templates/       # Template components
│   │   │   │   ├── ui/              # UI primitives
│   │   │   │   └── shared/          # Shared components
│   │   │   ├── lib/
│   │   │   │   ├── ai/              # AI integration
│   │   │   │   ├── api/             # API client
│   │   │   │   └── utils/           # Utilities
│   │   │   ├── hooks/               # Custom React hooks
│   │   │   ├── stores/              # State management (Zustand)
│   │   │   ├── styles/              # Global styles
│   │   │   └── types/               # TypeScript types
│   │   ├── public/
│   │   │   ├── assets/
│   │   │   ├── templates/
│   │   │   └── fonts/
│   │   ├── next.config.js
│   │   ├── tailwind.config.ts
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   ├── api/                          # Backend (NestJS)
│   │   ├── src/
│   │   │   ├── modules/
│   │   │   │   ├── auth/            # Authentication
│   │   │   │   ├── users/           # User management
│   │   │   │   ├── sites/           # Sites management
│   │   │   │   ├── builder/         # Builder service
│   │   │   │   │   ├── wizard/
│   │   │   │   │   ├── chat/
│   │   │   │   │   └── voice/
│   │   │   │   ├── templates/       # Templates management
│   │   │   │   ├── ai/              # AI service
│   │   │   │   ├── cms/             # CMS engine
│   │   │   │   ├── ecommerce/       # E-commerce
│   │   │   │   ├── payments/        # Payment gateways
│   │   │   │   ├── analytics/       # Analytics
│   │   │   │   └── deployment/      # Deployment service
│   │   │   ├── common/
│   │   │   │   ├── decorators/
│   │   │   │   ├── guards/
│   │   │   │   ├── interceptors/
│   │   │   │   ├── pipes/
│   │   │   │   └── filters/
│   │   │   ├── config/              # Configuration
│   │   │   ├── database/            # Database setup
│   │   │   │   ├── migrations/
│   │   │   │   ├── seeds/
│   │   │   │   └── entities/
│   │   │   ├── graphql/             # GraphQL schemas
│   │   │   └── main.ts
│   │   ├── test/
│   │   ├── nest-cli.json
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   └── cms/                          # CMS Admin Panel (Optional)
│       └── [Future implementation]
│
├── 📦 packages/                      # Shared Packages (Monorepo)
│   ├── ui/                           # Shared UI Components
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   └── styles/
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── config/                       # Shared Configurations
│   │   ├── src/
│   │   │   ├── brand.config.ts      # Brand config (rebranding)
│   │   │   ├── colors.config.ts     # Color system
│   │   │   ├── templates.config.ts  # Templates config
│   │   │   └── constants.ts
│   │   └── package.json
│   │
│   ├── types/                        # Shared TypeScript Types
│   │   ├── src/
│   │   │   ├── builder.types.ts
│   │   │   ├── site.types.ts
│   │   │   ├── user.types.ts
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── utils/                        # Shared Utilities
│   │   ├── src/
│   │   │   ├── string.utils.ts
│   │   │   ├── date.utils.ts
│   │   │   ├── validation.utils.ts
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   └── ai/                           # AI Utilities
│       ├── src/
│       │   ├── claude.client.ts
│       │   ├── prompts/
│       │   └── processors/
│       └── package.json
│
├── 📚 docs/                          # Documentation
│   ├── README.md                     # Overview
│   ├── ARCHITECTURE.md               # System architecture
│   ├── API.md                        # API documentation
│   ├── DEPLOYMENT.md                 # Deployment guide
│   ├── CONTRIBUTING.md               # Contribution guide
│   │
│   ├── architecture/
│   │   ├── system-design.md
│   │   ├── database-schema.md
│   │   ├── api-design.md
│   │   └── security.md
│   │
│   ├── guides/
│   │   ├── getting-started.md
│   │   ├── builder-modes.md
│   │   ├── templates-guide.md
│   │   └── rebranding-guide.md
│   │
│   └── api/
│       ├── rest/
│       └── graphql/
│
├── 🔧 scripts/                       # Utility Scripts
│   ├── setup.sh                      # Project setup
│   ├── dev.sh                        # Development start
│   ├── build.sh                      # Production build
│   ├── test.sh                       # Run tests
│   ├── migrate.sh                    # Database migrations
│   ├── seed.sh                       # Database seeding
│   └── deploy.sh                     # Deployment
│
├── 🗄️ database/                     # Database Files
│   ├── schema.sql                    # SQL schema
│   ├── migrations/                   # Migration files
│   └── seeds/                        # Seed data
│
├── 🧪 tests/                         # E2E Tests
│   ├── e2e/
│   ├── integration/
│   └── fixtures/
│
├── ⚙️ .github/                      # GitHub Configuration
│   ├── workflows/                    # CI/CD workflows
│   │   ├── ci.yml
│   │   ├── cd.yml
│   │   └── tests.yml
│   ├── ISSUE_TEMPLATE/
│   └── PULL_REQUEST_TEMPLATE.md
│
├── 🐳 docker/                        # Docker Configuration
│   ├── Dockerfile.web
│   ├── Dockerfile.api
│   └── docker-compose.yml
│
├── 📝 Config Files (Root)
│   ├── .gitignore
│   ├── .env.example
│   ├── .eslintrc.js
│   ├── .prettierrc
│   ├── turbo.json                    # Turborepo config
│   ├── pnpm-workspace.yaml           # PNPM workspace
│   ├── package.json                  # Root package.json
│   └── tsconfig.json                 # Base TypeScript config
│
└── 📄 Documentation Files
    ├── README.md                     # Main README (PRD)
    ├── PROJECT_STRUCTURE.md          # This file
    ├── ROADMAP.md                    # Development roadmap
    ├── CHANGELOG.md                  # Version history
    └── LICENSE                       # License file
```

---

## 🎯 Key Principles

### 1. Monorepo Structure
- استخدام **Turborepo** أو **pnpm workspaces** لإدارة الـ monorepo
- مشاركة الـ packages بين التطبيقات
- Build optimization مع caching

### 2. Separation of Concerns
- كل module له مسؤولية واضحة
- Shared logic في packages منفصلة
- Clear boundaries بين الـ layers

### 3. Scalability
- Microservices-ready architecture
- مستعد للتوسع الأفقي (Horizontal scaling)
- Database sharding ready

### 4. Developer Experience
- Hot reload في التطوير
- Type safety مع TypeScript
- Automated testing
- Clear documentation

### 5. Production Ready
- Docker containers
- CI/CD pipelines
- Environment configuration
- Monitoring & logging

---

## 📦 Package Manager

**اختيار:** `pnpm` (سريع + موفر للمساحة)

```bash
# Install pnpm
npm install -g pnpm

# Install dependencies
pnpm install

# Run dev
pnpm dev

# Build all
pnpm build

# Test all
pnpm test
```

---

## 🚀 Quick Start Commands

```bash
# 1. Setup project
./scripts/setup.sh

# 2. Start development
./scripts/dev.sh

# 3. Run tests
./scripts/test.sh

# 4. Build for production
./scripts/build.sh

# 5. Deploy
./scripts/deploy.sh
```

---

## 📂 Key Directories Explained

### `/apps/web` - Frontend
- Next.js 14 with App Router
- React Server Components
- Tailwind CSS + Shadcn/ui
- State: Zustand
- Forms: React Hook Form + Zod

### `/apps/api` - Backend
- NestJS framework
- GraphQL + REST APIs
- PostgreSQL with TypeORM
- Redis for caching
- JWT authentication

### `/packages/*` - Shared Code
- DRY principle
- Reusable across apps
- Independently versioned
- Type-safe imports

### `/docs` - Documentation
- Architecture decisions
- API documentation
- Deployment guides
- Developer guides

### `/scripts` - Automation
- Setup automation
- Development helpers
- Deployment scripts
- Maintenance tools

---

## 🔐 Environment Variables

```bash
# Each app has its own .env file:
/apps/web/.env.local          # Frontend env
/apps/api/.env                # Backend env

# Shared secrets in root:
/.env                         # Global secrets (git-ignored)
/.env.example                 # Template for setup
```

---

## 🧪 Testing Strategy

```
├── Unit Tests         → Inside each module
├── Integration Tests  → /apps/*/test/
├── E2E Tests         → /tests/e2e/
└── Load Tests        → /tests/load/
```

---

## 📊 Monitoring Structure

```
Logs → CloudWatch / Datadog
Errors → Sentry
Analytics → Mixpanel / PostHog
Performance → Vercel Analytics
Uptime → UptimeRobot
```

---

## 🔄 Development Workflow

1. **Feature Branch** من `main`
2. **Local Development** مع hot reload
3. **Tests** (unit + integration)
4. **PR** للمراجعة
5. **CI/CD** تشغيل تلقائي
6. **Deploy** على staging ثم production

---

## ✅ Next Steps

1. [ ] إنشاء المجلدات الأساسية
2. [ ] Setup monorepo (pnpm/turborepo)
3. [ ] Initialize Next.js app
4. [ ] Initialize NestJS app
5. [ ] Setup shared packages
6. [ ] Configure TypeScript
7. [ ] Setup ESLint + Prettier
8. [ ] Create Docker configs
9. [ ] Setup CI/CD
10. [ ] Write setup scripts

---

**Last Updated:** 2025-10-28
