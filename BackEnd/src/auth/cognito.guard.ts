import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';

@Injectable()
export class CognitoAuthGuard implements CanActivate {
  private client = jwksClient({
    jwksUri:
      'https://cognito-idp.ap-south-1.amazonaws.com/ap-south-1_f4yk6T02N/.well-known/jwks.json',
    cache: true,
    rateLimit: true,
  });

  private getKey(header, callback) {
  this.client.getSigningKey(header.kid, (err, key) => {
    if (err || !key) {
      return callback(err || new Error('Signing key not found'));
    }

    const signingKey = key.getPublicKey();
    callback(null, signingKey);
  });
}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Token missing');
    }

    const token = authHeader.replace('Bearer ', '');

    try {
      const decoded = await new Promise((resolve, reject) => {
        jwt.verify(
          token,
          this.getKey.bind(this),
          {
            issuer:
              'https://cognito-idp.ap-south-1.amazonaws.com/ap-south-1_f4yk6T02N',
            algorithms: ['RS256'],
          },
          (err, decoded) => {
            if (err) reject(err);
            resolve(decoded);
          },
        );
      });

      request.user = decoded;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}