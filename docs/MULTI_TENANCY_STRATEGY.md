# 🏢 Multi-Tenancy Strategy - PUIUX Click

## 🎯 Executive Summary

**Decision:** نعم، نطبق Multi-tenancy لكن **بطريقة ذكية ومرحلية**

**Approach:** Application-level first, Database-level later, RLS only if needed

**Reasoning:**
- تناسب حجم المشروع
- سهلة في التطوير
- Performant
- Scalable للمستقبل

---

## 📋 Strategy Overview

### Phase 1: Application-Level Isolation (MVP) ✅

**When:** Phase 1 (Week 2-4)
**Complexity:** Low
**Performance:** Excellent
**Security:** Good

```typescript
// الفكرة الأساسية:
كل جدول → organizationId
كل query → WHERE organizationId = :currentOrgId
Middleware → يضيف الـ filter تلقائياً
```

**Pros:**
- ✅ سهل جداً في التطبيق
- ✅ TypeORM يدعمه بشكل native
- ✅ Testing بسيط
- ✅ Performance ممتاز
- ✅ Debug سهل

**Cons:**
- ⚠️ محتاج discipline (لا تنسى الـ filter)
- ⚠️ Application bug = potential data leak
- ⚠️ مش أقوى حماية

**Rating:** ⭐⭐⭐⭐ (Excellent for MVP)

---

### Phase 2: Database Constraints (Post-MVP)

**When:** Phase 3-4 (After launch)
**Complexity:** Medium
**Performance:** Excellent
**Security:** Very Good

**Enhancements:**
```sql
-- 1. Composite indexes per tenant
CREATE INDEX idx_sites_org_id ON sites(organization_id, id);

-- 2. Partial indexes
CREATE INDEX idx_active_sites_org
  ON sites(organization_id)
  WHERE status = 'active';

-- 3. CHECK constraints (extra safety)
ALTER TABLE sites
  ADD CONSTRAINT chk_org_not_null
  CHECK (organization_id IS NOT NULL);

-- 4. Foreign key cascades
ALTER TABLE pages
  ADD CONSTRAINT fk_pages_sites
  FOREIGN KEY (site_id)
  REFERENCES sites(id)
  ON DELETE CASCADE;
```

**Rating:** ⭐⭐⭐⭐⭐ (Best balance)

---

### Phase 3: Row-Level Security (Future/Enterprise)

**When:** Only if needed (compliance, enterprise)
**Complexity:** High
**Performance:** Good (with caching)
**Security:** Excellent

**When to use:**
- ✅ Enterprise customers requiring compliance
- ✅ Multi-national deployments
- ✅ Healthcare/Finance data
- ❌ Regular users (overkill)

**Implementation:**
```sql
-- RLS Policy (PostgreSQL)
CREATE POLICY tenant_isolation ON sites
  USING (organization_id = current_setting('app.current_tenant')::uuid);

-- Set tenant context
SET app.current_tenant = '123e4567-e89b-12d3-a456-426614174000';
```

**Rating:** ⭐⭐⭐ (Only if absolutely needed)

---

## 🛠️ Implementation Guide

### 1. Database Schema

```typescript
// ═══════════════════════════════════════════════════════
// Core Multi-tenancy Structure
// ═══════════════════════════════════════════════════════

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column({ select: false })
  passwordHash: string;

  // User can belong to multiple organizations
  @ManyToMany(() => Organization, org => org.users)
  @JoinTable({
    name: 'user_organizations',
    joinColumn: { name: 'user_id' },
    inverseJoinColumn: { name: 'organization_id' }
  })
  organizations: Organization[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

// ═══════════════════════════════════════════════════════

@Entity('organizations')
export class Organization {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  slug: string;

  // Organization settings
  @Column('jsonb', { nullable: true })
  settings: Record<string, any>;

  // Relations
  @OneToMany(() => Site, site => site.organization)
  sites: Site[];

  @ManyToMany(() => User, user => user.organizations)
  users: User[];

  @OneToMany(() => Subscription, sub => sub.organization)
  subscriptions: Subscription[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

// ═══════════════════════════════════════════════════════
// Multi-tenant Tables (all have organizationId)
// ═══════════════════════════════════════════════════════

@Entity('sites')
export class Site {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // 🔑 Multi-tenancy Key!
  @Column('uuid')
  @Index() // CRITICAL: Always index tenant column!
  organizationId: string;

  @Column()
  name: string;

  @Column({ unique: true })
  domain: string;

  @Column({ type: 'enum', enum: SiteStatus })
  status: SiteStatus;

  // Relations
  @ManyToOne(() => Organization, org => org.sites, {
    onDelete: 'CASCADE' // Delete sites when org deleted
  })
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @OneToMany(() => Page, page => page.site)
  pages: Page[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

// ═══════════════════════════════════════════════════════

@Entity('pages')
export class Page {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // 🔑 Multi-tenancy through site relationship
  @Column('uuid')
  @Index()
  siteId: string;

  @Column()
  title: string;

  @Column({ unique: true })
  slug: string;

  @Column('jsonb')
  content: Record<string, any>;

  // Relations
  @ManyToOne(() => Site, site => site.pages, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'site_id' })
  site: Site;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

---

### 2. Tenant Context Middleware

```typescript
// ═══════════════════════════════════════════════════════
// apps/api/src/common/middleware/tenant.middleware.ts
// ═══════════════════════════════════════════════════════

