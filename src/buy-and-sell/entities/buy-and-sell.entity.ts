import { Column, Entity, ManyToMany, ManyToOne, OneToMany } from 'typeorm';
import { DefaultEntity } from '@/types/systems/databases';
import { City } from '@/types/models/places/city';
import { User } from '@/users/entities/user.entity';
import { BuyAndSellComment } from '@/buy-and-sell/entities/buy-and-sell-comment.entity';
import { BuyAndSellFile } from '@/buy-and-sell/entities/buy-and-sell-file.entity';
import { JoinTable } from 'typeorm/browser';
import { BuyAndSellLike } from '@/buy-and-sell/entities/buy-and-sell-like.entity';

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

  /** Relations **/

  @ManyToOne(() => User, (object) => object.BuyAndSellList)
  Author: User;

  // Comment list
  @OneToMany(() => BuyAndSellComment, (object) => object.BuyAndSell)
  CommentList: BuyAndSellComment[];

  // File list
  @OneToMany(() => BuyAndSellFile, (object) => object.BuyAndSell)
  FileList: BuyAndSellFile[];

  // Likes
  @OneToMany(() => BuyAndSellLike, (object) => object.BuyAndSell)
  Likes: BuyAndSellLike[];
}
