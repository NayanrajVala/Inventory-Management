import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { PrismaModule } from './prisma.module';

@Module({
  imports: [ProductsModule, PrismaModule],
})
export class AppModule {}
