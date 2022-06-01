import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateBuyAndSellDto } from './dto/create-buy-and-sell.dto';
import { UpdateBuyAndSellDto } from './dto/update-buy-and-sell.dto';
import { BuyAndSell } from '@/buy-and-sell/entities/buy-and-sell.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FindAllBuyAndSellDto } from '@/buy-and-sell/dto/find-all-buy-and-sell.dto';
import { User } from '@/users/entities/user.entity';
import { InsertedResponse } from '@/types/systems/responses/insert';
import { CreateBuyAndSellCommentDto } from '@/buy-and-sell/dto/create-buy-and-sell-comment.dto';
import { BuyAndSellComment } from '@/buy-and-sell/entities/buy_and_sell_comment.entity';
import { FindAllBuyAndSellCommentDto } from '@/buy-and-sell/dto/find-all-buy-and-sell-comment.dto';
import { UpdateBuyAndSellCommentDto } from '@/buy-and-sell/dto/update-buy-and-sell-comment-dto';
import { UpdatedResponse } from '@/types/systems/responses/update';

@Injectable()
export class BuyAndSellService {
  private readonly logger = new Logger(BuyAndSellService.name);

  constructor(
    @InjectRepository(BuyAndSell)
    private buyAndSellRepository: Repository<BuyAndSell>,
    @InjectRepository(BuyAndSellComment)
    private buyAndSellCommentRepository: Repository<BuyAndSellComment>,
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

  async update(id: number, updateBuyAndSellDto: UpdateBuyAndSellDto) {
    try {
      const updated = await this.buyAndSellRepository.update(
        id,
        updateBuyAndSellDto,
      );

      const resData: UpdatedResponse = {
        updatedCount: updated.affected || 0,
      };
      return resData;
    } catch (e) {
      this.logger.error(e.message);
      throw e;
    }
  }

  remove(id: number) {
    return `This action removes a #${id} buyAndSell`;
  }

  /** Comment service **/

  async createComment(createBuyAndSellCommentDto: CreateBuyAndSellCommentDto) {
    try {
      const user = await this.usersRepository.findOne({
        where: {
          id: createBuyAndSellCommentDto.userId,
        },
      });
      if (!user) {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: 'Fail to find user',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const buyAndSell = await this.buyAndSellRepository.findOne({
        where: {
          id: createBuyAndSellCommentDto.buyAndSellId,
        },
      });
      if (!buyAndSell) {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: 'Fail to find user',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const buyAndSellParentComment = createBuyAndSellCommentDto.parentId
        ? await this.buyAndSellCommentRepository.findOne({
            where: {
              id: createBuyAndSellCommentDto.parentId,
            },
          })
        : undefined;

      const inserted = await this.buyAndSellCommentRepository.save({
        ...createBuyAndSellCommentDto,
        User: user,
        BuyAndSell: buyAndSell,
        Parent: buyAndSellParentComment,
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

  async findAllComments(
    buyAndSellId: number,
    findAllBuyAndSellCommentDto: FindAllBuyAndSellCommentDto,
  ) {
    try {
      return await this.buyAndSellCommentRepository.findAndCount({
        where: {
          BuyAndSell: {
            id: buyAndSellId,
          },
        },
        take: findAllBuyAndSellCommentDto.take,
        skip: findAllBuyAndSellCommentDto.skip,
        relations: ['User', 'Parent'],
        select: {
          Parent: {
            id: true,
          },
        },
      });
    } catch (e) {
      this.logger.error(e.message);
      throw e;
    }
  }

  async updateComment(
    id: number,
    updateBuyAndSellCommentDto: UpdateBuyAndSellCommentDto,
  ) {
    try {
      const updated = await this.buyAndSellCommentRepository.update(
        id,
        updateBuyAndSellCommentDto,
      );

      const resData: UpdatedResponse = {
        updatedCount: updated.affected || 0,
      };
      return resData;
    } catch (e) {
      this.logger.error(e.message);
      throw e;
    }
  }

  removeComment(id: number) {
    return `This action removes a #${id} buyAndSellComment`;
  }
}
