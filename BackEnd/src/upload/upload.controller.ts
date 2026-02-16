import { Controller, Req,Post,Body } from '@nestjs/common';
import { UploadService } from './upload.service';
import type { FastifyReply, FastifyRequest } from 'fastify';

@Controller('upload')
export class UploadController {
    constructor(private readonly uploadService:UploadService){}

    @Post('presigned-url')
    getUploadUrl(
        @Body()
        body:{
                filename:string,
                mimetype:string
        }
    ){
        return this.uploadService.getUploadUrl(
            body.filename,
            body.mimetype
        )
    }
    @Post('/import')
    async importFile(@Body() body:{key:string} ){
        return await this.uploadService.uploadFile(body.key);
    }
}
