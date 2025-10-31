# PUIUX Click - Deployment Guide

This guide provides step-by-step instructions for deploying PUIUX Click to production using Vercel (frontend) and Railway (backend).

## Table of Contents
- [Prerequisites](#prerequisites)
- [Architecture Overview](#architecture-overview)
- [Backend Deployment (Railway)](#backend-deployment-railway)
- [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
- [Database Setup](#database-setup)
- [Environment Variables](#environment-variables)
- [Post-Deployment Steps](#post-deployment-steps)
- [Monitoring & Maintenance](#monitoring--maintenance)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Accounts
- **Railway Account** (https://railway.app)
- **Vercel Account** (https://vercel.com)
- **GitHub/GitLab Account** (for CI/CD)

### Required Services
- **PostgreSQL Database** (Railway provides this)
- **Redis** (Optional, for caching)
- **AI API Keys**:
  - Anthropic API Key (for Claude)
  - OpenAI API Key (for GPT)
  - Unsplash API Key (for images)

### Tools
- Node.js 20+ and pnpm
- Git
- Railway CLI (optional): `npm install -g @railway/cli`
- Vercel CLI (optional): `npm install -g vercel`

---

## Architecture Overview

```
┌─────────────────┐
│   Vercel        │
│   (Frontend)    │
│   Next.js 14    │
└────────┬────────┘
         │
         │ HTTPS
         ▼
┌─────────────────┐       ┌──────────────┐
│   Railway       │◄──────┤  PostgreSQL  │
│   (Backend)     │       │  Database    │
│   NestJS        │       └──────────────┘
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  External APIs  │
│  - Anthropic    │
│  - OpenAI       │
│  - Unsplash     │
└─────────────────┘
```

---

## Backend Deployment (Railway)

### Step 1: Create Railway Project

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Connect your GitHub account and select the `puiux-click-v2` repository
5. Select **"apps/api"** as the root directory

### Step 2: Add PostgreSQL Database

1. In your Railway project, click **"New"**
2. Select **"Database"** → **"PostgreSQL"**
3. Railway will automatically create a database and provide the connection string
4. Copy the `DATABASE_URL` connection string

### Step 3: Configure Environment Variables

In Railway project settings, add the following environment variables:

```bash
# Application
NODE_ENV=production
PORT=4000
APP_NAME=PUIUX Click API
APP_URL=https://your-api-domain.railway.app
FRONTEND_URL=https://your-frontend-domain.vercel.app

# Database (automatically provided by Railway)
DATABASE_URL=${{Postgres.DATABASE_URL}}

# JWT Authentication
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-change-in-production
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your-super-secret-refresh-key-min-32-characters
JWT_REFRESH_EXPIRES_IN=30d

# AI Services - Anthropic Claude
ANTHROPIC_API_KEY=your-anthropic-api-key
ANTHROPIC_MODEL=claude-3-5-sonnet-20241022
ANTHROPIC_MAX_TOKENS=4096
ANTHROPIC_TEMPERATURE=0.7

# AI Services - OpenAI
OPENAI_API_KEY=your-openai-api-key
OPENAI_MODEL=gpt-4o
OPENAI_MAX_TOKENS=4096
OPENAI_TEMPERATURE=0.7

# Unsplash (Images)
UNSPLASH_ACCESS_KEY=your-unsplash-access-key
UNSPLASH_SECRET_KEY=your-unsplash-secret-key
UNSPLASH_APPLICATION_ID=your-unsplash-app-id

# Storage
STORAGE_PROVIDER=local
STORAGE_LOCAL_PATH=./uploads

# Rate Limiting
THROTTLE_TTL=60
THROTTLE_LIMIT=100

# Feature Flags
ENABLE_REGISTRATION=true
ENABLE_EMAIL_VERIFICATION=false
ENABLE_AI_GENERATION=true
ENABLE_AI_TEXT_GENERATION=true
ENABLE_AI_IMAGE_SUGGESTIONS=true

# CORS
CORS_ORIGIN=https://your-frontend-domain.vercel.app

# Email (Optional - Phase 2)
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=
EMAIL_PASSWORD=
EMAIL_FROM=noreply@puiuxclick.com

# Monitoring (Optional)
SENTRY_DSN=your-sentry-dsn
```

### Step 4: Configure Build & Deploy

Railway should auto-detect the NestJS project. Verify these settings:

**Build Command:**
```bash
pnpm install && pnpm prisma generate && pnpm build
```

**Start Command:**
```bash
node dist/main.js
```

**Root Directory:**
```
apps/api
```

### Step 5: Run Database Migrations

After first deployment, run migrations:

```bash
# Using Railway CLI
railway run npx prisma migrate deploy

# Or via Railway dashboard:
# Navigate to project → Settings → Deploy → Manual Deploy
# Add migration command: npx prisma migrate deploy
```

### Step 6: Verify Deployment

1. Check deployment logs in Railway dashboard
2. Visit `https://your-api-domain.railway.app/health`
3. You should see: `{"status": "ok", "uptime": 123}`

---

## Frontend Deployment (Vercel)

### Step 1: Connect Repository to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New Project"**
3. Import your `puiux-click-v2` repository
4. Select **"apps/web"** as the root directory

### Step 2: Configure Project Settings

**Framework Preset:** Next.js

**Build & Development Settings:**
- **Build Command:** `pnpm build`
- **Output Directory:** `.next` (default)
- **Install Command:** `pnpm install`
- **Development Command:** `pnpm dev`

**Root Directory:** `apps/web`

### Step 3: Configure Environment Variables

In Vercel project settings → Environment Variables, add:

```bash
# API Configuration
NEXT_PUBLIC_API_URL=https://your-api-domain.railway.app
NEXT_PUBLIC_APP_URL=https://your-frontend-domain.vercel.app

# Optional: Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=your-ga-id
```

### Step 4: Deploy

1. Click **"Deploy"**
2. Vercel will build and deploy your application
3. After successful deployment, you'll get a production URL

### Step 5: Configure Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain (e.g., `puiuxclick.com`)
3. Follow Vercel's DNS configuration instructions

### Step 6: Verify Deployment

1. Visit your Vercel deployment URL
2. Test registration and login
3. Check browser console for errors
4. Verify API calls are reaching Railway backend

---

## Database Setup

### Running Migrations

**On Railway:**
```bash
railway run npx prisma migrate deploy
```

**Locally against Railway database:**
```bash
# Set DATABASE_URL to Railway database
DATABASE_URL="your-railway-db-url" pnpm prisma migrate deploy
```

### Seeding Data (Optional)

If you have seed data:
```bash
railway run npx prisma db seed
```

### Database Backups

Railway provides automatic daily backups. For manual backups:

1. Go to Railway Dashboard → Database
2. Click **"Backups"**
3. Create manual backup

---

## Environment Variables

### Backend Environment Variables Checklist

- [x] `NODE_ENV=production`
- [x] `DATABASE_URL` (provided by Railway)
- [x] `JWT_SECRET` (generate strong secret)
- [x] `JWT_REFRESH_SECRET` (generate strong secret)
- [x] `ANTHROPIC_API_KEY`
- [x] `OPENAI_API_KEY`
- [x] `UNSPLASH_ACCESS_KEY`
- [x] `FRONTEND_URL` (Vercel URL)
- [x] `APP_URL` (Railway URL)

### Frontend Environment Variables Checklist

- [x] `NEXT_PUBLIC_API_URL` (Railway backend URL)
- [x] `NEXT_PUBLIC_APP_URL` (Vercel frontend URL)

### Generating Secrets

Use these commands to generate secure secrets:

```bash
# Generate JWT_SECRET
openssl rand -base64 32

# Or using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

---

## Post-Deployment Steps

### 1. Test All Endpoints

```bash
# Health check
curl https://your-api-domain.railway.app/health

# Test registration
curl -X POST https://your-api-domain.railway.app/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123456!",
    "name": "Test User",
    "organizationName": "Test Org"
  }'
```

### 2. Configure CORS

Ensure CORS is properly configured in backend to allow frontend domain:

```typescript
// apps/api/src/main.ts
app.enableCors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
});
```

### 3. Setup SSL/HTTPS

Both Vercel and Railway provide automatic HTTPS. Verify:
- Frontend uses `https://`
- Backend API uses `https://`
- All API calls from frontend use HTTPS

### 4. Configure Rate Limiting

Review and adjust rate limits in `.env`:
```bash
THROTTLE_TTL=60
THROTTLE_LIMIT=100
```

### 5. Enable Monitoring

- Setup Sentry for error tracking
- Enable Railway metrics
- Configure Vercel Analytics

---

## Monitoring & Maintenance

### Health Checks

**Backend Health Endpoint:**
```bash
GET https://your-api-domain.railway.app/health
```

**Expected Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-10-31T...",
  "uptime": 12345,
  "database": "connected",
  "redis": "connected" (if Redis is used)
}
```

### Logging

**Railway Logs:**
- View real-time logs in Railway dashboard
- Filter by severity: ERROR, WARN, INFO

**Vercel Logs:**
- View logs in Vercel dashboard
- Check build logs and runtime logs separately

### Metrics to Monitor

1. **Response Times**
   - API response time < 500ms
   - Database query time < 100ms

2. **Error Rates**
   - 5xx errors < 1%
   - 4xx errors (expected user errors)

3. **Resource Usage**
   - Memory usage < 80%
   - CPU usage < 70%
   - Database connections < pool limit

4. **Business Metrics**
   - User registrations
   - Sites created
   - API usage per organization

### Database Maintenance

**Weekly Tasks:**
- Review slow queries
- Check database size growth
- Verify backups are running

**Monthly Tasks:**
- Analyze query performance
- Review and optimize indexes
- Clean up orphaned data

---

## Troubleshooting

### Common Issues

#### 1. "Can't reach database server"

**Solution:**
- Verify DATABASE_URL is correct
- Check database is running in Railway
- Ensure IP whitelisting if enabled
- Verify Prisma schema is up to date

```bash
# Regenerate Prisma Client
pnpm prisma generate

# Run migrations
railway run npx prisma migrate deploy
```

#### 2. "CORS Error" in Frontend

**Solution:**
- Verify FRONTEND_URL in backend env vars
- Check CORS configuration in main.ts
- Ensure frontend is using correct API URL

```typescript
// backend: apps/api/src/main.ts
app.enableCors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
});
```

#### 3. "Module not found" Errors

**Solution:**
- Verify all dependencies are in package.json
- Clear build cache and rebuild
- Check pnpm-lock.yaml is committed

```bash
# Railway: Trigger rebuild
railway up

# Vercel: Trigger redeploy
vercel --prod
```

#### 4. "Authentication Failed" Errors

**Solution:**
- Verify JWT_SECRET matches between deployments
- Check JWT token expiration settings
- Ensure cookies are being set correctly

```bash
# Check JWT secret is set
railway run printenv | grep JWT_SECRET
```

#### 5. High Memory Usage

**Solution:**
- Review memory limits in Railway
- Optimize database queries
- Enable connection pooling
- Review and fix memory leaks

```typescript
// Prisma connection pooling
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  pool_timeout = 20
  connection_limit = 10
}
```

### Debugging Steps

1. **Check Deployment Logs**
   ```bash
   # Railway
   railway logs

   # Vercel
   vercel logs
   ```

2. **Test API Endpoints**
   ```bash
   # Health check
   curl https://your-api-domain.railway.app/health

   # Database connection
   curl https://your-api-domain.railway.app/api/sites
   ```

3. **Verify Environment Variables**
   ```bash
   # Railway
   railway run printenv

   # Vercel (via dashboard only)
   ```

4. **Check Database Connection**
   ```bash
   # Connect to Railway database
   railway connect

   # Run query
   \dt  # List tables
   ```

---

## Rollback Procedure

### Backend (Railway)

1. Go to Railway Dashboard → Deployments
2. Find previous working deployment
3. Click **"Redeploy"**

### Frontend (Vercel)

1. Go to Vercel Dashboard → Deployments
2. Find previous working deployment
3. Click **"Promote to Production"**

### Database Rollback

```bash
# Rollback last migration
railway run npx prisma migrate resolve --rolled-back MIGRATION_NAME
```

⚠️ **Warning:** Rolling back database migrations can cause data loss. Always backup first.

---

## CI/CD Pipeline

### Automatic Deployments

**Railway:**
- Auto-deploys on push to `main` branch
- Configure in Railway settings → GitHub Integration

**Vercel:**
- Auto-deploys on push to `main` branch
- Preview deployments for PRs

### Pre-Deployment Checklist

Before merging to `main`:

- [ ] All tests passing (`pnpm test`)
- [ ] Linting passes (`pnpm lint`)
- [ ] Build succeeds (`pnpm build`)
- [ ] Database migrations tested
- [ ] Environment variables updated
- [ ] CHANGELOG.md updated
- [ ] Code reviewed and approved

---

## Security Checklist

- [ ] All environment variables use secure values
- [ ] JWT secrets are strong (32+ characters)
- [ ] HTTPS enabled on all endpoints
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] SQL injection protection (Prisma ORM)
- [ ] XSS protection headers set
- [ ] CSRF protection enabled
- [ ] Input validation on all endpoints
- [ ] Database backups enabled
- [ ] Error messages don't expose sensitive info
- [ ] Logs don't contain secrets
- [ ] Dependencies regularly updated
- [ ] Security headers configured (CSP, HSTS, etc.)

---

## Performance Optimization

### Backend Optimizations

1. **Enable Response Compression**
   ```typescript
   // apps/api/src/main.ts
   app.use(compression());
   ```

2. **Database Connection Pooling**
   - Configured in Prisma schema
   - Monitor connection usage

3. **Caching Strategy**
   - Add Redis for session storage
   - Cache frequently accessed data
   - Set appropriate Cache-Control headers

4. **Query Optimization**
   - Use proper indexes
   - Avoid N+1 queries
   - Use select to limit fields

### Frontend Optimizations

1. **Code Splitting**
   - Next.js handles automatically
   - Use dynamic imports for heavy components

2. **Image Optimization**
   - Use Next.js Image component
   - Serve WebP format
   - Lazy load images

3. **Bundle Size**
   - Monitor bundle size in Vercel
   - Remove unused dependencies
   - Use tree shaking

---

## Support & Resources

### Documentation
- [Railway Docs](https://docs.railway.app/)
- [Vercel Docs](https://vercel.com/docs)
- [NestJS Deployment](https://docs.nestjs.com/deployment)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

### Monitoring Tools
- [Sentry](https://sentry.io/) - Error tracking
- [LogRocket](https://logrocket.com/) - Session replay
- [Datadog](https://www.datadoghq.com/) - Full observability

### Community
- Railway Discord
- Vercel Discord
- GitHub Issues

---

## Changelog

### Version 1.0.0 (Initial Deployment)
- ✅ Backend deployed to Railway
- ✅ Frontend deployed to Vercel
- ✅ PostgreSQL database configured
- ✅ Environment variables set
- ✅ Health checks enabled
- ✅ HTTPS enabled
- ✅ CORS configured
- ✅ Rate limiting enabled

---

## License

This deployment guide is part of the PUIUX Click project. See [LICENSE](LICENSE) for details.
