import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import {
  badRequestResponse,
  unauthorizedResponse,
  forbiddenResponse,
  notFoundResponse,
  conflictResponse,
  internalErrorResponse,
} from '@src/common/helpers/response.helper';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    ctx.getRequest<Request>();
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      message = typeof res === 'string' ? res : (res as any).message;
    }

    switch (status) {
      case HttpStatus.BAD_REQUEST:
        response.status(status).json(badRequestResponse(message));
        break;
      case HttpStatus.UNAUTHORIZED:
        response.status(status).json(unauthorizedResponse(message));
        break;
      case HttpStatus.FORBIDDEN:
        response.status(status).json(forbiddenResponse(message));
        break;
      case HttpStatus.NOT_FOUND:
        response.status(status).json(notFoundResponse(message));
        break;
      case HttpStatus.CONFLICT:
        response.status(status).json(conflictResponse(message));
        break;
      case HttpStatus.INTERNAL_SERVER_ERROR:
      default:
        response.status(status).json(internalErrorResponse(message));
        break;
    }
  }
}
