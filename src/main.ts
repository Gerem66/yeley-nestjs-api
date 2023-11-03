import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // ValidationPipe allow controllers to throw errors when the body does not match the attached DTO.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      disableErrorMessages: false,
    }),
  );
  // Swagger configuration.
  const config = new DocumentBuilder()
    .addTag('Users')
    .addTag('Establishments')
    .addTag('Auth')
    .addTag('Legalities')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('doc', app, document);
  await app.listen(3000);
}

bootstrap();