import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

export interface TenantContext {
  userId: string;
  organizationId: string;
  role: string;
}

// Extend Express Request
declare global {
  namespace Express {
    interface Request {
      tenant?: TenantContext;
    }
  }
}

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Extract from JWT (set by AuthGuard)
    const user = req.user as any;

    if (user) {
      // Extract organization from header or default
      const orgId = req.headers['x-organization-id'] as string
        || user.defaultOrganizationId;

      // Set tenant context
      req.tenant = {
        userId: user.id,
        organizationId: orgId,
        role: user.role
      };
    }

    next();
  }
}
```

---

### 3. Tenant Scope Decorator

```typescript
// ═══════════════════════════════════════════════════════
// apps/api/src/common/decorators/tenant.decorator.ts
// ═══════════════════════════════════════════════════════

import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Tenant = createParamDecorator(
  (data: keyof TenantContext | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const tenant = request.tenant;

    return data ? tenant?.[data] : tenant;
  },
);

// Usage:
// @Get()
// async findAll(@Tenant('organizationId') orgId: string) {
//   return this.service.findByOrg(orgId);
// }
```

---

### 4. Repository Base Class

```typescript
// ═══════════════════════════════════════════════════════
// apps/api/src/common/repositories/tenant.repository.ts
// ═══════════════════════════════════════════════════════

import { Repository, FindManyOptions, FindOneOptions } from 'typeorm';

export abstract class TenantRepository<T> extends Repository<T> {

  /**
   * Find all records for a tenant
   */
  async findByTenant(
    organizationId: string,
    options?: FindManyOptions<T>
  ): Promise<T[]> {
    return this.find({
      ...options,
      where: {
        ...options?.where,
        organizationId, // 🔑 Auto-filter by tenant!
      },
    });
  }

  /**
   * Find one record for a tenant
   */
  async findOneByTenant(
    organizationId: string,
    options?: FindOneOptions<T>
  ): Promise<T | null> {
    return this.findOne({
      ...options,
      where: {
        ...options?.where,
        organizationId,
      },
    });
  }

  /**
   * Create with automatic tenant assignment
   */
  async createForTenant(
    organizationId: string,
    data: Partial<T>
  ): Promise<T> {
    const entity = this.create({
      ...data,
      organizationId, // 🔑 Auto-set tenant!
    } as any);

    return this.save(entity);
  }

  /**
   * Ensure entity belongs to tenant before update
   */
  async updateForTenant(
    organizationId: string,
    id: string,
    data: Partial<T>
  ): Promise<T> {
    // Verify ownership first!
    const existing = await this.findOneByTenant(organizationId, {
      where: { id } as any,
    });

    if (!existing) {
      throw new Error('Entity not found or access denied');
    }

    Object.assign(existing, data);
    return this.save(existing);
  }

  /**
   * Delete only if belongs to tenant
   */
  async deleteForTenant(
    organizationId: string,
    id: string
  ): Promise<void> {
    const result = await this.delete({
      id,
      organizationId,
    } as any);

    if (result.affected === 0) {
      throw new Error('Entity not found or access denied');
    }
  }
}
```

---

### 5. Service Example

```typescript
// ═══════════════════════════════════════════════════════
// apps/api/src/modules/sites/sites.service.ts
// ═══════════════════════════════════════════════════════

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Site } from './entities/site.entity';
import { TenantRepository } from '@/common/repositories/tenant.repository';

