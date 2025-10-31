import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import * as path from 'path';

/**
 * Winston logger configuration for production-grade logging
 *
 * Features:
 * - Multiple log levels (error, warn, info, debug)
 * - File rotation for error and combined logs
 * - Console output with colors (development)
 * - JSON formatting (production)
 * - Request ID tracking
 * - Timestamp for all logs
 *
 * @example
 * ```typescript
 * // In main.ts
 * import { winstonLogger } from './common/logger/winston.config';
 * app.useLogger(winstonLogger);
 * ```
 */

const isDevelopment = process.env.NODE_ENV !== 'production';
const logLevel = process.env.LOG_LEVEL || (isDevelopment ? 'debug' : 'info');

/**
 * Custom format for development console output
 */
const developmentFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(({ timestamp, level, message, context, trace, ...meta }) => {
    let log = `${timestamp} [${level}] ${context ? `[${context}]` : ''} ${message}`;

    // Add metadata if present
    if (Object.keys(meta).length > 0) {
      log += `\n${JSON.stringify(meta, null, 2)}`;
    }

    // Add stack trace if present
    if (trace) {
      log += `\n${trace}`;
    }

    return log;
  }),
);

/**
 * JSON format for production (structured logging)
 */
const productionFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json(),
);

/**
 * Winston transports configuration
 */
const transports: winston.transport[] = [
  // Console transport (always active)
  new winston.transports.Console({
    format: isDevelopment ? developmentFormat : productionFormat,
  }),
];

// File transports (production only or if LOG_TO_FILE is set)
if (!isDevelopment || process.env.LOG_TO_FILE === 'true') {
  const logsDir = path.join(process.cwd(), 'logs');

  // Error logs file
  transports.push(
    new winston.transports.File({
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
      format: productionFormat,
      maxsize: 10 * 1024 * 1024, // 10MB
      maxFiles: 10,
    }),
  );

  // Combined logs file
  transports.push(
    new winston.transports.File({
      filename: path.join(logsDir, 'combined.log'),
      format: productionFormat,
      maxsize: 10 * 1024 * 1024, // 10MB
      maxFiles: 10,
    }),
  );

  // Debug logs file (development only)
  if (isDevelopment) {
    transports.push(
      new winston.transports.File({
        filename: path.join(logsDir, 'debug.log'),
        level: 'debug',
        format: productionFormat,
        maxsize: 10 * 1024 * 1024, // 10MB
        maxFiles: 5,
      }),
    );
  }
}

/**
 * Winston logger instance
 */
export const winstonLogger = WinstonModule.createLogger({
  level: logLevel,
  format: isDevelopment ? developmentFormat : productionFormat,
  transports,
  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join(process.cwd(), 'logs', 'exceptions.log'),
    }),
  ],
  rejectionHandlers: [
    new winston.transports.File({
      filename: path.join(process.cwd(), 'logs', 'rejections.log'),
    }),
  ],
});

/**
 * Helper function to create a child logger with context
 *
 * @param context - The context name (usually class name)
 * @returns Winston logger with context
 *
 * @example
 * ```typescript
 * const logger = createLogger('UserService');
 * logger.info('User created', { userId: user.id });
 * ```
 */
export function createLogger(context: string) {
  return {
    log: (message: string, ...args: any[]) =>
      winstonLogger.log('info', message, { context, ...args }),
    error: (message: string, trace?: string, ...args: any[]) =>
      winstonLogger.error(message, { context, trace, ...args }),
    warn: (message: string, ...args: any[]) =>
      winstonLogger.warn(message, { context, ...args }),
    debug: (message: string, ...args: any[]) =>
      winstonLogger.debug(message, { context, ...args }),
    verbose: (message: string, ...args: any[]) =>
      winstonLogger.verbose(message, { context, ...args }),
  };
}

/**
 * Middleware to add request ID to all logs
 *
 * @example
 * ```typescript
 * // In main.ts
 * app.use(requestIdMiddleware);
 * ```
 */
export function requestIdMiddleware(req: any, res: any, next: any) {
  const requestId = req.headers['x-request-id'] || `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  req.requestId = requestId;
  res.setHeader('X-Request-ID', requestId);
  next();
}

/**
 * Log levels explanation:
 *
 * ERROR: Critical issues that need immediate attention
 *   - Database connection failures
 *   - Unhandled exceptions
 *   - External service failures
 *
 * WARN: Potential problems that should be investigated
 *   - Deprecated API usage
 *   - Resource limits approaching
 *   - Failed authentication attempts
 *
 * INFO: Important business events
 *   - User registration
 *   - Site published
 *   - Payment processed
 *
 * DEBUG: Detailed information for debugging
 *   - Function entry/exit
 *   - Variable values
 *   - SQL queries
 *
 * VERBOSE: Very detailed logs (usually disabled in production)
 *   - Every HTTP request
 *   - Cache hits/misses
 *   - Performance metrics
 */
