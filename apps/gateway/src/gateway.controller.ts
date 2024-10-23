import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Inject,
  OnModuleInit,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { SERVICES } from 'libs/common/shared/constants';
import { Observable } from 'rxjs';
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
import { ExampleServiceClient } from '@app/common/interfaces/proto/example';

@Controller()
export class GatewayController implements OnModuleInit {
  private userService: UserServiceClient;
  private orderService: OrderServiceClient;
  private exampleService: ExampleServiceClient;

  constructor(
    @Inject(SERVICES.USER) private userClient: ClientGrpc,
    @Inject(SERVICES.ORDER) private orderClient: ClientGrpc,
    @Inject('example') private exampleClient: ClientGrpc,
  ) {}

  onModuleInit() {
    this.userService =
      this.userClient.getService<UserServiceClient>(USER_SERVICE_NAME);
    this.orderService =
      this.orderClient.getService<OrderServiceClient>(ORDER_SERVICE_NAME);
    this.exampleService =
      this.exampleClient.getService<ExampleServiceClient>('ExampleService');
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

  @Get('example')
  example(): Observable<any> {
    return this.exampleService.messageToMessage({ message: 'ok merci' });
  }
}
