import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { ORDER_SERVICE_NAME } from '@app/common/interfaces/proto/order';

@Controller()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @GrpcMethod(ORDER_SERVICE_NAME, 'CreateOrder')
  async createOrder(data: CreateOrderDto): Promise<Order> {
    return this.orderService.create(data);
  }

  @GrpcMethod(ORDER_SERVICE_NAME, 'GetOrders')
  async getOrders(): Promise<{ orders: Order[] }> {
    const orders = await this.orderService.findAll();
    return { orders };
  }

  @GrpcMethod(ORDER_SERVICE_NAME, 'GetOrder')
  async getOrder(data: { id: number }): Promise<Order> {
    return this.orderService.findOne(data.id);
  }

  @GrpcMethod(ORDER_SERVICE_NAME, 'UpdateOrder')
  async updateOrder(data: UpdateOrderDto): Promise<Order> {
    return this.orderService.update(data.id, data);
  }

  @GrpcMethod(ORDER_SERVICE_NAME, 'DeleteOrder')
  async deleteOrder(data: { id: number }): Promise<void> {
    await this.orderService.remove(data.id);
  }
}
