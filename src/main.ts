import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  /*  Validation with class-validate */
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  await app.listen(parseInt(process.env.PORT, 10) || 3000);
}

bootstrap();
