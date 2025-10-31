import { Module } from '@nestjs/common';
import { SitesService } from './sites.service';
import { SitesController } from './sites.controller';
import { PrismaModule } from '../../common/prisma/prisma.module';

/**
 * Sites Module
 * Handles all site management functionality
 */
@Module({
  imports: [PrismaModule],
  controllers: [SitesController],
  providers: [SitesService],
  exports: [SitesService],
})
export class SitesModule {}
