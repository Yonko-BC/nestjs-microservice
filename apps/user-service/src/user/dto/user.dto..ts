import { User } from '@app/common/interfaces/proto/user';
import { IsEmail, IsNumber, IsString } from 'class-validator';

export class CreateUserDto implements Partial<User> {
  @IsNumber()
  id: number;

  @IsString()
  name: string;

  @IsEmail()
  email: string;
}
