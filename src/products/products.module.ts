import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { PrismaService } from 'src/prisma.service';
import { PrismaModule } from 'src/prisma.module';
import { AuthModule } from 'src/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [ProductsController],
  imports: [PrismaModule,AuthModule,JwtModule],
  providers: [ProductsService, PrismaService],
})
export class ProductsModule {}
