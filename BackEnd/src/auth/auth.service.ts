import {
  ConflictException,
  Injectable,
  UnauthorizedException,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { signupDto } from 'src/auth/dtos/signup.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { RedisService } from 'src/redis/redis.service';
import { MailService } from 'src/mail/mail.service';
import { otpCheckDto } from 'src/mail/dtos/verifyOtp.dto';
import { Role } from 'src/common/enums/role.enum';
import { PrismaService } from 'src/prisma.service';
import { FastifyReply, FastifyRequest } from 'fastify';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
    private readonly mailService: MailService,
    private readonly prisma: PrismaService,
  ) {}
  private readonly logger = new Logger(AuthService.name);

  async signup(dto: signupDto) {
    try {
      const { email, password } = dto;
      const existingUser = await this.userService.findByEmail(dto.email);

      if (existingUser) {
        throw new ConflictException('User already exist');
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await this.userService.create({
        email,
        password: hashedPassword,
        roles: [Role.USER],
        isVerified: false,
      });

      const otp = Math.floor(100000 + Math.random() * 900000);

      await this.redisService.set(email, otp, 300);
      await this.mailService.sendOtp(email, otp);

      return {
        user: {
          id: user.id,
          email: user.email,
          roles: user.roles,
        },
      };
    } catch (error) {
      this.logger.error('Error signing up user');
      throw new BadRequestException('Error signing up user');
    }
  }

  async verifyOtp(dto: otpCheckDto) {
    try {
      const { otp, email } = dto;

      const storedOtp = await this.redisService.get(email);

      if (!storedOtp) {
        throw new UnauthorizedException('Otp expired or not found');
      }

      if (storedOtp !== otp) {
        throw new UnauthorizedException('Invalid Otp');
      }

      await this.userService.verifyUser(email);

      return {
        message: 'email verified',
      };
    } catch (error) {
      this.logger.log('error verifying Otp');
      throw new BadRequestException('Error verifying Otp');
    }
  }

  async login(dto: signupDto, reply: FastifyReply) {
    try {
      const { email, password } = dto;
      const user = await this.userService.findByEmail(email);

      if (!user) {
        throw new UnauthorizedException('Invalid Credentials');
      }

      if (!user.isVerified) {
        throw new UnauthorizedException('You have to verify email first');
      }

      const isPass = await bcrypt.compare(password, user.password);

      if (!isPass) {
        throw new UnauthorizedException('Invalid Credentials');
      }

      const payload = {
        sub: user.id,
        email: user.email,
        roles: user.roles,
      };

      const accessToken = this.jwtService.sign(payload);
      const refreshToken = this.jwtService.sign(payload, {
        expiresIn: '7d',
      });

      const hash = await bcrypt.hash(refreshToken, 10);

      await this.prisma.user.update({
        where: { id: user.id },
        data: { refreshTokenHash: hash },
      });

      reply.setCookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        path: '/',
      });
      return {
        accessToken,
        user: {
          id: user.id,
          email: user.email,
          roles: user.roles,
        },
      };
    } catch (error) {
      this.logger.error('Error login in user');
      throw new BadRequestException('Error Loging in user');
    }
  }

  async refresh(req: FastifyRequest, reply: FastifyReply) {
    const token = req.cookies.refreshToken;

    if (!token) {
      throw new UnauthorizedException();
    }

    const payload = this.jwtService.verify(token);

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user || !user.refreshTokenHash) {
      throw new UnauthorizedException();
    }

    const valid = await bcrypt.compare(token, user.refreshTokenHash);
    if (!valid) {
      throw new UnauthorizedException();
    }

    const newAccessToken = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      roles: user.roles,
    });

    const newRefreshToken = this.jwtService.sign(
      {
        sub: user.id,
        email: user.email,
        roles: user.roles,
      },
      {
        expiresIn: '7d',
      },
    );

    const hash = await bcrypt.hash(newRefreshToken, 10);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshTokenHash: hash },
    });

    reply.setCookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/',
    });

    return { accessToken: newAccessToken };
  }

  async logout(userId: string, reply: FastifyReply) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshTokenHash: null },
    });

    reply.clearCookie('refreshToken', {
      path: '/',
    });

    return { message: 'Logged out successfully' };
  }
}
