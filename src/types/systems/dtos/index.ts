import { IsInt, IsOptional, Min } from 'class-validator';

/**
 * FindAll dto
 */
export class FindAllDtoAttribute {
  @IsOptional()
  @IsInt()
  @Min(0)
  skip?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  take?: number;
}
