import { Column } from 'typeorm';
import { DefaultEntity } from '@/types/systems/databases/index';

export class DefaultFileEntity extends DefaultEntity {
  @Column({
    width: 100,
  })
  name: string;

  @Column({
    width: 100,
  })
  link: string;

  @Column({
    width: 100,
  })
  size: number;

  @Column({
    width: 100,
  })
  type: string;
}
