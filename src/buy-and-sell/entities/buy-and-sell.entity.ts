import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { DefaultEntity } from '@/types/systems/databases';
import { City } from '@/types/models/places/city';
import { User } from '@/users/entities/user.entity';
import { BuyAndSellComment } from '@/buy-and-sell/entities/buy_and_sell_comment.entity';

@Entity('buy_and_sell')
export class BuyAndSell extends DefaultEntity {
  @Column({
    width: 100,
  })
  title: string;

  @Column({
    width: 100,
    default: 0,
  })
  price: number;

  @Column({
    enum: City,
    width: 30,
  })
  city: City;

  @ManyToOne(() => User, (object) => object.BuyAndSellList)
  Author: User;

  // Comment list
  @OneToMany(() => BuyAndSellComment, (object) => object.BuyAndSell)
  CommentList: BuyAndSellComment[];
}
