# 🚀 Deployment Guide - PUIUX Click

Complete guide for deploying PUIUX Click to production.

---

## 📋 Pre-Deployment Checklist

### 1. Code Quality
- [ ] All tests passing (≥80% coverage)
- [ ] No TypeScript errors
- [ ] Linter passing
- [ ] Security audit passed (`pnpm audit`)
- [ ] Dependencies updated

### 2. Environment Variables
- [ ] All secrets configured
- [ ] Database URL set
- [ ] Redis URL set
- [ ] Anthropic API key set
- [ ] JWT secrets generated

### 3. Database
- [ ] Migrations tested locally
- [ ] Backup strategy in place
- [ ] Indexes added
- [ ] RLS policies reviewed

---

## 🌐 Frontend Deployment (Vercel)

### Step 1: Connect Repository

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Import Git Repository: `PUIUX-Co/puiux-click-v2`
4. Select framework: **Next.js**
5. Root Directory: `apps/web`

### Step 2: Configure Build Settings

```bash
# Build Command
cd apps/web && pnpm build

# Output Directory
apps/web/.next

# Install Command
pnpm install

# Development Command
cd apps/web && pnpm dev
```

### Step 3: Environment Variables

Add these in Vercel Dashboard → Settings → Environment Variables:

```env
# API Configuration
NEXT_PUBLIC_API_URL=https://api.puiuxclick.com

# App Configuration
NEXT_PUBLIC_APP_URL=https://app.puiuxclick.com

# Analytics (Optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### Step 4: Custom Domain

1. Go to Settings → Domains
2. Add domain: `app.puiuxclick.com`
3. Configure DNS:
   ```
   Type: CNAME
   Name: app
   Value: cname.vercel-dns.com
   ```
4. Wait for SSL certificate (automatic)

### Step 5: Deploy

```bash
# Manual deploy
vercel --prod

# Or push to main branch (auto-deploy)
git push origin main
```

**Deployment URL:** https://app.puiuxclick.com

---

## ⚙️ Backend Deployment (Railway)

### Option A: Railway (Recommended for MVP)

#### Step 1: Create Project

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose: `PUIUX-Co/puiux-click-v2`

#### Step 2: Add Services

**Service 1: PostgreSQL**
1. Click "New" → "Database" → "PostgreSQL"
2. Wait for provisioning
3. Copy `DATABASE_URL` from Variables tab

**Service 2: Redis**
1. Click "New" → "Database" → "Redis"
2. Copy `REDIS_URL` from Variables tab

**Service 3: API**
1. Click "New" → "GitHub Repo"
2. Root Directory: `apps/api`
3. Configure as below

#### Step 3: Configure API Service

**Settings → Build:**
```json
{
  "builder": "NIXPACKS",
  "buildCommand": "cd apps/api && pnpm install && pnpm build && pnpm db:generate",
  "watchPatterns": ["apps/api/**"]
}
```

**Settings → Deploy:**
```json
{
  "startCommand": "cd apps/api && pnpm db:migrate:deploy && pnpm start:prod",
  "healthcheckPath": "/health",
  "healthcheckTimeout": 300,
  "restartPolicyType": "ON_FAILURE"
}
```

#### Step 4: Environment Variables

Add in Railway Dashboard → Variables:

```env
# Node
NODE_ENV=production
PORT=4000

# Database (from PostgreSQL service)
DATABASE_URL=${{Postgres.DATABASE_URL}}

# Redis (from Redis service)
REDIS_URL=${{Redis.REDIS_URL}}

# JWT
JWT_SECRET=<generate-strong-secret-here>
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=<generate-strong-secret-here>
JWT_REFRESH_EXPIRES_IN=7d

# Anthropic AI
ANTHROPIC_API_KEY=<your-anthropic-key>

# Frontend URL
FRONTEND_URL=https://app.puiuxclick.com

# Cors
CORS_ORIGINS=https://app.puiuxclick.com,https://puiuxclick.com
```

#### Step 5: Custom Domain

1. Settings → Networking → Custom Domain
2. Add: `api.puiuxclick.com`
3. Configure DNS:
   ```
   Type: CNAME
   Name: api
   Value: <railway-provided-domain>
   ```

#### Step 6: Deploy

Railway auto-deploys on push to `main` branch.

**Monitor deployment:**
- Railway Dashboard → Deployments
- View logs for errors

**API URL:** https://api.puiuxclick.com

---

### Option B: AWS ECS (Production Grade)

#### Prerequisites

```bash
# Install AWS CLI
brew install awscli  # macOS
# aws configure

