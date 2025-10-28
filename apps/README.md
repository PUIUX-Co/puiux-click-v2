# 📱 Applications

This directory contains all the main applications of the PUIUX Click platform.

## Structure

```
apps/
├── web/          # Frontend (Next.js 14)
├── api/          # Backend (NestJS)
└── cms/          # CMS Admin Panel (Future)
```

## Applications

### 🌐 web
**Framework:** Next.js 14 (App Router)

The main frontend application that users interact with. Includes:
- Landing pages
- Builder interface (Wizard, Chat, Voice)
- User dashboard
- Site management
- Live preview

**Tech Stack:**
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Shadcn/ui
- Zustand (State)
- React Hook Form
- Zod validation

**Start:**
```bash
pnpm dev:web
```

---

### 🔧 api
**Framework:** NestJS

The backend API that powers the platform. Includes:
- Authentication & Authorization
- Site building logic
- AI integration
- Database operations
- Payment processing
- File uploads

**Tech Stack:**
- NestJS
- TypeScript
- PostgreSQL
- TypeORM
- Redis
- GraphQL + REST
- JWT

**Start:**
```bash
pnpm dev:api
```

---

### 📝 cms (Future)
**Framework:** TBD

Admin panel for content management.

---

## Development

Each app has its own:
- `package.json` - Dependencies
- `README.md` - Documentation
- `.env.example` - Environment variables
- `tsconfig.json` - TypeScript config

## Commands

```bash
# Start all apps
pnpm dev

# Start specific app
pnpm dev:web
pnpm dev:api

# Build all apps
pnpm build

# Build specific app
pnpm build:web
pnpm build:api

# Test all apps
pnpm test
```

---

**For detailed setup instructions, see each app's README.**
