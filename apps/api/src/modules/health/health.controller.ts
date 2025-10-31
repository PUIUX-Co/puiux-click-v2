import { Controller, Get } from '@nestjs/common';
import { HealthService } from './health.service';
import { Public } from '../auth/decorators/public.decorator';

/**
 * Health Check Controller
 * Provides endpoints for monitoring application health and metrics
 */
@Controller()
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  /**
   * Basic health check endpoint
   * Returns simple health status
   * @returns {object} Health status
   */
  @Public()
  @Get('health')
  async healthCheck() {
    return this.healthService.getHealth();
  }

  /**
   * Detailed health check endpoint
   * Returns detailed health information for all services
   * @returns {object} Detailed health status
   */
  @Public()
  @Get('health/detailed')
  async detailedHealthCheck() {
    return this.healthService.getDetailedHealth();
  }

  /**
   * Readiness probe endpoint
   * Checks if the application is ready to accept traffic
   * Returns 200 if ready, 503 if not ready
   * @returns {object} Readiness status
   */
  @Public()
  @Get('health/ready')
  async readinessCheck() {
    return this.healthService.getReadiness();
  }

  /**
   * Liveness probe endpoint
   * Checks if the application is alive
   * Returns 200 if alive, 503 if not alive
   * @returns {object} Liveness status
   */
  @Public()
  @Get('health/live')
  async livenessCheck() {
    return this.healthService.getLiveness();
  }

  /**
   * Metrics endpoint
   * Returns application metrics
   * @returns {object} Application metrics
   */
  @Public()
  @Get('metrics')
  async getMetrics() {
    return this.healthService.getMetrics();
  }
}
