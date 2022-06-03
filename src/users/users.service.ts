import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '@/users/entities/user.entity';
import { InsertedResponse } from '@/types/systems/responses/insert';
import { DeletedResponse } from '@/types/systems/responses/delete';
import { UserProvider } from '@/users/types';
import { FindAllUserDto } from '@/users/dto/find-all-user.dto';
import { UpdatedResponse } from '@/types/systems/responses/update';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      /* Search the user by email. */
      const exUser = await this.usersRepository.findOne({
        where: {
          email: createUserDto.email,
          provider: createUserDto.provider || UserProvider.Local,
        },
      });
      /* If user is already existed */
      if (exUser) {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: 'User is already existed',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      /* Save the user data */
      // Bcrypt password
      createUserDto.password = await bcrypt.hash(
        createUserDto.password,
        Number(process.env.BCRYPT_SALT),
      );
      const inserted = await this.usersRepository.save(createUserDto);

      const resData: InsertedResponse = {
        insertedId: inserted.id,
      };
      return resData;
    } catch (e) {
      this.logger.error(e.message);
      throw e;
    }
  }

  async findAll(query: FindAllUserDto) {
    try {
      const userList = await this.usersRepository.findAndCount({
        take: query.take ? parseInt(query.take) : undefined,
        skip: query.skip ? parseInt(query.skip) : undefined,
        where: {
          isActive: true,
        },
      });

      /**
       * Exclude some fields
       */
      userList[0] = userList[0].map((data) => {
        delete data.password;

        return data;
      });

      return userList;
    } catch (e) {
      this.logger.error(e.message);
      throw e;
    }
  }

  async findOne(id: number) {
    try {
      const user = await this.usersRepository.findOne({
        where: {
          id,
        },
      });

      return user;
    } catch (e) {
      this.logger.error(e.message);
      throw e;
    }
  }

  async findOneDetail(id: number) {
    try {
      const user = await this.usersRepository.findOne({
        where: {
          id,
        },
        select: {
          id: true,
          email: true,
          password: true,
          provider: true,
          tel: true,
          role: true,
          nickname: true,
          isEmailConfirmed: true,
          isTelConfirmed: true,
          isActive: true,
          refreshToken: true,
          createdAt: true,
          updatedAt: true,
          deletedAt: true,
          BuyAndSellList: true,
        },
      });

      return user;
    } catch (e) {
      this.logger.error(e.message);
      throw e;
    }
  }

  async findByEmailAndProvider(email: string, provider = UserProvider.Local) {
    try {
      return await this.usersRepository.findOne({
        where: {
          email,
          provider,
        },
        select: {
          id: true,
          email: true,
          password: true,
          role: true,
          provider: true,
          refreshToken: true,
        },
      });
    } catch (e) {
      this.logger.error(e.message);
      throw e;
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      const updated = await this.usersRepository.update(id, updateUserDto);

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
      /* Soft delete the user data */
      await this.usersRepository.softDelete(id);

      const resData: DeletedResponse = {
        count: 1,
      };
      return resData;
    } catch (e) {
      this.logger.error(e.message);
      throw e;
    }
  }
}
