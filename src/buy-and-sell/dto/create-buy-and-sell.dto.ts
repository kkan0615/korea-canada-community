import { IsEnum, IsInt, IsNotEmpty, Min } from 'class-validator';
import { City } from '@/types/models/places/city';

export class CreateBuyAndSellDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  @Min(0)
  price: number;

  @IsNotEmpty()
  @IsEnum(City)
  city: City;

  @IsNotEmpty()
  @IsInt()
  authorId: number;
}
