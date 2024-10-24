import { GrpcOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

export const grpcConfig: GrpcOptions = {
  transport: Transport.GRPC,
  options: {
    package: 'document',
    protoPath: join(__dirname, '..', '..', '..', 'proto', 'document.proto'),
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
};
