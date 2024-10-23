import { Injectable } from '@nestjs/common';
import { Order } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrderService {
  private orders: Order[] = [
    {
      id: 1,
      userId: 1,
      productId: 1,
      quantity: 1,
      totalPrice: 100,
      status: 'PENDING',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];
  constructor() {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const order = {
      id: this.orders.length + 1,
      ...createOrderDto,
      status: 'PENDING',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.orders.push(order);
    return order;
  }

  async findAll(): Promise<Order[]> {
    return this.orders;
  }

  async findOne(id: number): Promise<Order> {
    return this.orders.find((order) => order.id === id);
  }

  async update(id: number, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = this.orders.find((order) => order.id === id);
    if (!order) {
      throw new Error('Order not found');
    }
    order.status = updateOrderDto.status;
    order.updatedAt = new Date();
    return order;
  }

  async remove(id: number): Promise<void> {
    this.orders = this.orders.filter((order) => order.id !== id);
  }
}
