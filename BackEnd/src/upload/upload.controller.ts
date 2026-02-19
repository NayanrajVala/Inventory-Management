import { Controller, Req, Post, Body, UseGuards } from '@nestjs/common';
import { UploadService } from './upload.service';
import type { FastifyRequest } from 'fastify';
import { jwtAuthGuard } from 'src/auth/auth.guard';
import type { FastRequest } from 'src/common/Types/request.types';
import { Getuser } from 'src/common/decorators/get-user.decorator';


@UseGuards(jwtAuthGuard)
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('presigned-url')
  getUploadUrl(
    @Body()
    body: {
      filename: string;
      mimetype: string;
    },
  ) {
    return this.uploadService.getUploadUrl(body.filename, body.mimetype);
  }
  @Post('/import')
  async importFile(@Body() body: { key: string }, @Getuser('email')email:string) {
    return await this.uploadService.uploadFile(body.key, email);
  }
}
