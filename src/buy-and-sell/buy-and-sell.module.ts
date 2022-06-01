import { Module } from '@nestjs/common';
import { BuyAndSellService } from './buy-and-sell.service';
import { BuyAndSellController } from './buy-and-sell.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BuyAndSell } from '@/buy-and-sell/entities/buy-and-sell.entity';
import { UsersModule } from '@/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([BuyAndSell]), UsersModule],
  exports: [TypeOrmModule, BuyAndSellService],
  controllers: [BuyAndSellController],
  providers: [BuyAndSellService],
})
export class BuyAndSellModule {}
