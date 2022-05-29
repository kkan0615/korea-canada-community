import { IsInt, IsOptional } from 'class-validator';
import { FindAllDtoAttribute } from '@/types/dtos';

export class FindAllUserDto extends FindAllDtoAttribute {
  @IsOptional()
  @IsInt()
  id?: number | number[];
}
