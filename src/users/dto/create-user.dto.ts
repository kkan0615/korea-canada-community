import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  Length,
} from 'class-validator';
import { UserProvider, UserRole } from '@/users/types';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Length(0, 50)
  @IsNotEmpty()
  nickname: string;

  @IsNotEmpty()
  password: string;

  @IsOptional()
  @IsEnum(UserProvider)
  provider?: UserProvider;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional()
  tel?: string;
}
