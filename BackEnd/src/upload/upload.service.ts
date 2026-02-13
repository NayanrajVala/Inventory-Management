import { BadRequestException, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import fastify = require('fastify');
import path from 'path';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

@Injectable()
export class UploadService {
  private s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY!,
      secretAccessKey: process.env.AWS_SECRET_KEY!,
    },
  });
  async uploadFile(req: fastify.FastifyRequest) {
    if (!req.isMultipart()) {
      throw new BadRequestException('request must be multipart');
    }

    const file = await req.file();

    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const allowedTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/csv',
      'application/csv'
    ];

    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException('Only excel files are accepted');
    }

    const buffer = await file.toBuffer();

    const key = `excel/${Date.now()}-${file.filename}`;

    await this.s3.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET!,
        Key: key,
        Body: buffer,
        ContentType: file.mimetype,
      }),
    );

    const url = `https://${process.env.AWS_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    return {
      message: 'File Uploaded successfully',
      filename: file.filename,
      url,
    };
  }
}
