import { Column, Entity, ManyToOne, TreeChildren, TreeParent } from 'typeorm';
import { DefaultEntity } from '@/types/systems/databases';
import { User } from '@/users/entities/user.entity';
import { BuyAndSell } from '@/buy-and-sell/entities/buy-and-sell.entity';

@Entity('buy_and_sell_comment')
export class BuyAndSellComment extends DefaultEntity {
  @Column()
  content: string;

  @TreeParent()
  Parent: BuyAndSellComment;

  @TreeChildren()
  Children: BuyAndSellComment[];

  @ManyToOne(() => BuyAndSell, (object) => object.CommentList)
  BuyAndSell: BuyAndSell;

  @ManyToOne(() => User, (object) => object.BuyAndSellCommentList)
  User: User;
}
