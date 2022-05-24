import { Column, Entity } from 'typeorm';
import { defaultEntity } from '@/types/databases';

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

  @Column({ default: true })
  isActive: boolean;
}
