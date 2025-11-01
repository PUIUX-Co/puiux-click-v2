import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      log: process.env.NODE_ENV === 'development'
        ? ['query', 'info', 'warn', 'error']
        : ['error', 'warn'],
      errorFormat: 'pretty',
    });

    // Log initialization
    if (process.env.NODE_ENV === 'development') {
      this.logger.debug('Prisma Client initialized in development mode');
    }
    
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('✅ Database connected successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      this.logger.error('❌ Database connection failed');
      this.logger.error(`Error: ${errorMessage}`);
      
      // In development, log helpful information
      if (process.env.NODE_ENV === 'development') {
        this.logger.warn('⚠️  Make sure your database server is running');
        this.logger.warn('⚠️  Check DATABASE_URL in your .env file');
        this.logger.warn('⚠️  You can start PostgreSQL with: docker-compose up -d');
      }
      
      // Only throw in production - allow graceful degradation in development
      if (process.env.NODE_ENV === 'production') {
        throw error;
      } else {
        // In development, log but don't crash - allow app to start
        // This helps with hot-reloading when DB is temporarily unavailable
        this.logger.warn('⚠️  Continuing without database connection (development mode)');
      }
    }
  }

  async onModuleDestroy() {
    try {
      await this.$disconnect();
      this.logger.log('Database disconnected');
    } catch (error) {
      // Silently handle disconnection errors (e.g., if never connected)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.warn(`Database disconnection warning: ${errorMessage}`);
    }
  }

  /**
   * Clean database for testing
   */
  async cleanDatabase() {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Cannot clean database in production!');
    }

    const models = Reflect.ownKeys(this).filter((key) => key[0] !== '_');

    return Promise.all(
      models.map((modelKey) => {
        // @ts-ignore
        return this[modelKey].deleteMany();
      })
    );
  }
}
