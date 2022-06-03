import { Module } from '@nestjs/common';
import { BuyAndSellService } from './buy-and-sell.service';
import { BuyAndSellController } from './buy-and-sell.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BuyAndSell } from '@/buy-and-sell/entities/buy-and-sell.entity';
import { UsersModule } from '@/users/users.module';
import { BuyAndSellComment } from '@/buy-and-sell/entities//buy-and-sell-comment.entity';
import { AuthModule } from '@/auth/auth.module';
import { BuyAndSellLike } from '@/buy-and-sell/entities/buy-and-sell-like.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([BuyAndSell, BuyAndSellComment, BuyAndSellLike]),
    UsersModule,
    AuthModule,
  ],
  exports: [TypeOrmModule, BuyAndSellService],
  controllers: [BuyAndSellController],
  providers: [BuyAndSellService],
})
export class BuyAndSellModule {}
