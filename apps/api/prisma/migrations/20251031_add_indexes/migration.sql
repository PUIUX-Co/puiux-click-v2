-- Add performance indexes for common queries

-- Users table indexes
CREATE INDEX IF NOT EXISTS "idx_users_organization_id" ON "users"("organizationId");
CREATE INDEX IF NOT EXISTS "idx_users_email" ON "users"("email");
CREATE INDEX IF NOT EXISTS "idx_users_created_at" ON "users"("createdAt" DESC);

-- Organizations table indexes
CREATE INDEX IF NOT EXISTS "idx_organizations_slug" ON "organizations"("slug");
CREATE INDEX IF NOT EXISTS "idx_organizations_plan" ON "organizations"("plan");

-- Sites table indexes
CREATE INDEX IF NOT EXISTS "idx_sites_organization_id" ON "sites"("organizationId");
CREATE INDEX IF NOT EXISTS "idx_sites_user_id" ON "sites"("userId");
CREATE INDEX IF NOT EXISTS "idx_sites_slug" ON "sites"("slug");
CREATE INDEX IF NOT EXISTS "idx_sites_status" ON "sites"("status");
CREATE INDEX IF NOT EXISTS "idx_sites_published_at" ON "sites"("publishedAt" DESC) WHERE "publishedAt" IS NOT NULL;
CREATE INDEX IF NOT EXISTS "idx_sites_created_at" ON "sites"("createdAt" DESC);
CREATE INDEX IF NOT EXISTS "idx_sites_industry" ON "sites"("industry");

-- Composite indexes for common query patterns
CREATE INDEX IF NOT EXISTS "idx_sites_org_user" ON "sites"("organizationId", "userId");
CREATE INDEX IF NOT EXISTS "idx_sites_org_status" ON "sites"("organizationId", "status");
CREATE INDEX IF NOT EXISTS "idx_sites_org_created" ON "sites"("organizationId", "createdAt" DESC);

-- Sessions table indexes (if you add it later)
-- CREATE INDEX IF NOT EXISTS "idx_sessions_user_id" ON "sessions"("userId");
-- CREATE INDEX IF NOT EXISTS "idx_sessions_token" ON "sessions"("token");
-- CREATE INDEX IF NOT EXISTS "idx_sessions_expires_at" ON "sessions"("expiresAt");

-- Add comments for documentation
COMMENT ON INDEX "idx_sites_org_user" IS 'Optimizes queries filtering by both organization and user';
COMMENT ON INDEX "idx_sites_org_status" IS 'Optimizes queries for published/draft sites per organization';
COMMENT ON INDEX "idx_sites_published_at" IS 'Partial index for published sites only, optimizes published sites list';
