import { Controller, Req,Post, Res } from '@nestjs/common';
import { UploadService } from './upload.service';
import type { FastifyReply, FastifyRequest } from 'fastify';

@Controller('upload')
export class UploadController {
    constructor(private readonly uploadService:UploadService){}

    @Post('/file')
    async uploadFile(@Req() req:FastifyRequest ){
        // const parts = req.parts()
        await this.uploadService.uploadFile(req);
    }
}