@Injectable()
export class SitesService {
  constructor(
    @InjectRepository(Site)
    private readonly siteRepo: TenantRepository<Site>,
  ) {}

  /**
   * Get all sites for organization
   */
  async findAll(organizationId: string): Promise<Site[]> {
    return this.siteRepo.findByTenant(organizationId);
  }

  /**
   * Get one site for organization
   */
  async findOne(organizationId: string, id: string): Promise<Site> {
    const site = await this.siteRepo.findOneByTenant(organizationId, {
      where: { id },
      relations: ['pages'],
    });

    if (!site) {
      throw new Error('Site not found');
    }

    return site;
  }

  /**
   * Create site for organization
   */
  async create(organizationId: string, data: CreateSiteDto): Promise<Site> {
    return this.siteRepo.createForTenant(organizationId, data);
  }

  /**
   * Update site (only if belongs to organization)
   */
  async update(
    organizationId: string,
    id: string,
    data: UpdateSiteDto
  ): Promise<Site> {
    return this.siteRepo.updateForTenant(organizationId, id, data);
  }

  /**
   * Delete site (only if belongs to organization)
   */
  async remove(organizationId: string, id: string): Promise<void> {
    return this.siteRepo.deleteForTenant(organizationId, id);
  }
}
```

---

### 6. Controller Example

```typescript
// ═══════════════════════════════════════════════════════
// apps/api/src/modules/sites/sites.controller.ts
// ═══════════════════════════════════════════════════════

import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { Tenant } from '@/common/decorators/tenant.decorator';
import { SitesService } from './sites.service';

@Controller('sites')
export class SitesController {
  constructor(private readonly sitesService: SitesService) {}

  @Get()
  async findAll(@Tenant('organizationId') orgId: string) {
    // 🔑 Automatically scoped to organization!
    return this.sitesService.findAll(orgId);
  }

  @Get(':id')
  async findOne(
    @Tenant('organizationId') orgId: string,
    @Param('id') id: string
  ) {
    // 🔑 Can only access if belongs to organization!
    return this.sitesService.findOne(orgId, id);
  }

  @Post()
  async create(
    @Tenant('organizationId') orgId: string,
    @Body() data: CreateSiteDto
  ) {
    // 🔑 Automatically assigned to organization!
    return this.sitesService.create(orgId, data);
  }

  @Patch(':id')
  async update(
    @Tenant('organizationId') orgId: string,
    @Param('id') id: string,
    @Body() data: UpdateSiteDto
  ) {
    // 🔑 Can only update if belongs to organization!
    return this.sitesService.update(orgId, id, data);
  }

  @Delete(':id')
  async remove(
    @Tenant('organizationId') orgId: string,
    @Param('id') id: string
  ) {
    // 🔑 Can only delete if belongs to organization!
    return this.sitesService.remove(orgId, id);
  }
}
```

---

## 🧪 Testing Strategy

```typescript
// ═══════════════════════════════════════════════════════
// apps/api/src/modules/sites/sites.service.spec.ts
// ═══════════════════════════════════════════════════════

describe('SitesService - Multi-tenancy', () => {
  let service: SitesService;

  const ORG_A = '00000000-0000-0000-0000-000000000001';
  const ORG_B = '00000000-0000-0000-0000-000000000002';

  beforeEach(async () => {
    // Setup test module
  });

  describe('Data Isolation', () => {
    it('should only return sites for specified organization', async () => {
      // Create sites for Org A
      await service.create(ORG_A, { name: 'Site A1' });
      await service.create(ORG_A, { name: 'Site A2' });

      // Create sites for Org B
      await service.create(ORG_B, { name: 'Site B1' });

      // Org A should only see their sites
      const sitesA = await service.findAll(ORG_A);
      expect(sitesA).toHaveLength(2);
      expect(sitesA.every(s => s.organizationId === ORG_A)).toBe(true);

      // Org B should only see their sites
      const sitesB = await service.findAll(ORG_B);
      expect(sitesB).toHaveLength(1);
      expect(sitesB.every(s => s.organizationId === ORG_B)).toBe(true);
    });

    it('should not allow access to another organization site', async () => {
      // Org A creates a site
      const site = await service.create(ORG_A, { name: 'Site A1' });

      // Org B tries to access it
      await expect(
        service.findOne(ORG_B, site.id)
      ).rejects.toThrow('Site not found');
    });

    it('should not allow updating another organization site', async () => {
      const site = await service.create(ORG_A, { name: 'Site A1' });

      await expect(
        service.update(ORG_B, site.id, { name: 'Hacked' })
      ).rejects.toThrow('Entity not found or access denied');
    });

    it('should not allow deleting another organization site', async () => {
      const site = await service.create(ORG_A, { name: 'Site A1' });

      await expect(
        service.remove(ORG_B, site.id)
      ).rejects.toThrow('Entity not found or access denied');
    });
  });
});
```

---

## 📊 Performance Considerations

### Indexes (CRITICAL!)

```sql
-- ALWAYS index organizationId!
CREATE INDEX idx_sites_organization_id ON sites(organization_id);
CREATE INDEX idx_pages_site_id ON pages(site_id);
CREATE INDEX idx_components_page_id ON components(page_id);

