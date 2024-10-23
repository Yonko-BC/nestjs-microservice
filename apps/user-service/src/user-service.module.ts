import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { SERVICES } from 'libs/common/shared/constants';
import { join } from 'path';

@Module({
  imports: [
    ClientsModule.register([
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
    ]),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserServiceModule {}
