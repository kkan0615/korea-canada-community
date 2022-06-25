import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { BuyAndSellService } from './buy-and-sell.service';
import { CreateBuyAndSellDto } from './dto/create-buy-and-sell.dto';
import { UpdateBuyAndSellDto } from './dto/update-buy-and-sell.dto';
import { FindAllBuyAndSellDto } from '@/buy-and-sell/dto/find-all-buy-and-sell.dto';
import { FindAllBuyAndSellCommentDto } from '@/buy-and-sell/dto/find-all-buy-and-sell-comment.dto';
import { CreateBuyAndSellCommentDto } from '@/buy-and-sell/dto/create-buy-and-sell-comment.dto';
import { JwtAuthGuard } from '@/auth/guards/jwt.guard';

@Controller('buy-and-sell')
export class BuyAndSellController {
  constructor(private readonly buyAndSellService: BuyAndSellService) {}

  @Post()
  async create(@Body() createBuyAndSellDto: CreateBuyAndSellDto) {
    return await this.buyAndSellService.create(createBuyAndSellDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@Query() query: FindAllBuyAndSellDto, @Request() req) {
    if (query.cityList) {
      query.cityList = JSON.parse(query.cityList.toString());
    }

    return await this.buyAndSellService.findAll(query, req.user);
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

  @Post('comment')
  async createComment(
    @Body() createBuyAndSellCommentDto: CreateBuyAndSellCommentDto,
  ) {
    return await this.buyAndSellService.createComment(
      createBuyAndSellCommentDto,
    );
  }

  @Get(':id/comments')
  findAllComments(
    @Param('id') id: string,
    @Query() query: FindAllBuyAndSellCommentDto,
  ) {
    return this.buyAndSellService.findAllComments(+id, query);
  }

  @Delete('comment/:id')
  async removeComment(@Param('id') id: string) {
    return await this.buyAndSellService.removeComment(+id);
  }

  @Post(':id/my/like')
  @UseGuards(JwtAuthGuard)
  updateLike(@Param('id') id: string, @Request() req) {
    return this.buyAndSellService.createLike(+id, req.user.id);
  }

  @Delete(':id/my/like')
  @UseGuards(JwtAuthGuard)
  removeLike(@Param('id') id: string, @Request() req) {
    return this.buyAndSellService.removeLike(+id, req.user.id);
  }
}
