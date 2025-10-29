export default () => ({
  // Application
  app: {
    name: process.env.APP_NAME || 'PUIUX Click API',
    env: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT, 10) || 4000,
    url: process.env.APP_URL || 'http://localhost:4000',
  },

  // Frontend
  frontend: {
    url: process.env.FRONTEND_URL || 'http://localhost:3000',
  },

  // Database
  database: {
    url: process.env.DATABASE_URL,
  },

  // Redis
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    password: process.env.REDIS_PASSWORD,
    db: parseInt(process.env.REDIS_DB, 10) || 0,
  },

  // JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'change-me-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'change-me-in-production-refresh',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  },

  // Email (Future - Phase 2)
  email: {
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT, 10) || 587,
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASSWORD,
    from: process.env.EMAIL_FROM || 'noreply@puiuxclick.com',
  },

  // AI (Anthropic Claude)
  ai: {
    apiKey: process.env.ANTHROPIC_API_KEY,
    model: process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-20241022',
    maxTokens: parseInt(process.env.ANTHROPIC_MAX_TOKENS, 10) || 4096,
    temperature: parseFloat(process.env.ANTHROPIC_TEMPERATURE) || 0.7,
  },

  // Storage
  storage: {
    provider: process.env.STORAGE_PROVIDER || 'local', // local | s3 | azure
    local: {
      path: process.env.STORAGE_LOCAL_PATH || './uploads',
    },
    s3: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
      bucket: process.env.AWS_BUCKET,
    },
  },

  // Rate Limiting
  throttle: {
    ttl: parseInt(process.env.THROTTLE_TTL, 10) || 60,
    limit: parseInt(process.env.THROTTLE_LIMIT, 10) || 100,
  },

  // Features
  features: {
    registration: process.env.ENABLE_REGISTRATION !== 'false',
    emailVerification: process.env.ENABLE_EMAIL_VERIFICATION === 'true',
    aiGeneration: process.env.ENABLE_AI_GENERATION === 'true', // Phase 2
  },
});
