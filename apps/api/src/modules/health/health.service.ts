import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import * as os from 'os';

/**
 * Health Service
 * Provides health check and monitoring functionality
 */
@Injectable()
export class HealthService {
  private readonly logger = new Logger(HealthService.name);
  private readonly startTime = Date.now();

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get basic health status
   */
  async getHealth() {
    const uptime = Math.floor((Date.now() - this.startTime) / 1000);

    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime,
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0',
    };
  }

  /**
   * Get detailed health status including all services
   */
  async getDetailedHealth() {
    const uptime = Math.floor((Date.now() - this.startTime) / 1000);
    const databaseStatus = await this.checkDatabase();
    const memoryUsage = process.memoryUsage();
    const cpuUsage = process.cpuUsage();

    return {
      status: databaseStatus.status === 'connected' ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      uptime,
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0',
      services: {
        database: databaseStatus,
        api: {
          status: 'healthy',
          port: process.env.PORT || 4000,
        },
      },
      system: {
        platform: os.platform(),
        architecture: os.arch(),
        nodeVersion: process.version,
        memory: {
          rss: `${(memoryUsage.rss / 1024 / 1024).toFixed(2)} MB`,
          heapTotal: `${(memoryUsage.heapTotal / 1024 / 1024).toFixed(2)} MB`,
          heapUsed: `${(memoryUsage.heapUsed / 1024 / 1024).toFixed(2)} MB`,
          external: `${(memoryUsage.external / 1024 / 1024).toFixed(2)} MB`,
        },
        cpu: {
          user: `${(cpuUsage.user / 1000).toFixed(2)} ms`,
          system: `${(cpuUsage.system / 1000).toFixed(2)} ms`,
        },
        hostname: os.hostname(),
        loadAverage: os.loadavg(),
      },
    };
  }

  /**
   * Check if application is ready to accept traffic
   */
  async getReadiness() {
    const databaseStatus = await this.checkDatabase();

    const isReady = databaseStatus.status === 'connected';

    return {
      status: isReady ? 'ready' : 'not_ready',
      timestamp: new Date().toISOString(),
      checks: {
        database: databaseStatus.status === 'connected',
      },
    };
  }

  /**
   * Check if application is alive
   */
  async getLiveness() {
    return {
      status: 'alive',
      timestamp: new Date().toISOString(),
      uptime: Math.floor((Date.now() - this.startTime) / 1000),
    };
  }

  /**
   * Get application metrics
   */
  async getMetrics() {
    const uptime = Math.floor((Date.now() - this.startTime) / 1000);
    const memoryUsage = process.memoryUsage();
    const cpuUsage = process.cpuUsage();

    // Get database metrics
    const [userCount, organizationCount, siteCount, sessionCount] =
      await Promise.all([
        this.prisma.user.count().catch(() => 0),
        this.prisma.organization.count().catch(() => 0),
        this.prisma.site.count().catch(() => 0),
        this.prisma.session.count().catch(() => 0),
      ]);

    return {
      timestamp: new Date().toISOString(),
      uptime,
      system: {
        memory: {
          rss: memoryUsage.rss,
          heapTotal: memoryUsage.heapTotal,
          heapUsed: memoryUsage.heapUsed,
          external: memoryUsage.external,
          arrayBuffers: (memoryUsage as any).arrayBuffers || 0,
        },
        cpu: {
          user: cpuUsage.user,
          system: cpuUsage.system,
        },
        process: {
          pid: process.pid,
          uptime: process.uptime(),
          version: process.version,
          platform: process.platform,
          arch: process.arch,
        },
      },
      application: {
        environment: process.env.NODE_ENV || 'development',
        version: process.env.npm_package_version || '1.0.0',
        port: process.env.PORT || 4000,
      },
      database: {
        totalUsers: userCount,
        totalOrganizations: organizationCount,
        totalSites: siteCount,
        activeSessions: sessionCount,
      },
    };
  }

  /**
   * Check database connection status
   */
  private async checkDatabase(): Promise<{
    status: string;
    responseTime?: number;
    error?: string;
  }> {
    const startTime = Date.now();

    try {
      await this.prisma.$queryRaw`SELECT 1`;
      const responseTime = Date.now() - startTime;

      return {
        status: 'connected',
        responseTime,
      };
    } catch (error) {
      this.logger.error('Database health check failed:', error);
      return {
        status: 'disconnected',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
