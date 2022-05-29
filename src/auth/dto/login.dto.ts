import { IsEmail, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { UserProvider } from '@/users/types';

export class LoginAuthDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsOptional()
  @IsEnum(UserProvider)
  provider?: UserProvider;
}
