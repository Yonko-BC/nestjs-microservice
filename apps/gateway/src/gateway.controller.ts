import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Inject,
  OnModuleInit,
  HttpException,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { SERVICES } from 'libs/common/shared/constants';
import { Observable, Subject } from 'rxjs';
import {
  User,
  USER_SERVICE_NAME,
  UserServiceClient,
} from '@app/common/interfaces/proto/user';
import {
  Order,
  ORDER_SERVICE_NAME,
  OrderServiceClient,
} from '@app/common/interfaces/proto/order';
import { UserOrders } from '@app/common/interfaces/proto/user';
import {
  DocumentServiceClient,
  DOCUMENT_SERVICE_NAME,
  DocumentChunk,
  UploadResponse,
} from '@app/common/interfaces/proto/document';
import { Readable } from 'stream';
import { FileInterceptor } from '@nestjs/platform-express';
import { lastValueFrom } from 'rxjs';

@Controller()
export class GatewayController implements OnModuleInit {
  private userService: UserServiceClient;
  private orderService: OrderServiceClient;
  private documentService: DocumentServiceClient;

  constructor(
    @Inject(SERVICES.USER) private userClient: ClientGrpc,
    @Inject(SERVICES.ORDER) private orderClient: ClientGrpc,
    @Inject(SERVICES.DOCUMENT) private documentClient: ClientGrpc,
  ) {}

  onModuleInit() {
    this.userService =
      this.userClient.getService<UserServiceClient>(USER_SERVICE_NAME);
    this.orderService =
      this.orderClient.getService<OrderServiceClient>(ORDER_SERVICE_NAME);
    this.documentService =
      this.documentClient.getService<DocumentServiceClient>(
        DOCUMENT_SERVICE_NAME,
      );
  }

  @Get('users')
  getUsers(): Observable<{ users: User[] }> {
    return this.userService.findAll({});
  }

  @Get('users/:id')
  getUser(@Param('id') id: string): Observable<User> {
    return this.userService.findOne({ id: parseInt(id, 10) });
  }

  @Post('users')
  createUser(@Body() user: User): Observable<User> {
    return this.userService.create(user);
  }

  @Get('orders')
  getOrders(): Observable<{ orders: Order[] }> {
    return this.orderService.getOrders({});
  }

  @Get('orders/:id')
  getOrder(@Param('id') id: string): Observable<Order> {
    return this.orderService.getOrder({ id: parseInt(id, 10) });
  }

  @Post('orders')
  createOrder(@Body() order: Order): Observable<Order> {
    return this.orderService.createOrder(order);
  }

  @Get('users/:id/orders')
  getUserOrders(@Param('id') id: string): Observable<UserOrders> {
    return this.userService.getUserOrders({ id: parseInt(id, 10) });
  }

  @Post('documents/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadDocument(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<UploadResponse> {
    try {
      const chunks = new Subject<DocumentChunk>();

      const filename = file.originalname || 'unknown';
      const contentType = file.mimetype || 'application/octet-stream';
      const totalSize = file.size;

      console.log(`Uploading file: ${filename}, size: ${totalSize} bytes`);

      let chunkNumber = 0;
      const chunkSize = 64 * 1024; // 64KB chunks

      // Create an array to store all chunks for logging
      const allChunks: DocumentChunk[] = [];

      for (let i = 0; i < file.buffer.length; i += chunkSize) {
        chunkNumber++;
        const chunk = file.buffer.subarray(i, i + chunkSize);
        const isLastChunk = i + chunkSize >= file.buffer.length;

        const documentChunk: DocumentChunk = {
          content: chunk,
          filename,
          contentType,
          chunkNumber,
          isLastChunk,
          size: chunk.length,
        };

        allChunks.push(documentChunk);
        chunks.next(documentChunk);

        console.log(
          `Sending chunk ${chunkNumber}, size: ${chunk.length} bytes`,
        );
      }

      chunks.complete();

      console.log(`Total chunks created: ${allChunks.length}`);

      // Log the first and last chunk for debugging
      if (allChunks.length > 0) {
        console.log('First chunk:', allChunks[0]);
        console.log('Last chunk:', allChunks[allChunks.length - 1]);
      }

      const response = await lastValueFrom(
        this.documentService.uploadDocument(chunks),
      );
      console.log('Upload response:', response);
      return response;
    } catch (error) {
      console.error('Upload error:', error);
      throw new HttpException(
        `Upload failed: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('documents/:id')
  async downloadDocument(@Param('id') id: string): Promise<Readable> {
    const stream = this.documentService.downloadDocument({ documentId: id });
    const readable = new Readable({
      read() {},
    });

    stream.subscribe({
      next: (chunk) => {
        readable.push(chunk.content);
        if (chunk.isLastChunk) {
          readable.push(null);
        }
      },
      error: (err) => {
        throw new HttpException(
          'Download failed',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      },
    });

    return readable;
  }

  @Post('documents/sync')
  async syncDocument(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Readable> {
    const incomingChunks = new Subject<DocumentChunk>();
    const outgoingStream = this.documentService.syncDocument(incomingChunks);

    // Process the file in chunks
    const chunkSize = 64 * 1024; // 64KB chunks
    for (let i = 0; i < file.buffer.length; i += chunkSize) {
      const chunk = file.buffer.slice(i, i + chunkSize);
      incomingChunks.next({
        content: chunk,
        filename: file.originalname || 'unknown',
        contentType: file.mimetype || 'application/octet-stream',
        chunkNumber: Math.floor(i / chunkSize) + 1,
        isLastChunk: i + chunkSize >= file.buffer.length,
        size: chunk.length,
      });
    }
    incomingChunks.complete();

    const readable = new Readable({
      read() {},
    });

    outgoingStream.subscribe({
      next: (chunk) => {
        readable.push(chunk.content);
        if (chunk.isLastChunk) {
          readable.push(null);
        }
      },
      error: (err) => {
        throw new HttpException(
          'Sync failed',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      },
    });

    return readable;
  }
}
