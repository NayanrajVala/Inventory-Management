import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/exceptions/http_Exceptions.filter';
import {SwaggerModule,DocumentBuilder} from '@nestjs/swagger';
import cookie from "@fastify/cookie";
// import multipart from '@fastify/multipart';
import '@fastify/multipart';
const multipart = require('@fastify/multipart')


async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  app.enableCors({
    origin:"http://localhost:5173",
    credentials:true
  });
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.register(multipart);


  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('My API')
    .setDescription('API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);
    await app.register(cookie as any);


  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
