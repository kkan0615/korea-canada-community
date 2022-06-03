import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BuyAndSell } from '@/buy-and-sell/entities/buy-and-sell.entity';
import { User } from '@/users/entities/user.entity';

@Entity('buy_and_sell_like')
export class BuyAndSellLike {
  @PrimaryGeneratedColumn()
  id: number;

  /** Relations **/
  @ManyToOne(() => User, (object) => object.BuyAndSellLikes)
  User: User;

  @ManyToOne(() => BuyAndSell, (object) => object.Likes)
  BuyAndSell: BuyAndSell;
}
