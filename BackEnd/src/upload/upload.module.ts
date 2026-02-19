import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { MailModule } from 'src/mail/mail.module';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports:[MailModule,UserModule,JwtModule],
  controllers: [UploadController],
  providers: [UploadService]
})
export class UploadModule {}