-- Composite indexes for common queries
CREATE INDEX idx_sites_org_status ON sites(organization_id, status);
CREATE INDEX idx_sites_org_created ON sites(organization_id, created_at DESC);

-- Partial indexes for active records
CREATE INDEX idx_sites_org_active
  ON sites(organization_id)
  WHERE status = 'active';
```

### Query Optimization

```typescript
// ❌ Bad: N+1 query problem
async getBadSites(orgId: string) {
  const sites = await this.siteRepo.findByTenant(orgId);

  for (const site of sites) {
    site.pages = await this.pageRepo.findByTenant(orgId, {
      where: { siteId: site.id }
    });
  }

  return sites;
}

// ✅ Good: Eager loading
async getGoodSites(orgId: string) {
  return this.siteRepo.findByTenant(orgId, {
    relations: ['pages', 'pages.components']
  });
}
```

---

## 🔐 Security Checklist

```
✅ Multi-tenancy Essentials:
   ├─ [✅] organizationId in all tenant tables
   ├─ [✅] Indexes on organizationId
   ├─ [✅] Foreign key constraints
   ├─ [✅] CASCADE deletes configured
   ├─ [✅] Middleware sets tenant context
   ├─ [✅] @Tenant decorator for controllers
   ├─ [✅] Repository base class with auto-filtering
   ├─ [✅] Unit tests for data isolation
   ├─ [✅] Integration tests for cross-tenant access
   └─ [✅] Documentation for developers

⚠️ Security Checks:
   ├─ [ ] Never trust client-provided organizationId
   ├─ [ ] Always derive from JWT/session
   ├─ [ ] Verify user belongs to organization
   ├─ [ ] Log tenant switches (audit trail)
   └─ [ ] Rate limit per tenant
```

---

## 📈 Migration Path

### Phase 1: MVP (Week 2-4) ← START HERE

```typescript
✅ Implement application-level isolation
✅ Add organizationId to all entities
✅ Create TenantRepository base class
✅ Add middleware + decorators
✅ Write tests
```

### Phase 2: Optimize (Month 2-3)

```sql
✅ Add composite indexes
✅ Add partial indexes
✅ Add database constraints
✅ Optimize queries
✅ Add monitoring
```

### Phase 3: Enterprise (Optional, Month 6+)

```sql
⚡ RLS policies (if needed)
⚡ Schema-per-tenant (if massive scale)
⚡ Dedicated instances (enterprise customers)
```

---

## 🎯 Bottom Line

### Recommendation:

```
✅ YES to Multi-tenancy
✅ Application-level first (simple, fast)
✅ Database constraints second (safety)
❌ NO to RLS initially (overkill)
⚡ RLS later only if needed (compliance)
```

### Timeline:

```
Week 2-4:  Implement application-level ✅
Month 2-3: Add DB constraints & optimize
Month 6+:  Consider RLS if needed (enterprise)
```

### Effort:

```
Application-level: 2-3 days
DB constraints:    1 day
RLS:              1-2 weeks (complex)
```

---

**My Expert Opinion:**

**Multi-tenancy ضروري 100%** لكن ابدأ بسيط (application-level) وطور تدريجياً. RLS overkill في البداية.

---

**Last Updated:** 2025-10-28
**Author:** Claude (Software Architect)
