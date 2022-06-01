import { Test, TestingModule } from '@nestjs/testing';
import { BuyAndSellService } from './buy-and-sell.service';

describe('BuyAndSellService', () => {
  let service: BuyAndSellService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BuyAndSellService],
    }).compile();

    service = module.get<BuyAndSellService>(BuyAndSellService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
