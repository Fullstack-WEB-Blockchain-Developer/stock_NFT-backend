import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const PORT = process.env.PORT || 3000;
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  const docConfig = new DocumentBuilder()
    .setTitle('Stoke NFT')
    .setDescription('Demo REST API documentation')
    .setVersion('1.0.0')
    .addTag('Interexy')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, docConfig);

  //go to url/api/docs to see REST API documentation
  SwaggerModule.setup('/api/docs', app, document);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  await app.listen(PORT, () => Logger.log(`Server listening on port ${PORT}`));
}
bootstrap();
