import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '@/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '@/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtTokenService: JwtService,
  ) {}

  async validateUser(payload: Pick<User, 'email' | 'password' | 'provider'>) {
    try {
      const user = await this.usersService.findByEmailAndProvider(
        payload.email,
        payload.provider,
      );

      // @TODO: Add bcrypt
      const isMatch = user && user.password === payload.password;
      if (isMatch) {
        delete user.password; // Remove password

        return user;
      }

      throw new UnauthorizedException('userId and password are not match');
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async login(payload: Pick<User, 'email' | 'password'>) {
    try {
      const user = await this.usersService.findByEmailAndProvider(
        payload.email,
      );

      const isMatch =
        user && (await bcrypt.compare(payload.password, user.password));
      if (isMatch) {
        delete user.password; // Remove password

        return {
          access_token: this.jwtTokenService.sign({
            id: user.id,
            email: user.email,
            provider: user.provider,
          }),
        };
      }

      throw new UnauthorizedException('userId and password are not match');
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async findProfile(payload: Pick<User, 'id' | 'email' | 'provider'>) {
    try {
      const user = await this.usersService.findOne(payload.id);

      if (user) {
        delete user.password;
      }

      return user;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
}
