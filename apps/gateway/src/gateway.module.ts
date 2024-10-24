import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';
import { join } from 'path';
import { SERVICES } from 'libs/common/shared/constants';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: SERVICES.USER,
        transport: Transport.GRPC,
        options: {
          package: 'user',
          protoPath: join(__dirname, '..', '..', '..', 'proto', 'user.proto'),
          url: '0.0.0.0:50053',
        },
      },
      {
        name: SERVICES.ORDER,
        transport: Transport.GRPC,
        options: {
          package: 'order',
          protoPath: join(__dirname, '..', '..', '..', 'proto', 'order.proto'),
          url: '0.0.0.0:50052',
          loader: {
            keepCase: true,
            longs: String,
            enums: String,
            defaults: true,
            oneofs: true,
          },
          maxReceiveMessageLength: 1024 * 1024 * 100, // 100MB
          maxSendMessageLength: 1024 * 1024 * 100, // 100MB
        },
      },
      {
        name: SERVICES.DOCUMENT,
        transport: Transport.GRPC,
        options: {
          package: 'document',
          protoPath: join(
            __dirname,
            '..',
            '..',
            '..',
            'proto',
            'document.proto',
          ),
          url: '0.0.0.0:50054',
          loader: {
            keepCase: true,
            longs: String,
            enums: String,
            defaults: true,
            oneofs: true,
          },
          maxReceiveMessageLength: 1024 * 1024 * 100, // 100MB
          maxSendMessageLength: 1024 * 1024 * 100, // 100MB
        },
      },
    ]),
  ],
  controllers: [GatewayController],
  providers: [GatewayService],
})
export class GatewayModule {}
