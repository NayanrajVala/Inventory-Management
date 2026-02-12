import { Module ,MiddlewareConsumer,NestModule} from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { PrismaModule } from './prisma.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { RedisModule } from './redis/redis.module';
import { MailModule } from './mail/mail.module';
import { CategoryModule } from './category/category.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [ProductsModule, PrismaModule, AuthModule, UserModule, RedisModule, MailModule, CategoryModule, UploadModule],
})
export class AppModule implements NestModule{
  configure(consumer:MiddlewareConsumer){
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
