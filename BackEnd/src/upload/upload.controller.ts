import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { UploadService } from './upload.service';
import { jwtAuthGuard } from 'src/auth/auth.guard';
import { Getuser } from 'src/common/decorators/get-user.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiBody,
  ApiResponse,  
} from '@nestjs/swagger';

@ApiTags('Upload')
@ApiBearerAuth()
@UseGuards(jwtAuthGuard)
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('presigned-url')
  @ApiOperation({summary:"Generates s3 presigned url for file upload"})
  @ApiResponse({
    status:201,
    description:"presigned url generated successfully"
  })
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
  @ApiOperation({summary:"Process uploaded file and import products"})
  @ApiResponse({
    status:201,
    description:"File Uploaded successfully"
  })
  async importFile(@Body() body: { key: string }, @Getuser('email')email:string) {
    return await this.uploadService.uploadFile(body.key, email);
  }
}
