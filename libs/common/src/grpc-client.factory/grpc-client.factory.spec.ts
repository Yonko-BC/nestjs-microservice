import { GrpcClientFactory } from './grpc-client.factory';

describe('GrpcClientFactory', () => {
  it('should be defined', () => {
    expect(new GrpcClientFactory()).toBeDefined();
  });
});
