import { GrpcOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

export const grpcConfig: GrpcOptions = {
  transport: Transport.GRPC,
  options: {
    package: 'user',
    protoPath: join(__dirname, '..', '..', '..', 'proto', 'user.proto'),
    url: '0.0.0.0:50053',
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
};
