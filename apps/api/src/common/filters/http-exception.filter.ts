import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

/**
 * Global exception filter that catches all HTTP exceptions
 * and formats them in a consistent structure.
 *
 * @class AllExceptionsFilter
 * @implements {ExceptionFilter}
 *
 * @example
 * ```typescript
 * // In main.ts
 * app.useGlobalFilters(new AllExceptionsFilter());
 * ```
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  /**
   * Catches and handles all exceptions thrown in the application
   *
   * @param exception - The exception that was thrown
   * @param host - The arguments host containing request/response
   */
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = response<Response>();
    const request = ctx.getRequest<Request>();

    // Determine status code
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // Extract error message
    const message = this.getErrorMessage(exception);

    // Extract error details
    const errorResponse = this.getErrorResponse(exception);

    // Generate request ID (or get from headers if available)
    const requestId = (request.headers['x-request-id'] as string) || this.generateRequestId();

    // Log the error
    this.logError(exception, request, status, requestId);

    // Send formatted error response
    response.status(status).json({
      success: false,
      error: {
        code: this.getErrorCode(exception, status),
        message,
        details: errorResponse,
        timestamp: new Date().toISOString(),
        path: request.url,
        method: request.method,
        requestId,
      },
    });
  }

  /**
   * Extracts error message from exception
   */
  private getErrorMessage(exception: unknown): string {
    if (exception instanceof HttpException) {
      const response = exception.getResponse();
      if (typeof response === 'string') {
        return response;
      }
      if (typeof response === 'object' && 'message' in response) {
        const message = (response as any).message;
        return Array.isArray(message) ? message.join(', ') : message;
      }
    }

    if (exception instanceof Error) {
      return exception.message;
    }

    return 'Internal server error';
  }

  /**
   * Extracts detailed error response
   */
  private getErrorResponse(exception: unknown): any {
    if (exception instanceof HttpException) {
      const response = exception.getResponse();
      if (typeof response === 'object') {
        return response;
      }
    }

    return null;
  }

  /**
   * Generates error code based on exception type and status
   */
  private getErrorCode(exception: unknown, status: number): string {
    if (exception instanceof HttpException) {
      const name = exception.constructor.name;
      return name.replace('Exception', '').toUpperCase();
    }

    // Map status codes to error codes
    const errorCodes: Record<number, string> = {
      400: 'BAD_REQUEST',
      401: 'UNAUTHORIZED',
      403: 'FORBIDDEN',
      404: 'NOT_FOUND',
      409: 'CONFLICT',
      422: 'UNPROCESSABLE_ENTITY',
      429: 'TOO_MANY_REQUESTS',
      500: 'INTERNAL_SERVER_ERROR',
      502: 'BAD_GATEWAY',
      503: 'SERVICE_UNAVAILABLE',
    };

    return errorCodes[status] || 'UNKNOWN_ERROR';
  }

  /**
   * Logs the error with appropriate level
   */
  private logError(
    exception: unknown,
    request: Request,
    status: number,
    requestId: string,
  ) {
    const errorInfo = {
      requestId,
      method: request.method,
      path: request.url,
      status,
      userAgent: request.headers['user-agent'],
      ip: request.ip,
      body: this.sanitizeBody(request.body),
      query: request.query,
      params: request.params,
    };

    if (status >= 500) {
      // Server errors - log as error with stack trace
      this.logger.error(
        `Server Error: ${this.getErrorMessage(exception)}`,
        exception instanceof Error ? exception.stack : '',
        errorInfo,
      );
    } else if (status >= 400) {
      // Client errors - log as warning
      this.logger.warn(
        `Client Error: ${this.getErrorMessage(exception)}`,
        errorInfo,
      );
    } else {
      // Other errors - log as debug
      this.logger.debug(
        `Error: ${this.getErrorMessage(exception)}`,
        errorInfo,
      );
    }
  }

  /**
   * Sanitizes request body to remove sensitive data before logging
   */
  private sanitizeBody(body: any): any {
    if (!body || typeof body !== 'object') {
      return body;
    }

    const sensitiveFields = [
      'password',
      'token',
      'accessToken',
      'refreshToken',
      'secret',
      'apiKey',
      'creditCard',
      'ssn',
    ];

    const sanitized = { ...body };
    for (const field of sensitiveFields) {
      if (field in sanitized) {
        sanitized[field] = '[REDACTED]';
      }
    }

    return sanitized;
  }

  /**
   * Generates a unique request ID
   */
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
