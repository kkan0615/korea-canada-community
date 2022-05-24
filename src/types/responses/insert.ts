import { responseAttribute } from '@/types/responses/index';

export interface InsertedResponse extends responseAttribute {
  insertedId?: number;
}
