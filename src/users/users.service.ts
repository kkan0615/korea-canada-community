import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@/users/entities/user.entity';
import { InsertedResponse } from '@/types/responses/insert';
import { DeletedResponse } from '@/types/responses/delete';
import { UserProvider } from '@/users/types';
import { FindAllUserDto } from '@/users/dto/findAll-user.dto';

@Injectable()
export class UsersService {
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
          provider: createUserDto.provider || UserProvider.local,
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
      const inserted = await this.usersRepository.save(createUserDto);

      const resData: InsertedResponse = {
        insertedId: inserted.id,
      };
      return resData;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  findAll(query: FindAllUserDto) {
    return this.usersRepository.findAndCount({
      take: query.take,
      skip: query.skip,
      where: {
        isActive: true,
      },
    });
  }

  findOne(id: number) {
    return this.usersRepository.findOne({
      where: {
        id,
      },
    });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
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
      console.error(e);
      throw e;
    }
  }
}
