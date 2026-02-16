import { BadRequestException, Injectable } from '@nestjs/common';
import { parse } from 'csv-parse/sync';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { PrismaService } from 'src/prisma.service';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Readable } from 'stream';
import * as XLSX from 'xlsx';

@Injectable()
export class UploadService {
  constructor(private prisma: PrismaService) {}
  private s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY!,
      secretAccessKey: process.env.AWS_SECRET_KEY!,
    },
  });

  async getUploadUrl(filename: string, mimetype: string) {
    const allowedTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/csv',
      'application/csv',
    ];

    if (!allowedTypes.includes(mimetype)) {
      throw new BadRequestException('Only excel or CSV files are accepted');
    }

    const key = `import/${Date.now()}-${filename}`;

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET!,
      Key: key,
      ContentType: mimetype,
    });

    const uploadUrl = await getSignedUrl(this.s3, command, {
      expiresIn: 600,
    });

    return { uploadUrl, key };
  }

  async uploadFile(key: string) {
    if (!key) {
      throw new BadRequestException('File key is required');
    }

    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET!,
      Key: key,
    });

    const response = await this.s3.send(command);

    const streamToBuffer = async (stream: Readable) => {
      const chunks: Uint8Array[] = [];

      for await (const chunk of stream) {
        chunks.push(chunk);
      }

      return Buffer.concat(chunks);
    };

    const buffer = await streamToBuffer(response.Body as Readable);

    if (key.endsWith('.xlsx')) {
      return this.parseExcel(buffer);
    }

    return this.parseCsv(buffer);
  }

  async parseExcel(buffer: Buffer) {
    const workbook = XLSX.read(buffer, { type: 'buffer' });

    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    const rawRecords = XLSX.utils.sheet_to_json(sheet, {
      defval: '',
    }) as Record<string, string>[];

    if (!rawRecords.length) {
      throw new BadRequestException('Excel file is empty');
    }

    const records = rawRecords.map((row) => {
      const normalized: Record<string, any> = {};

      for (const key in row) {
        normalized[key.trim().toLowerCase()] = row[key];
      }

      return normalized;
    });
    const headers = Object.keys(records[0]).map((h) => h.trim().toLowerCase());

    const requiredHeaders = ['name', 'price', 'quantity', 'category'];

    for (const h of requiredHeaders) {
      if (!headers.includes(h)) {
        throw new BadRequestException(`Missing Column ${h}`);
      }
    }

    return this.processRecords(records);
  }
  async parseCsv(buffer: Buffer) {
    const records = parse(buffer.toString(), {
      columns: (header) => header.map((h) => h.trim().toLowerCase()),
      skip_empty_lines: true,
      trim: true,
      relax_column_count: true,
    }) as Record<string, string>[];

    if (!records.length) {
      throw new BadRequestException(`csv file is empty`);
    }

    const requiredHeaders = ['name', 'price', 'quantity', 'category'];

    const headers = Object.keys(records[0]).map((h) => h.trim().toLowerCase());

    for (const h of requiredHeaders) {
      if (!headers.includes(h)) {
        console.log('First Row', records[0]);
        throw new BadRequestException(`missing column ${h}`);
      }
    }

    return this.processRecords(records);
  }

  private async processRecords(records: any[]) {
    const categories = await this.prisma.category.findMany();
    const categoryMap = new Map(
      categories.map((c) => [c.name.toLowerCase(), c.id]),
    );

    const errors: string[] = [];
    const products: any[] = [];

    for (let i = 0; i < records.length; i++) {
      const row = records[i];

      const name = row.name?.toString().trim();
      const price = Number(row.price);
      const quantity = Number(row.quantity);
      const categoryName = row.category?.toString().trim().toLowerCase();

      if (!name) errors.push(`Row ${i + 1}: name missing`);
      if (isNaN(price)) errors.push(`Row ${i + 1}: invalid price`);
      if (isNaN(quantity)) errors.push(`Row ${i + 1}: invalid quantity`);

      const categoryId = categoryMap.get(categoryName);

      if (!categoryId) {
        errors.push(`Row ${i + 1}: ${row.category} not valid`);
      }

      products.push({ name, price, quantity, categoryId });
    }

    if (errors.length) {
      throw new BadRequestException(errors);
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.product.createMany({
        data: products,
        skipDuplicates: true,
      });
    });

    return {
      message: 'Products imported successfully',
      count: products.length,
    };
  }
}
