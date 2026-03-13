import {
  Catch,
  ArgumentsHost,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Request, Response } from 'express';
import { MyLoggerService } from './my-logger/my-logger.service';
import { Prisma } from '@prisma/client';

type MyResponseObj = {
  statusCode: number;
  timestamp: string;
  path: string;
  response: string | object;
};

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  private readonly logger = new MyLoggerService(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const myResponseObj: MyResponseObj = {
      statusCode: 500,
      timestamp: new Date().toISOString(),
      path: request.url,
      response: '',
    };

    if (exception instanceof HttpException) {
      myResponseObj.statusCode = exception.getStatus();
      myResponseObj.response = exception.getResponse();
    } else if ((exception as any).code === 'P2002') {
      // Example: Prisma unique constraint error
      myResponseObj.statusCode = 422;
      myResponseObj.response = (exception as Error).message.replaceAll(
        /\n/g,
        ' ',
      );
    } else {
      myResponseObj.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      myResponseObj.response = 'Internal Server Error';
    }

    this.logger.error(myResponseObj.response, AllExceptionsFilter.name);
    response.status(myResponseObj.statusCode).json(myResponseObj);
  }
}
