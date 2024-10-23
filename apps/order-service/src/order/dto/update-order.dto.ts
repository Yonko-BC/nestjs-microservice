import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDto } from './create-order.dto';
import { IsNumber, IsString } from 'class-validator';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  @IsNumber()
  id: number;

  @IsString()
  status?: string;

  @IsNumber()
  quantity?: number;

  @IsNumber()
  totalPrice?: number;
}
