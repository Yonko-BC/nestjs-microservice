import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import {
  User,
  UserById,
  Users,
  Empty,
} from '@app/common/interfaces/proto/user';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @GrpcMethod('UserService', 'FindOne')
  async findOne(data: UserById): Promise<User> {
    return this.userService.findOne(data);
  }

  @GrpcMethod('UserService', 'FindAll')
  async findAll(data: Empty): Promise<Users> {
    return this.userService.findAll();
  }

  @GrpcMethod('UserService', 'Create')
  async create(user: User): Promise<User> {
    return this.userService.create(user);
  }

  @GrpcMethod('UserService', 'GetUserOrders')
  async getUserOrders(data: UserById): Promise<{ orders: any[] }> {
    return this.userService.getUserOrders(data);
  }
}
