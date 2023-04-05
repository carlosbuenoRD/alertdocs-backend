import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS
  app.enableCors();

  // PREFIX
  app.setGlobalPrefix('api');

  // BAD PRACTICE USED IT JUST FOR DEVELOPEMENT PORPUSE
  // process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

  // SWAGGER
  const config = new DocumentBuilder()
    .setTitle('AlertDocs')
    .setDescription(
      'Api consumida por el proyecto de medicion de eficiencia alertdocs',
    )
    .setVersion('1.0')
    .addTag('Users')
    .addTag('Areas')
    .addTag('Auth')
    .addTag('Flujos')
    .addTag('Documents')
    .addTag('Devoluciones')
    .addTag('Reports')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(3000);
}

bootstrap();
