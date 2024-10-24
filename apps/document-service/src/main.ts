import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { DocumentServiceModule } from './document-service.module';
import { grpcConfig } from '../config/grpc.config';
import { ValidationPipe } from 'libs/common/shared/validation.pipe';

async function bootstrap() {
  const logger = new Logger('DocumentService');
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    DocumentServiceModule,
    grpcConfig,
  );

  app.useGlobalPipes(new ValidationPipe());
  await app.listen();
  logger.log(`Document service is listening on ${grpcConfig.options.url}`);
}
bootstrap();
