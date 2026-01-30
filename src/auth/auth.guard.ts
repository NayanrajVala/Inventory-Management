import {
  CanActivate,
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { FastifyRequest } from 'fastify';
import 'dotenv';

interface Request extends FastifyRequest{
  user?:{
    userId:string,
    roles:string[],
    email:string
  };
}
@Injectable()
export class jwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();

    const header = request.headers.authorization;

    console.log(header);
    if (!header) {
      throw new UnauthorizedException('Authorization header missing');
    }
    const [type, token] = header.split(' ');
    console.log('type', type, token);
    if (!token && !(type == 'Bearer')) {
      throw new UnauthorizedException('Token is missing or expired');
    }
    try {
      console.log('Token Hit');
      console.log(token);
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
      console.log('PayLoad Verified');
      request.user = {
        userId: payload.sub,
        roles: payload.roles,
        email: payload.email,
      };
      console.log('Token Verified');
      return true;
    } catch (err) {
      console.log('Catch Hit in Auth Guard: ', err.message);
      throw new UnauthorizedException('Invalid Token');
    }
    // return true;
  }
}
