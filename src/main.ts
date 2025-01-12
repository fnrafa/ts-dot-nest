import { NestFactory } from '@nestjs/core';
import { AppModule } from '@src/app.module';
import { GlobalExceptionFilter } from '@src/common/exceptions/http-exception.filter';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new GlobalExceptionFilter());
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap().then();
