import { Injectable, NestMiddleware } from '@nestjs/common';
// import { Request,Response,NextFunction } from "@nestjs/common";
import { FastifyRequest, FastifyReply } from 'fastify';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: FastifyRequest, res: FastifyReply, next: () => void) {
    console.log(`[${req.method}] ${req.originalUrl}`);
    next();
  }
}