# Install ECS CLI
brew install amazon-ecs-cli
```

#### Step 1: Create ECS Cluster

```bash
ecs-cli up \
  --cluster puiux-prod \
  --region us-east-1 \
  --instance-type t3.medium \
  --size 2
```

#### Step 2: Setup RDS (PostgreSQL)

1. Go to AWS RDS Console
2. Create Database:
   - Engine: PostgreSQL 15
   - Template: Production
   - DB Instance: db.t3.medium
   - Storage: 100GB (GP3)
   - Multi-AZ: Yes
   - VPC: Same as ECS cluster

3. Save connection string

#### Step 3: Setup ElastiCache (Redis)

1. Go to AWS ElastiCache Console
2. Create Redis cluster:
   - Engine: Redis 7.x
   - Node type: cache.t3.medium
   - Number of nodes: 2 (primary + replica)
   - VPC: Same as ECS cluster

#### Step 4: Build & Push Docker Image

```bash
# Build image
cd apps/api
docker build -t puiux-api:latest .

# Tag for ECR
docker tag puiux-api:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/puiux-api:latest

# Push to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/puiux-api:latest
```

#### Step 5: Create Task Definition

See `docker-compose.yml` and adapt for ECS.

#### Step 6: Create Service

```bash
ecs-cli compose service up \
  --cluster puiux-prod \
  --target-groups "targetGroupArn=<alb-target-group-arn>"
```

#### Step 7: Setup Application Load Balancer

1. Create ALB
2. Add target group (port 4000)
3. Configure health check: `/health`
4. Setup SSL certificate (ACM)
5. Configure DNS: `api.puiuxclick.com` → ALB

---

## 🗄️ Database Migrations

### Production Migration Process

```bash
# 1. Backup database
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql

# 2. Test migrations on staging
DATABASE_URL=<staging-url> pnpm db:migrate:deploy

# 3. Run on production (Railway does this automatically)
DATABASE_URL=<production-url> pnpm db:migrate:deploy

# 4. Verify
psql $DATABASE_URL -c "SELECT * FROM _prisma_migrations ORDER BY finished_at DESC LIMIT 5;"
```

---

## 📊 Monitoring & Alerts

### 1. Application Monitoring

**Recommended:** DataDog or New Relic

```bash
# Install DataDog agent (Railway)
# Add to environment:
DD_API_KEY=<datadog-api-key>
DD_SITE=datadoghq.com
DD_SERVICE=puiux-api
DD_ENV=production
```

### 2. Uptime Monitoring

**Recommended:** UptimeRobot or Pingdom

Setup checks:
- `https://api.puiuxclick.com/health` (every 1 min)
- `https://app.puiuxclick.com` (every 1 min)

### 3. Error Tracking

**Sentry Setup:**

```bash
# Install
pnpm add @sentry/node @sentry/nextjs

# Configure (apps/api/src/main.ts)
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
});
```

---

## 🔒 Security Checklist

- [ ] HTTPS enabled (SSL certificates)
- [ ] Security headers configured
- [ ] Rate limiting enabled
- [ ] CORS properly configured
- [ ] Secrets in environment variables (not code)
- [ ] Database backups automated
- [ ] DDoS protection (Cloudflare)
- [ ] API keys rotated regularly

---

## 🧪 Post-Deployment Tests

```bash
# 1. Health check
curl https://api.puiuxclick.com/health

# 2. Frontend loads
curl -I https://app.puiuxclick.com

# 3. API authentication
curl -X POST https://api.puiuxclick.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!"}'

# 4. Run E2E tests against production
BASE_URL=https://app.puiuxclick.com pnpm test:e2e
```

---

## 🔄 CI/CD Pipeline

Deployment happens automatically via GitHub Actions:

**Workflow:**
```
Push to main
  ↓
Run tests
  ↓
Build & Deploy Frontend (Vercel)
  ↓
Build & Deploy Backend (Railway)
  ↓
Run smoke tests
  ↓
Notify team (Slack)
```

---

## 📞 Troubleshooting

### Deployment fails

1. Check logs: `railway logs` or Vercel dashboard
2. Verify environment variables
3. Check database connection
4. Verify build command

### Site is slow

1. Check CDN cache hit rate
2. Review database query performance
3. Check Redis connection
4. Review API logs for slow requests

### Database connection errors

1. Verify `DATABASE_URL`
2. Check VPC/Security groups (AWS)
3. Verify database is running
4. Check connection pool settings

---

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [AWS ECS Guide](https://docs.aws.amazon.com/ecs/)
- [Prisma Production Best Practices](https://www.prisma.io/docs/guides/performance-and-optimization/connection-management)

---

**Created:** 2025-10-31
**Last Updated:** 2025-10-31
**Status:** 📋 Ready for deployment
