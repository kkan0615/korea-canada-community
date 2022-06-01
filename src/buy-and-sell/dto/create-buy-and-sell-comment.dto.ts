import { IsInt, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateBuyAndSellCommentDto {
  @IsNotEmpty()
  content: string;

  @IsNotEmpty()
  @IsInt()
  buyAndSellId: number;

  @IsNotEmpty()
  @IsInt()
  userId: number;

  @IsOptional()
  @IsInt()
  parentId?: number;
}
