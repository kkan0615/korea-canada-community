import { FindAllDtoAttribute } from '@/types/systems/dtos';
import { IsOptional } from 'class-validator';
import { City } from '@/types/models/places/city';

export class FindAllBuyAndSellDto extends FindAllDtoAttribute {
  @IsOptional()
  cityList?: City[];
}
