import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

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
  // Logging & Error Handling
  // ============================================================================

  // Global logging interceptor
  app.useGlobalInterceptors(new LoggingInterceptor());

  // Global exception filter
  app.useGlobalFilters(new AllExceptionsFilter());

  // ============================================================================
  // Root Route Handler (before global prefix)
  // ============================================================================

  // Add root route handler BEFORE setting global prefix
  app.use((req, res, next) => {
    if (req.url === '/' || req.url === '') {
      return res.json({
        name: 'PUIUX Click API',
        version: '2.0.0',
        status: 'running',
        message: 'Welcome to PUIUX Click API',
        endpoints: {
          documentation: '/api/docs',
          health: '/api/health',
          api: '/api',
        },
      });
    }
    next();
  });

  // ============================================================================
  // Global Prefix
  // ============================================================================

  app.setGlobalPrefix('api');

  // ============================================================================
  // API Versioning (Disabled for simplicity)
  // ============================================================================

  // app.enableVersioning({
  //   type: VersioningType.URI,
  //   defaultVersion: '1',
  //   prefix: 'v',
  // });

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
