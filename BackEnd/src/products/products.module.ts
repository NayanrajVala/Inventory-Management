import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { PrismaService } from 'src/prisma.service';
import { PrismaModule } from 'src/prisma.module';
import { AuthModule } from 'src/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { RolesGuard } from 'src/common/guards/roles.guard';

@Module({
  controllers: [ProductsController],
  imports: [PrismaModule,AuthModule,JwtModule],
  providers: [ProductsService, PrismaService,RolesGuard],
})
export class ProductsModule {}
