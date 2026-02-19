import {
  CanActivate,
  Injectable,
  ExecutionContext,
  UnauthorizedException,
  Logger
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import 'dotenv';
import type {FastRequest} from '../common/Types/request.types' // adds user in the request 


@Injectable()
export class jwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}
  private readonly logger = new Logger(jwtAuthGuard.name)
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<FastRequest>();

    const header = request.headers.authorization;

    if (!header) {
      throw new UnauthorizedException('Authorization header missing');
    }
    const [type, token] = header.split(' ');
    if (!token || !(type == 'Bearer')) {
      throw new UnauthorizedException('Token is missing or expired');
    }
    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
      request.user = {
        userId: payload.sub,
        roles: payload.roles,
        email: payload.email,
      };
      return true;
    } catch (err:any) {
      this.logger.error('Catch Hit in Auth Guard: ', err.message);
      throw new UnauthorizedException('Invalid Token');
    }
  }
}
