import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
<<<<<<< HEAD
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(join(__dirname, '..', 'frontend')); 
  app.setBaseViewsDir(join(__dirname, '..', 'frontend'));
  
=======

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // Permite CORS para conectar con el frontend
>>>>>>> d24c14e99f5f18ad1aa6df41127a734373a1aa8b
  await app.listen(3000);
}
bootstrap();