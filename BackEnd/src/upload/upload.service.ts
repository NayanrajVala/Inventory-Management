import { BadRequestException, Injectable, Logger } from '@nestjs/common';
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
import { allowedTypesConst } from './upload.const';
import { MailService } from 'src/mail/mail.service';
import { error } from 'winston';

@Injectable()
export class UploadService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
  ) {}
  private readonly logger = new Logger(UploadService.name);
  private s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY!,
      secretAccessKey: process.env.AWS_SECRET_KEY!,
    },
  });

  async getBufferFromS3(key: string) {
    if (!key) {
      throw new BadRequestException('Please provide valid key');
    }
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET!,
      Key: key,
    });

    try {
      const response = await this.s3.send(command);

      return await this.streamToBuffer(response.Body as Readable);
    } catch (error) {
      this.logger.error('Error Getting file from cloud');
      throw new BadRequestException('Error Getting file from cloud');
    }
  }

  async getUploadUrl(filename: string, mimetype: string) {
    let allowedTypes = allowedTypesConst;

    if (!allowedTypes.includes(mimetype)) {
      throw new BadRequestException('Only excel or CSV files are accepted');
    }
    try {
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
    } catch (error) {
      this.logger.error('PreSignedUrl Error', error);
      throw new BadRequestException('Unable to generate upload url');
    }
  }

  async uploadFile(key: string, email: string) {
    if (!key) {
      throw new BadRequestException('File key is required');
    }

    try {
      const user = await this.prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        throw new BadRequestException('User Not Found');
      }

      await this.prisma.document.create({
        data: {
          key,
          uploadedBy: user!.id,
        },
      });
      const buffer = await this.getBufferFromS3(key);

      const lowerKey = key.toLowerCase();

      const result = lowerKey.endsWith('.xlsx')
        ? await this.parseExcel(buffer)
        : await this.parseCsv(buffer);

      const rawfilename = key.split('/').pop()!;
      const filename = rawfilename.substring(rawfilename.indexOf('-') + 1);

      await this.mailService.sendAttachment(email, buffer, filename!);

      return result;
    } catch (error) {
      this.logger.error('File Uploading Error', error);

      if (error instanceof BadRequestException) throw error;
      throw new BadRequestException('Failed to process uploaded file');
    }
  }

  async streamToBuffer(stream: Readable) {
    const chunks: Uint8Array[] = [];
    for await (const chunk of stream) {
      chunks.push(chunk);
    }
    return Buffer.concat(chunks);
  }

  async parseExcel(buffer: Buffer) {
    try {
      const workbook = XLSX.read(buffer, { type: 'buffer' });
      const requiredHeaders = ['name', 'price', 'quantity', 'category'];

      const allRecords: Record<string, any>[] = [];
      const errors: string[] = [];

      for (const sheetName of workbook.SheetNames) {
        const sheetErrors: string[] = [];

        const sheet = workbook.Sheets[sheetName];
        const rawRecords = XLSX.utils.sheet_to_json(sheet, {
          defval: '',
        }) as Record<string, string>[];

        if (!rawRecords.length) continue;

        const records = rawRecords.map((row) => {
          const normalized: Record<string, any> = {};
          for (const key in row) {
            normalized[key.trim().toLowerCase()] = row[key];
          }
          return normalized;
        });

        const headers = Object.keys(records[0]);

        //  header validation
        for (const required of requiredHeaders) {
          if (!headers.includes(required)) {
            sheetErrors.push(
              `Sheet "${sheetName}": missing column "${required}"`,
            );
          }
        }

        // if header errors → record & skip rows of this sheet
        if (sheetErrors.length) {
          errors.push(...sheetErrors);
          continue;
        }

        // attach metadata
        records.forEach((row, index) => {
          allRecords.push({
            ...row,
            __sheet: sheetName,
            __row: index + 2,
          });
        });
      }

      // ✅ process rows EVEN IF some sheets had header errors
      let rowErrors: string[] = [];

      if (allRecords.length) {
        try {
          await this.processRecords(allRecords);
        } catch (err) {
          if (err instanceof BadRequestException) {
            const msg = err.getResponse() as any;
            if (Array.isArray(msg.message)) {
              rowErrors = msg.message;
            }
          } else {
            throw err;
          }
        }
      }

      const combinedErrors = [...errors, ...rowErrors];

      if (combinedErrors.length) {
        throw new BadRequestException(combinedErrors);
      }

      return {
        message: 'Products imported successfully',
        count: allRecords.length,
      };
    } catch (error) {
      this.logger.error('Error parsing Excel', error);

      if (error instanceof BadRequestException) throw error;
      if (error instanceof Error) throw new BadRequestException(error.message);

      throw new BadRequestException('Unexpected Excel parsing error');
    }
  }
  async parseCsv(buffer: Buffer) {
    try {
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

      const headers = Object.keys(records[0]).map((h) =>
        h.trim().toLowerCase(),
      );

      for (const h of requiredHeaders) {
        if (!headers.includes(h)) {
          throw new BadRequestException(`missing column ${h}`);
        }
      }

      return this.processRecords(records);
    } catch (error) {
      this.logger.error('Error parsing CSV', error);
      if (error instanceof Error) throw new BadRequestException(error.message);

      throw new BadRequestException('Unexpected error Occured');
    }
  }

  private async processRecords(records: any[]) {
    try {
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

        const sheet = row.__sheet ?? 'unknown';
        const rowNumber = row.__row ?? i + 1;

        if (!name) errors.push(`Sheet ${sheet} Row ${rowNumber} :name missing`);
        if (isNaN(price))
          errors.push(`Sheet ${sheet} Row ${rowNumber} :invalid price`);
        if (isNaN(quantity))
          errors.push(`Sheet ${sheet} Row ${rowNumber} : invalid quantity`);

        const categoryId = categoryMap.get(categoryName);

        if (!categoryId) {
          errors.push(
            `Sheet ${sheet} Row ${rowNumber}: "${row.category}" category not found`,
          );
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
    } catch (error) {
      this.logger.error('Error processing Records', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Error Processing Records');
    }
  }
}
