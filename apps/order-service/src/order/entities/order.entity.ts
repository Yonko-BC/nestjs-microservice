import { IsNumber, IsString, IsDate } from 'class-validator';

export class Order {
  @IsNumber()
  id: number;

  @IsNumber()
  userId: number;

  @IsNumber()
  productId: number;

  @IsNumber()
  quantity: number;

  @IsNumber()
  totalPrice: number;

  @IsString()
  status: string;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;
}
