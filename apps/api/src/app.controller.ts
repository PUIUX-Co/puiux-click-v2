import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('health')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  @ApiOperation({ summary: 'Health check endpoint' })
  getHealth() {
    return this.appService.getHealth();
  }

  @Get()
  @ApiOperation({ summary: 'API root' })
  getRoot() {
    return {
      name: 'PUIUX Click API',
      version: '2.0.0',
      status: 'running',
      documentation: '/api/docs',
      health: '/api/health',
    };
  }
}
