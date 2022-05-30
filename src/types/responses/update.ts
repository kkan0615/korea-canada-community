import { responseAttribute } from '@/types/responses/index';

export interface UpdatedResponse extends responseAttribute {
  updatedCount: number;
}
