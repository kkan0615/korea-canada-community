import { Test, TestingModule } from '@nestjs/testing';
import { BuyAndSellController } from './buy-and-sell.controller';
import { BuyAndSellService } from './buy-and-sell.service';

describe('BuyAndSellController', () => {
  let controller: BuyAndSellController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BuyAndSellController],
      providers: [BuyAndSellService],
    }).compile();

    controller = module.get<BuyAndSellController>(BuyAndSellController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
