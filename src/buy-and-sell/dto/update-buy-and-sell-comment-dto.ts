import { PartialType } from '@nestjs/mapped-types';
import { CreateBuyAndSellCommentDto } from '@/buy-and-sell/dto/create-buy-and-sell-comment.dto';

export class UpdateBuyAndSellCommentDto extends PartialType(
  CreateBuyAndSellCommentDto,
) {}
