# PUIUX Click - Website Builder Platform

<div align="center">

**Build professional websites in 2-5 minutes with AI**

[![Status](https://img.shields.io/badge/status-active%20development-success)]()
[![Phase](https://img.shields.io/badge/phase-Phase%200%20Complete-blue)]()
[![Progress](https://img.shields.io/badge/progress-8%25-orange)]()
[![License](https://img.shields.io/badge/license-MIT-green)]()

*موقعك الاحترافي في دقائق - بكبسة زر*

[🚀 Quick Start](#-quick-start) • [📖 Documentation](#-documentation) • [🗺️ Roadmap](./ROADMAP.md) • [🤝 Contributing](./CONTRIBUTING.md)

</div>

---

## 🎯 What is PUIUX Click?

**PUIUX Click** is a modern SaaS platform that empowers users to create professional, multi-lingual websites in **2-5 minutes** using AI-powered builders.

### ✨ Key Features

- 🧙‍♂️ **Smart Wizard** - Step-by-step guided builder (3-5 min)
- 💬 **Chat AI** - Natural conversation with AI (2-4 min)
- 🎤 **Voice Builder** - Hands-free voice commands (2-3 min) *[Phase 2]*
- 🤖 **AI-Powered** - Auto-generates content, design, and SEO
- 🌍 **Multi-lingual** - Arabic-first with English support
- ⚡ **Lightning Fast** - Edge deployment, < 2.5s load time
- 🎨 **30+ Templates** - Industry-specific smart templates
- 💳 **Saudi Payments** - Moyasar, Tap, PayTabs, HyperPay, Stripe, PayPal

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** >= 18.0.0
- **pnpm** >= 8.0.0
- **Docker** (recommended for local development)
- **Git** >= 2.0

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/PUIUX-Co/puiux-click-v2.git
cd puiux-click-v2

# 2. Run setup script (automated)
./scripts/setup.sh

# 3. Start development
pnpm dev
```

**That's it!** 🎉

The setup script will:
- ✅ Install all dependencies
- ✅ Start Docker services (PostgreSQL, Redis, etc.)
- ✅ Setup environment files
- ✅ Run database migrations
- ✅ Start frontend (port 3000) and backend (port 4000)

### Manual Setup

If you prefer manual setup:

```bash
# Install dependencies
pnpm install

# Copy environment files
cp .env.example .env
cp apps/web/.env.example apps/web/.env.local
cp apps/api/.env.example apps/api/.env

# Start Docker services
docker-compose up -d

# Start development servers
pnpm dev
```

---

## 📖 Documentation

### Essential Reading (Read First)

| Document | Description | Time |
|----------|-------------|------|
| [**SESSION_HANDOFF.md**](./SESSION_HANDOFF.md) | Start here! Context for new sessions | 5 min |
| [**PROJECT_STATE.md**](./PROJECT_STATE.md) | Current project status & progress | 3 min |
| [**CURRENT_PHASE.md**](./CURRENT_PHASE.md) | Active phase details & next steps | 2 min |

### Complete Documentation

| Category | Document | Description |
|----------|----------|-------------|
| 📋 **Product** | [PRD](./docs/PRD.md) | Complete Product Requirements Document |
| 🏗️ **Architecture** | [ARCHITECTURE.md](./docs/ARCHITECTURE.md) | System architecture & design |
| 🔄 **Multi-tenancy** | [MULTI_TENANCY_STRATEGY.md](./docs/MULTI_TENANCY_STRATEGY.md) | Multi-tenancy implementation guide |
| 🌿 **Git** | [GIT_STRATEGY.md](./docs/GIT_STRATEGY.md) | Branching strategy & workflow |
| 📁 **Structure** | [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) | Project organization |
| 🗺️ **Roadmap** | [ROADMAP.md](./ROADMAP.md) | 12-14 week development plan |
| 🤝 **Contributing** | [CONTRIBUTING.md](./CONTRIBUTING.md) | Contribution guidelines |
| 📜 **Changelog** | [CHANGELOG.md](./CHANGELOG.md) | Version history |

---

## 🏗️ Project Structure

```
puiux-click-v2/
├── apps/                   # Applications
│   ├── web/               # Next.js 14 frontend (port 3000)
│   ├── api/               # NestJS backend (port 4000)
│   └── cms/               # CMS admin panel (future)
├── packages/              # Shared packages
│   ├── ui/                # UI components library
│   ├── config/            # Shared configurations
│   ├── types/             # TypeScript types
│   ├── utils/             # Utility functions
│   └── ai/                # AI utilities & prompts
├── docs/                  # Documentation
├── scripts/               # Utility scripts
├── database/              # Database migrations & seeds
├── tests/                 # E2E and integration tests
└── .session/              # Session management system
```

See [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) for complete details.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Components:** Shadcn/ui
- **State:** Zustand
- **Forms:** React Hook Form + Zod

### Backend
- **Framework:** NestJS
- **Language:** TypeScript
- **Database:** PostgreSQL 15
- **Cache:** Redis 7
- **ORM:** TypeORM
- **API:** GraphQL + REST

### Infrastructure
- **Monorepo:** pnpm + Turborepo
- **Deployment:** Vercel Edge (frontend), AWS/Azure (backend)
- **CDN:** Cloudflare
- **Storage:** S3 / Azure Blob
- **AI:** Anthropic Claude

---

## 📊 Development Status

**Current Phase:** ✅ Phase 0 - Setup & Documentation (Complete)

**Next Phase:** 🔵 Phase 1 - Core Architecture (Week 2-4)

**Overall Progress:** 8% (Week 1 of 12-14)

### Progress Tracker

```
Phase 0: Setup          [████████████████████] 100% ✅
Phase 1: Core           [░░░░░░░░░░░░░░░░░░░░]   0% 🔵 Next
Phase 2: Builder        [░░░░░░░░░░░░░░░░░░░░]   0%
Phase 3: Features       [░░░░░░░░░░░░░░░░░░░░]   0%
Phase 4: Testing        [░░░░░░░░░░░░░░░░░░░░]   0%
```

See [PROJECT_STATE.md](./PROJECT_STATE.md) for detailed status.

---

## 🎯 Key Decisions

### Technical Decisions
- ✅ **Monorepo** - Better code sharing & unified builds
- ✅ **TypeScript** - Type safety across the stack
- ✅ **Multi-tenancy** - Application-level isolation (Phase 1), RLS optional (Phase 3)
- ✅ **AI Parallel Processing** - 35 seconds faster (20s vs 55s)
- ✅ **Edge Deployment** - Sub-100ms TTFB

### Architectural Decisions
- ✅ **Documentation First** - Complete docs before coding
- ✅ **Session Management** - Zero context loss between sessions
- ✅ **Rebranding Ready** - Single-file brand configuration
- ✅ **Progressive Enhancement** - Deploy fast, improve in background

See [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) for details.

---

## 🤝 Contributing

We welcome contributions! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) first.

### Quick Contribution Steps

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'feat: add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Coding Standards
- ✅ TypeScript for all code
- ✅ Follow ESLint rules
- ✅ Write tests for new features
- ✅ Update documentation
- ✅ Use conventional commits

---

## 📝 Commands Reference

```bash
# Development
pnpm dev              # Start all apps
pnpm dev:web          # Start frontend only
pnpm dev:api          # Start backend only

# Building
pnpm build            # Build all apps
pnpm build:web        # Build frontend
pnpm build:api        # Build backend

# Testing
pnpm test             # Run all tests
pnpm test:watch       # Watch mode
pnpm test:coverage    # With coverage

# Code Quality
pnpm lint             # Lint all code
pnpm lint:fix         # Fix linting issues
pnpm typecheck        # TypeScript check
pnpm format           # Format with Prettier

# Database
pnpm db:migrate       # Run migrations
pnpm db:seed          # Seed database
pnpm db:studio        # Open database studio

# Docker
pnpm docker:up        # Start services
pnpm docker:down      # Stop services
pnpm docker:logs      # View logs
```

---

## 🔧 Environment Variables

Copy `.env.example` to `.env` and configure:

### Essential Variables

```bash
# Application
NODE_ENV=development
APP_NAME=PUIUX Click
APP_URL=http://localhost:3000
API_URL=http://localhost:4000

# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/puiux_click_dev

# Redis
REDIS_URL=redis://localhost:6379

# AI (Anthropic Claude)
ANTHROPIC_API_KEY=your-api-key-here

# JWT
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
```

See [.env.example](./.env.example) for complete list (60+ variables).

---

## 📞 Support & Contact

- 📧 **Email:** support@puiuxclick.com
- 💬 **WhatsApp:** +966XXXXXXXXX
- 🐛 **Issues:** [GitHub Issues](https://github.com/PUIUX-Co/puiux-click-v2/issues)
- 📖 **Docs:** [Complete Documentation](./docs/)

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

---

## 🙏 Acknowledgments

- Built with ❤️ by [PUIUX](https://puiux.com)
- Powered by [Anthropic Claude](https://www.anthropic.com/)
- Designed for the Saudi Arabian market

---

<div align="center">

**[⬆ Back to Top](#puiux-click---website-builder-platform)**

Made with 🤖 [Claude Code](https://claude.com/claude-code)

</div>
