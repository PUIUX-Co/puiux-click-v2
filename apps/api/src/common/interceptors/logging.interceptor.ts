import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

/**
 * Logging interceptor that logs all HTTP requests and responses
 *
 * Logs:
 * - Request method, URL, and body
 * - Response status code and duration
 * - User information (if authenticated)
 * - Request ID for tracking
 *
 * @class LoggingInterceptor
 * @implements {NestInterceptor}
 *
 * @example
 * ```typescript
 * // Apply globally in main.ts
 * app.useGlobalInterceptors(new LoggingInterceptor());
 *
 * // Or apply to specific controller/route
 * @UseInterceptors(LoggingInterceptor)
 * @Controller('sites')
 * export class SitesController {}
 * ```
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body, user, headers } = request;
    const requestId = headers['x-request-id'] || request.requestId;
    const userAgent = headers['user-agent'] || '';
    const ip = request.ip || request.connection.remoteAddress;

    const now = Date.now();

    // Log request
    this.logger.log({
      type: 'request',
      requestId,
      method,
      url,
      userId: user?.id,
      organizationId: user?.organizationId,
      ip,
      userAgent,
      body: this.sanitizeBody(body),
    });

    return next.handle().pipe(
      tap({
        next: () => {
          const response = context.switchToHttp().getResponse();
          const { statusCode } = response;
          const duration = Date.now() - now;

          // Log response
          this.logger.log({
            type: 'response',
            requestId,
            method,
            url,
            statusCode,
            duration: `${duration}ms`,
            userId: user?.id,
          });
        },
        error: (error: Error) => {
          const duration = Date.now() - now;

          // Log error
          this.logger.error({
            type: 'error',
            requestId,
            method,
            url,
            duration: `${duration}ms`,
            error: error.message,
            userId: user?.id,
          });
        },
      }),
    );
  }

  /**
   * Sanitizes request body to remove sensitive data
   */
  private sanitizeBody(body: any): any {
    if (!body || typeof body !== 'object') {
      return body;
    }

    const sensitiveFields = ['password', 'token', 'secret', 'apiKey'];
    const sanitized = { ...body };

    for (const field of sensitiveFields) {
      if (field in sanitized) {
        sanitized[field] = '[REDACTED]';
      }
    }

    return sanitized;
  }
}
