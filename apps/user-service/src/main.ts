import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { UserServiceModule } from './user-service.module';
import { grpcConfig } from '../config/grpc.config';
import { ValidationPipe } from 'libs/common/shared/validation.pipe';

async function bootstrap() {
  const logger = new Logger('UserService');
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    UserServiceModule,
    grpcConfig,
  );

  app.useGlobalPipes(new ValidationPipe());
  await app.listen();

  logger.log(`User service is listening on ${grpcConfig.options.url}`);
}
bootstrap();
