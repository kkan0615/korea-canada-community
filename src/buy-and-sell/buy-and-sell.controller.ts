import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { BuyAndSellService } from './buy-and-sell.service';
import { CreateBuyAndSellDto } from './dto/create-buy-and-sell.dto';
import { UpdateBuyAndSellDto } from './dto/update-buy-and-sell.dto';
import { FindAllBuyAndSellDto } from '@/buy-and-sell/dto/find-all-buy-and-sell.dto';

@Controller('buy-and-sell')
export class BuyAndSellController {
  constructor(private readonly buyAndSellService: BuyAndSellService) {}

  @Post()
  async create(@Body() createBuyAndSellDto: CreateBuyAndSellDto) {
    return await this.buyAndSellService.create(createBuyAndSellDto);
  }

  @Get()
  async findAll(@Query() query: FindAllBuyAndSellDto) {
    return await this.buyAndSellService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.buyAndSellService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBuyAndSellDto: UpdateBuyAndSellDto,
  ) {
    return this.buyAndSellService.update(+id, updateBuyAndSellDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.buyAndSellService.remove(+id);
  }
}
