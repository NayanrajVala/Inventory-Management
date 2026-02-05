import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaModule } from 'src/prisma.module';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import "dotenv/config";
import { jwtAuthGuard } from './auth.guard';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports:[PrismaModule,UserModule,MailModule, JwtModule.register({
    secret:process.env.JWT_SECRET,
    signOptions:{expiresIn:'45m'}
  })],
  controllers: [AuthController],
  providers: [AuthService,jwtAuthGuard],
  exports:[AuthService,jwtAuthGuard]
})
export class AuthModule {}
