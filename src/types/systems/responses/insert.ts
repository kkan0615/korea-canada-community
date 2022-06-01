import { responseAttribute } from '@/types/systems/responses/index';

export interface InsertedResponse extends responseAttribute {
  insertedId?: number;
}
