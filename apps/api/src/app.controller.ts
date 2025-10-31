import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AppService } from './app.service';
import { Public } from './modules/auth/decorators/public.decorator';

@ApiTags('health')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get('health')
  @ApiOperation({ summary: 'Health check endpoint' })
  getHealth() {
    return this.appService.getHealth();
  }

  @Public()
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
