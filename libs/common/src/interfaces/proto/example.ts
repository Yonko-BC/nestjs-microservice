// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.2.4
//   protoc               v5.28.2
// source: proto/example.proto

/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "examplePackage";

export interface MessageRequest {
  message: string;
}

export interface MessageResponse {
  message: string;
}

export const EXAMPLE_PACKAGE_PACKAGE_NAME = "examplePackage";

export interface ExampleServiceClient {
  messageToMessage(request: MessageRequest): Observable<MessageResponse>;

  messageToStream(request: MessageRequest): Observable<MessageResponse>;

  streamToMessage(request: Observable<MessageRequest>): Observable<MessageResponse>;
}

export interface ExampleServiceController {
  messageToMessage(request: MessageRequest): Promise<MessageResponse> | Observable<MessageResponse> | MessageResponse;

  messageToStream(request: MessageRequest): Observable<MessageResponse>;

  streamToMessage(
    request: Observable<MessageRequest>,
  ): Promise<MessageResponse> | Observable<MessageResponse> | MessageResponse;
}

export function ExampleServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["messageToMessage", "messageToStream"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("ExampleService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = ["streamToMessage"];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("ExampleService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const EXAMPLE_SERVICE_NAME = "ExampleService";