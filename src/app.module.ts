import { Module ,MiddlewareConsumer,NestModule} from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { PrismaModule } from './prisma.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';

@Module({
  imports: [ProductsModule, PrismaModule],
})
export class AppModule implements NestModule{
  configure(consumer:MiddlewareConsumer){
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
