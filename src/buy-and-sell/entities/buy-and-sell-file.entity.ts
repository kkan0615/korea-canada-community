import { Entity, ManyToOne } from 'typeorm';
import { DefaultFileEntity } from '@/types/systems/databases/file';
import { BuyAndSell } from '@/buy-and-sell/entities/buy-and-sell.entity';

@Entity('buy_and_sell_file')
export class BuyAndSellFile extends DefaultFileEntity {
  /** Relations **/

  @ManyToOne(() => BuyAndSell, (object) => object.FileList)
  BuyAndSell: BuyAndSell;
}
