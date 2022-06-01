import { IsInt, IsOptional } from 'class-validator';
import { FindAllDtoAttribute } from '@/types/systems/dtos';

export class FindAllUserDto extends FindAllDtoAttribute {
  @IsOptional()
  @IsInt()
  id?: number | number[];
}
