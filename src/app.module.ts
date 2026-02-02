import { Module ,MiddlewareConsumer,NestModule} from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { PrismaModule } from './prisma.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { RedisModule } from './redis/redis.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [ProductsModule, PrismaModule, AuthModule, UserModule, RedisModule, MailModule],
})
export class AppModule implements NestModule{
  configure(consumer:MiddlewareConsumer){
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
