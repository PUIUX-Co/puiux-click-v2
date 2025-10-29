# @puiux/web - Frontend Application

Next.js 14 frontend application for PUIUX Click platform.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Components:** Shadcn/ui (to be added)
- **State Management:** Zustand
- **Forms:** React Hook Form + Zod
- **HTTP Client:** Axios + React Query
- **UI Library:** Lucide Icons

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0

### Installation

```bash
# From repository root
pnpm install

# Or from this directory
cd apps/web
pnpm install
```

### Development

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linter
pnpm lint

# Run type checker
pnpm typecheck

# Run tests
pnpm test

# Run E2E tests
pnpm test:e2e
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── (auth)/            # Auth routes group
│   ├── (dashboard)/       # Dashboard routes group
│   └── (builder)/         # Builder routes group
├── components/            # React components
│   ├── ui/               # Base UI components (shadcn)
│   ├── forms/            # Form components
│   ├── layouts/          # Layout components
│   └── providers/        # Context providers
├── lib/                  # Utility functions
│   ├── api.ts           # API client
│   ├── utils.ts         # General utilities
│   └── validators.ts    # Zod schemas
├── hooks/               # Custom React hooks
├── store/               # Zustand stores
├── types/               # TypeScript types
└── styles/              # Global styles
```

## Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Required variables:
- `NEXT_PUBLIC_API_URL` - Backend API URL
- `NEXT_PUBLIC_APP_URL` - Frontend URL

## Features

### Phase 1 (Current)
- [x] Project setup & configuration
- [ ] Authentication (Login/Register)
- [ ] User dashboard
- [ ] Smart Wizard (5 steps)
- [ ] Site preview
- [ ] Site publishing

### Phase 2 (Future)
- [ ] Chat AI builder
- [ ] Advanced analytics
- [ ] Custom domains
- [ ] Payment integration

## Contributing

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for guidelines.

## License

MIT - See [LICENSE](../../LICENSE)
