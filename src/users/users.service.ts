import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@/users/entities/user.entity';
import { InsertedResponse } from '@/types/responses/insert';
import { DeletedResponse } from '@/types/responses/delete';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
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

  findAll() {
    return this.usersRepository.findAndCount();
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
