import { Column, Entity } from 'typeorm';
import { defaultEntity } from '@/types/databases';
import { UserProvider, UserRole } from '@/users/types';

@Entity('users')
export class User extends defaultEntity {
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

  @Column()
  password: string;

  @Column({
    enum: UserProvider,
    width: 20,
    default: UserProvider.local,
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
}
