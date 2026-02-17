import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';

const logger = new Logger('ExceptionFilter');

@Catch()
export class GlobalHttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();

    const request = ctx.getRequest<FastifyRequest>();
    const reply = ctx.getResponse<FastifyReply>();

    const isHttpException = exception instanceof HttpException;
    logger.error(`${request.method} ${request.url}`, (exception as any)?.stack);

    const status = isHttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const response = isHttpException
      ? exception.getResponse()
      : 'Internal server error';

    reply.status(status).send({
      success: false,
      statusCode: status,
      path: request.url,
      method: request.method,
      timestamp: new Date().toISOString(),
      message:
        typeof response === 'string'
          ? response
          : (response as any).message || response,
    });
  }
}
