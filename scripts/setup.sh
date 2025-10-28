#!/bin/bash

# PUIUX Click - Setup Script
# This script sets up the development environment

set -e

echo "🚀 PUIUX Click - Development Setup"
echo "=================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
print_step() {
  echo -e "${BLUE}▶ $1${NC}"
}

print_success() {
  echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
  echo -e "${RED}✗ $1${NC}"
}

print_warning() {
  echo -e "${YELLOW}⚠ $1${NC}"
}

# Check if command exists
command_exists() {
  command -v "$1" >/dev/null 2>&1
}

# Step 1: Check prerequisites
print_step "Step 1: Checking prerequisites..."

if ! command_exists node; then
  print_error "Node.js is not installed. Please install Node.js >= 18"
  exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
  print_error "Node.js version must be >= 18. Current: $(node -v)"
  exit 1
fi
print_success "Node.js $(node -v) ✓"

if ! command_exists pnpm; then
  print_warning "pnpm is not installed. Installing..."
  npm install -g pnpm
  print_success "pnpm installed"
else
  print_success "pnpm $(pnpm -v) ✓"
fi

if ! command_exists git; then
  print_error "Git is not installed. Please install Git"
  exit 1
fi
print_success "Git $(git --version | cut -d' ' -f3) ✓"

if ! command_exists docker; then
  print_warning "Docker is not installed. You'll need Docker for local database."
else
  print_success "Docker $(docker --version | cut -d' ' -f3) ✓"
fi

echo ""

# Step 2: Install dependencies
print_step "Step 2: Installing dependencies..."
pnpm install
print_success "Dependencies installed"
echo ""

# Step 3: Setup environment files
print_step "Step 3: Setting up environment files..."

if [ ! -f .env ]; then
  cp .env.example .env
  print_success ".env created"
else
  print_warning ".env already exists (skipping)"
fi

if [ ! -f apps/web/.env.local ]; then
  if [ -f apps/web/.env.example ]; then
    cp apps/web/.env.example apps/web/.env.local
    print_success "apps/web/.env.local created"
  fi
else
  print_warning "apps/web/.env.local already exists (skipping)"
fi

if [ ! -f apps/api/.env ]; then
  if [ -f apps/api/.env.example ]; then
    cp apps/api/.env.example apps/api/.env
    print_success "apps/api/.env created"
  fi
else
  print_warning "apps/api/.env already exists (skipping)"
fi

echo ""

# Step 4: Start Docker services
print_step "Step 4: Starting Docker services..."

if command_exists docker; then
  if docker info >/dev/null 2>&1; then
    docker-compose up -d
    print_success "Docker services started"
    echo ""
    echo "  📊 Services running:"
    echo "     PostgreSQL:      localhost:5432"
    echo "     Redis:           localhost:6379"
    echo "     Adminer:         http://localhost:8080"
    echo "     Redis Commander: http://localhost:8081"
    echo "     MinIO:           http://localhost:9001"
    echo "     MailHog:         http://localhost:8025"
  else
    print_warning "Docker is not running. Please start Docker and run: docker-compose up -d"
  fi
else
  print_warning "Docker not found. Please install Docker or setup database manually."
fi

echo ""

# Step 5: Wait for services
if command_exists docker && docker info >/dev/null 2>&1; then
  print_step "Step 5: Waiting for services to be ready..."
  echo -n "  Waiting for PostgreSQL"
  for i in {1..30}; do
    if docker-compose exec -T postgres pg_isready -U postgres >/dev/null 2>&1; then
      echo ""
      print_success "PostgreSQL is ready"
      break
    fi
    echo -n "."
    sleep 1
  done

  echo -n "  Waiting for Redis"
  for i in {1..30}; do
    if docker-compose exec -T redis redis-cli ping >/dev/null 2>&1; then
      echo ""
      print_success "Redis is ready"
      break
    fi
    echo -n "."
    sleep 1
  done
  echo ""
fi

# Step 6: Database setup
print_step "Step 6: Setting up database..."
if command_exists docker && docker info >/dev/null 2>&1; then
  if [ -d "apps/api" ] && [ -f "apps/api/package.json" ]; then
    pnpm --filter @puiux/api db:migrate || print_warning "Migration failed or not configured yet"
    pnpm --filter @puiux/api db:seed || print_warning "Seeding failed or not configured yet"
    print_success "Database setup complete"
  else
    print_warning "API app not initialized yet (skipping database setup)"
  fi
else
  print_warning "Docker not available (skipping database setup)"
fi

echo ""

# Step 7: Setup Git hooks
print_step "Step 7: Setting up Git hooks..."
if [ -d ".git" ]; then
  pnpm prepare
  print_success "Git hooks configured"
else
  print_warning "Not a git repository (skipping hooks)"
fi

echo ""

# Summary
echo "=================================="
echo -e "${GREEN}✓ Setup Complete!${NC}"
echo "=================================="
echo ""
echo "📚 Next Steps:"
echo ""
echo "1. Update environment variables:"
echo "   - Edit .env"
echo "   - Edit apps/web/.env.local"
echo "   - Edit apps/api/.env"
echo ""
echo "2. Start development:"
echo "   ${BLUE}pnpm dev${NC}"
echo ""
echo "3. Or start individually:"
echo "   ${BLUE}pnpm dev:web${NC}  # Frontend (http://localhost:3000)"
echo "   ${BLUE}pnpm dev:api${NC}  # Backend (http://localhost:4000)"
echo ""
echo "4. Build for production:"
echo "   ${BLUE}pnpm build${NC}"
echo ""
echo "5. Run tests:"
echo "   ${BLUE}pnpm test${NC}"
echo ""
echo "📖 Documentation: ./docs/"
echo "🐛 Issues: https://github.com/PUIUX-Co/puiux-click-v2/issues"
echo ""
echo "Happy coding! 🚀"
