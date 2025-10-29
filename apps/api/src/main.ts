import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  // ============================================================================
  // Security
  // ============================================================================

  // Helmet - Security headers
  app.use(helmet());

  // CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Organization-Id'],
  });

  // Cookie parser
  app.use(cookieParser());

  // Compression
  app.use(compression());

  // ============================================================================
  // Validation & Transformation
  // ============================================================================

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties not in DTO
      forbidNonWhitelisted: true, // Throw error if extra properties
      transform: true, // Auto-transform to DTO types
      transformOptions: {
        enableImplicitConversion: true,
      },
    })
  );

  // ============================================================================
  // API Versioning
  // ============================================================================

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
    prefix: 'api/v',
  });

  // ============================================================================
  // Global Prefix
  // ============================================================================

  app.setGlobalPrefix('api');

  // ============================================================================
  // Swagger Documentation
  // ============================================================================

  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('PUIUX Click API')
      .setDescription('API documentation for PUIUX Click platform')
      .setVersion('2.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'JWT',
          description: 'Enter JWT token',
          in: 'header',
        },
        'JWT-auth'
      )
      .addTag('auth', 'Authentication endpoints')
      .addTag('sites', 'Site management endpoints')
      .addTag('users', 'User management endpoints')
      .addTag('templates', 'Template endpoints')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
      },
    });

    console.log('📚 API Documentation: http://localhost:4000/api/docs');
  }

  // ============================================================================
  // Start Server
  // ============================================================================

  const port = process.env.PORT || 4000;
  await app.listen(port);

  console.log('🚀 PUIUX Click API is running');
  console.log(`📍 URL: http://localhost:${port}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📊 Health Check: http://localhost:${port}/api/health`);
}

bootstrap();
