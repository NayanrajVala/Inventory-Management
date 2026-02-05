import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { PrismaService } from 'src/prisma.service';
import { PrismaModule } from 'src/prisma.module';
import { AuthModule } from 'src/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { RolesGuard } from 'src/common/guards/roles.guard';

@Module({
  controllers: [CategoryController],
  imports:[PrismaModule,AuthModule,JwtModule],
  providers: [CategoryService,PrismaService,RolesGuard]
})
export class CategoryModule {}
