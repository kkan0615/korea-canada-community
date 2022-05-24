import { IsEmail, Length } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @Length(0, 50)
  nickname: string;
}
