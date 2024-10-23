import {
  Injectable,
  NotFoundException,
  Inject,
  OnModuleInit,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { User, UserById, Users } from '@app/common/interfaces/proto/user';
import { SERVICES } from 'libs/common/shared/constants';
import { lastValueFrom } from 'rxjs';
import {
  ORDER_SERVICE_NAME,
  OrderServiceClient,
} from '@app/common/interfaces/proto/order';

@Injectable()
export class UserService implements OnModuleInit {
  private users: User[] = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
    },
    {
      id: 2,
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
    },
    {
      id: 3,
      name: 'Jim Beam',
      email: 'jim.beam@example.com',
    },
  ];

  private orderService: OrderServiceClient;

  constructor(@Inject(SERVICES.ORDER) private orderClient: ClientGrpc) {}

  onModuleInit() {
    this.orderService =
      this.orderClient.getService<OrderServiceClient>(ORDER_SERVICE_NAME);
  }

  async findOne(data: UserById): Promise<User> {
    const user = this.users.find((u) => u.id === data.id);
    if (!user) {
      throw new NotFoundException(`User with ID ${data.id} not found`);
    }
    return user;
  }

  async findAll(): Promise<Users> {
    return { users: this.users };
  }

  async create(user: User): Promise<User> {
    this.users.push(user);
    return user;
  }

  async getUserOrders(data: UserById): Promise<{ orders: any[] }> {
    const user = await this.findOne(data);
    const orders = await lastValueFrom(this.orderService.getOrders({}));
    const userOrders = orders.orders.filter(
      (order) => order.userId === user.id,
    );
    return { orders: userOrders };
  }
}
