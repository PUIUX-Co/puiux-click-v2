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
 * All Exceptions Filter
 * Catches all exceptions and formats them consistently
 * Logs all errors with context
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger('ExceptionHandler');

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message:
        typeof message === 'object' && 'message' in message
          ? (message as any).message
          : message,
      ...(process.env.NODE_ENV !== 'production' && {
        stack: exception instanceof Error ? exception.stack : undefined,
      }),
    };

    // Log error with context
    const userId = (request as any).user?.sub || 'Anonymous';
    const errorMessage = exception instanceof Error ? exception.message : 'Unknown error';
    const errorStack = exception instanceof Error ? exception.stack : '';

    this.logger.error(
      `[${request.method}] ${request.url} - ${status} - User: ${userId} - Error: ${errorMessage}`,
      errorStack,
    );

    // Additional context for 500 errors
    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        `Request Body: ${JSON.stringify(request.body)}`,
        'Request Details',
      );
      this.logger.error(
        `Query Params: ${JSON.stringify(request.query)}`,
        'Request Details',
      );
      this.logger.error(
        `Request Headers: ${JSON.stringify(request.headers)}`,
        'Request Details',
      );
    }

    response.status(status).json(errorResponse);
  }
}
