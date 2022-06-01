import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateBuyAndSellDto } from './dto/create-buy-and-sell.dto';
import { UpdateBuyAndSellDto } from './dto/update-buy-and-sell.dto';
import { BuyAndSell } from '@/buy-and-sell/entities/buy-and-sell.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FindAllBuyAndSellDto } from '@/buy-and-sell/dto/find-all-buy-and-sell.dto';
import { User } from '@/users/entities/user.entity';
import { InsertedResponse } from '@/types/systems/responses/insert';

@Injectable()
export class BuyAndSellService {
  private readonly logger = new Logger(BuyAndSellService.name);

  constructor(
    @InjectRepository(BuyAndSell)
    private buyAndSellRepository: Repository<BuyAndSell>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createBuyAndSellDto: CreateBuyAndSellDto) {
    try {
      const author = await this.usersRepository.findOne({
        where: {
          id: createBuyAndSellDto.authorId,
        },
      });

      if (!author) {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: 'Fail to find user',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const inserted = await this.buyAndSellRepository.save({
        ...createBuyAndSellDto,
        Author: author,
      });

      const resData: InsertedResponse = {
        insertedId: inserted.id,
      };

      return resData;
    } catch (e) {
      this.logger.error(e.message);
      throw e;
    }
  }

  async findAll(findAllBuyAndSellDto: FindAllBuyAndSellDto) {
    try {
      return await this.buyAndSellRepository.findAndCount({
        take: findAllBuyAndSellDto.take,
        skip: findAllBuyAndSellDto.skip,
        relations: ['Author'],
      });
    } catch (e) {
      this.logger.error(e.message);
      throw e;
    }
  }

  async findOne(id: number) {
    try {
      return await this.buyAndSellRepository.findOne({
        where: {
          id,
        },
        relations: ['Author'],
      });
    } catch (e) {
      this.logger.error(e.message);
      throw e;
    }
  }

  update(id: number, updateBuyAndSellDto: UpdateBuyAndSellDto) {
    return `This action updates a #${id} buyAndSell`;
  }

  remove(id: number) {
    return `This action removes a #${id} buyAndSell`;
  }
}
