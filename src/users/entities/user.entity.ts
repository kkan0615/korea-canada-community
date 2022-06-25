import { Column, Entity, FindOptionsSelect, OneToMany } from 'typeorm';
import { DefaultEntity } from '@/types/systems/databases';
import { UserProvider, UserRole } from '@/users/types';
import { BuyAndSell } from '@/buy-and-sell/entities/buy-and-sell.entity';
import { BuyAndSellComment } from '@/buy-and-sell/entities//buy-and-sell-comment.entity';
import { BuyAndSellLike } from '@/buy-and-sell/entities/buy-and-sell-like.entity';

@Entity('users')
export class User extends DefaultEntity {
  @Column({
    width: 50,
    unique: true,
  })
  email: string;

  @Column({
    width: 50,
    unique: true,
  })
  nickname: string;

  @Column({
    select: false,
  })
  password: string;

  @Column({
    enum: UserProvider,
    width: 20,
    default: UserProvider.Local,
  })
  provider: UserProvider;

  @Column({
    width: 20,
    default: UserRole.user,
  })
  role: UserRole;

  @Column({
    width: 50,
    nullable: true,
  })
  tel?: string;

  @Column({ default: false })
  isEmailConfirmed: boolean;

  @Column({ default: false })
  isTelConfirmed: boolean;

  @Column({ default: true })
  isActive: boolean;

  @Column({
    nullable: true,
    select: false,
  })
  refreshToken?: string;

  /** Relations **/

  /* Buy and sell */
  @OneToMany(() => BuyAndSell, (object) => object.Author)
  BuyAndSellList: BuyAndSell[];

  @OneToMany(() => BuyAndSellComment, (object) => object.User)
  BuyAndSellCommentList: BuyAndSellComment[];

  // Buy and sell likes
  @OneToMany(() => BuyAndSellLike, (object) => object.User)
  BuyAndSellLikes: BuyAndSellLike[];
}

export const allowedUserRelation: FindOptionsSelect<User> = {
  id: true,
  nickname: true,
  email: true,
  isTelConfirmed: true,
  isEmailConfirmed: true,
  tel: true,
  role: true,
};
