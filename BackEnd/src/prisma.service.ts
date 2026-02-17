import { Injectable,INestApplication,OnModuleInit,OnModuleDestroy,Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit,OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);
  constructor() {
    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL,
    });
    super({ adapter });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log(
        ' connection established with PrismaClient and PrismaPg adapter',
      );
    } catch (error: unknown) {
      this.logger.error(' Failed to connect to Prisma', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    try {
      await this.$disconnect();
      this.logger.log(' Prisma connection closed');
    } catch (error: unknown) {
      this.logger.error(' Error disconnecting from Prisma', error);
    }
  }
}

// import {
//   Injectable,
//   Logger,
//   OnModuleDestroy,
//   OnModuleInit,
// } from '@nestjs/common';
// import { PrismaPg } from '@prisma/adapter-pg';
// import { PrismaClient } from '@prisma/client';

// @Injectable()
// export class PrismaService
//   extends PrismaClient
//   implements OnModuleInit, OnModuleDestroy
// {
//   private readonly logger = new Logger(PrismaService.name);

//   constructor() {
//     // const connectionString = configService.get<string>('DATABASE_URL');
//     // const adapter = new PrismaPg({ connectionString });
//     const adapter = new PrismaPg({
//       connectionString: process.env.DATABASE_URL,
//     });
//     super({ adapter });
//   }

//   async onModuleInit() {
//     try {
//       await this.$connect();
//       this.logger.log(
//         '\n🔌 Database connection established with PrismaClient and PrismaPg adapter',
//       );
//     } catch (error: unknown) {
//       this.logger.error('\n❌ Failed to connect to database', error);
//       throw error;
//     }
//   }

//   async onModuleDestroy() {
//     try {
//       await this.$disconnect();
//       this.logger.log('\n🔌 Database connection closed');
//     } catch (error: unknown) {
//       this.logger.error('\n❌ Error disconnecting from database', error);
//     }
//   }

//   async enableShutdownHooks(app: { close: () => Promise<void> }) {
//     // Handle graceful shutdown
//     process.on('beforeExit', async () => {
//       await this.$disconnect();
//       await app.close();
//     });
//   }
// }
