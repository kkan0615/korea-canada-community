import { responseAttribute } from '@/types/systems/responses/index';

export interface UpdatedResponse extends responseAttribute {
  updatedCount: number;
}
