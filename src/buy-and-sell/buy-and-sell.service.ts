import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateBuyAndSellDto } from './dto/create-buy-and-sell.dto';
import { UpdateBuyAndSellDto } from './dto/update-buy-and-sell.dto';
import { BuyAndSell } from '@/buy-and-sell/entities/buy-and-sell.entity';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FindAllBuyAndSellDto } from '@/buy-and-sell/dto/find-all-buy-and-sell.dto';
import { allowedUserRelation, User } from '@/users/entities/user.entity';
import { InsertedResponse } from '@/types/systems/responses/insert';
import { CreateBuyAndSellCommentDto } from '@/buy-and-sell/dto/create-buy-and-sell-comment.dto';
import { BuyAndSellComment } from '@/buy-and-sell/entities//buy-and-sell-comment.entity';
import { FindAllBuyAndSellCommentDto } from '@/buy-and-sell/dto/find-all-buy-and-sell-comment.dto';
import { UpdateBuyAndSellCommentDto } from '@/buy-and-sell/dto/update-buy-and-sell-comment-dto';
import { UpdatedResponse } from '@/types/systems/responses/update';
import { DeletedResponse } from '@/types/systems/responses/delete';
import { BuyAndSellLike } from '@/buy-and-sell/entities/buy-and-sell-like.entity';

@Injectable()
export class BuyAndSellService {
  private readonly logger = new Logger(BuyAndSellService.name);

  constructor(
    @InjectRepository(BuyAndSell)
    private buyAndSellRepository: Repository<BuyAndSell>,
    @InjectRepository(BuyAndSellComment)
    private buyAndSellCommentRepository: Repository<BuyAndSellComment>,
    @InjectRepository(BuyAndSellLike)
    private buyAndSellLikeRepository: Repository<BuyAndSellLike>,
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

  async findAll(query: FindAllBuyAndSellDto, currUser: User | undefined) {
    try {
      return await this.buyAndSellRepository.findAndCount({
        take: query.take ? parseInt(query.take) : undefined,
        skip: query.skip ? parseInt(query.skip) : undefined,
        relations: {
          Author: true,
          Likes: true,
        },
        where: {
          city: query.cityList ? In(query.cityList) : undefined,
          Likes: {
            // id: currUser ? currUser.id : undefined,
          },
        },
        select: {
          Likes: {
            id: true,
          },
        },
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
        select: {
          Author: allowedUserRelation,
        },
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

  async remove(id: number) {
    try {
      await this.buyAndSellRepository.softDelete(id);

      const resData: DeletedResponse = {
        count: 1,
      };
      return resData;
    } catch (e) {
      this.logger.error(e.message);
      throw e;
    }
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
    query: FindAllBuyAndSellCommentDto,
  ) {
    try {
      return await this.buyAndSellCommentRepository.findAndCount({
        where: {
          BuyAndSell: {
            id: buyAndSellId,
          },
        },
        take: query.take ? parseInt(query.take) : undefined,
        skip: query.skip ? parseInt(query.skip) : undefined,
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

  async removeComment(id: number) {
    try {
      await this.buyAndSellCommentRepository.softDelete(id);

      const resData: DeletedResponse = {
        count: 1,
      };
      return resData;
    } catch (e) {
      this.logger.error(e.message);
      throw e;
    }
  }

  /** Like service **/
  async createLike(id: number, userId: number) {
    try {
      const buyAndSell = await this.buyAndSellRepository.findOne({
        where: {
          id,
        },
      });
      if (!buyAndSell) {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: 'Fail to find buy and sell',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const inserted = await this.buyAndSellLikeRepository.save({
        BuyAndSell: buyAndSell,
        User: { id: userId } as User,
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

  async removeLike(id: number, userId: number) {
    try {
      const buyAndSell = await this.buyAndSellRepository.findOne({
        where: {
          id,
        },
      });
      if (!buyAndSell) {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: 'Fail to find buy and sell',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const like = await this.buyAndSellLikeRepository.findOne({
        where: {
          BuyAndSell: { id: buyAndSell.id },
          User: { id: userId },
        },
      });
      if (!like) {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: 'Fail to find buy and sell like',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const deleted = await this.buyAndSellLikeRepository.delete(like.id);

      const resData: DeletedResponse = {
        count: deleted.affected || 0,
      };

      return resData;
    } catch (e) {
      this.logger.error(e.message);
      throw e;
    }
  }
}
