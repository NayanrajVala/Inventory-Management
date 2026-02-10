import { Controller, Post, Body, Redirect, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { signupDto } from 'src/products/dtos/signup.dto';
import { otpCheckDto } from 'src/products/dtos/verifyOtp.dto';
import { ApiTags, ApiOperation, ApiCreatedResponse } from '@nestjs/swagger';
import type { FastifyReply, FastifyRequest } from 'fastify';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'SignUp' })
  @ApiCreatedResponse({ description: 'SignUp Successfull' })
  async signup(@Body() dto: signupDto) {
    await this.authService.signup(dto);
    return;
  }

  @Post('verify-otp')
  @ApiOperation({ summary: 'Otp Verification' })
  @ApiCreatedResponse({ description: 'Otp Verified' })
  async verifyOtp(@Body() dto: otpCheckDto) {
    return await this.authService.verifyOtp(dto);
  }
  @Post('login')
  @ApiOperation({ summary: 'Login' })
  @ApiCreatedResponse({ description: 'Login Successfull' })
  async login(
    @Res({ passthrough: true }) reply: FastifyReply,
    @Body() dto: signupDto,
  ) {
    console.log('Auth/login hit');
    // console.log(await this.authService.login(dto));
    return this.authService.login(dto, reply);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'RefreshTOken' })
  async refresh(
    @Req() req: FastifyRequest,
    @Res({ passthrough: true }) reply: FastifyReply,
  ) {
    return this.authService.refresh(req, reply);
  }
}
