import { PartialType } from '@nestjs/mapped-types';
import { CreateBuyAndSellDto } from './create-buy-and-sell.dto';

export class UpdateBuyAndSellDto extends PartialType(CreateBuyAndSellDto) {}
