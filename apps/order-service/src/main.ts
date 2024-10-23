import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { OrderServiceModule } from './order-service.module';
import { grpcConfig } from '../config/grpc.config';
import { ValidationPipe } from 'libs/common/shared/validation.pipe';

async function bootstrap() {
  const logger = new Logger('OrderService');
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    OrderServiceModule,
    grpcConfig,
  );

  app.useGlobalPipes(new ValidationPipe());
  await app.listen();
  logger.log(`Order service is listening on ${grpcConfig.options.url}`);
}
bootstrap();
