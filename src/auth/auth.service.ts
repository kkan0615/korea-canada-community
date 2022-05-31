import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '@/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '@/users/entities/user.entity';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private jwtTokenService: JwtService,
  ) {}

  async login(payload: Pick<User, 'email' | 'password'>) {
    try {
      const user = await this.usersService.findByEmailAndProvider(
        payload.email,
      );

      const isMatch =
        user && (await bcrypt.compare(payload.password, user.password));
      if (isMatch) {
        delete user.password; // Remove password

        /* Update refresh token */
        await this.usersService.update(user.id, {
          refreshToken: this.jwtTokenService.sign(
            {
              id: user.id,
              email: user.email,
              provider: user.provider,
            },
            {
              secret: process.env.JWT_AUTH_REFRESH_TOKEN_SECRET_KEY,
              expiresIn: process.env.JWT_AUTH_REFRESH_TOKEN_EXPIRE_IN,
            },
          ),
        });

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
      this.logger.error(e.message);
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
      this.logger.error(e.message);
      throw e;
    }
  }

  async logout(user: Pick<User, 'id' | 'email' | 'provider'>) {
    try {
      // Remove refresh token
      const updated = await this.usersService.update(user.id, {
        refreshToken: null,
      });

      if (!updated.updatedCount) {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: 'Fail to logout',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      return updated;
    } catch (e) {
      this.logger.error(e.message);
      throw e;
    }
  }

  verifyAccessToken(accessToken: string) {
    try {
      return this.jwtTokenService.verify(accessToken);
    } catch (e) {
      return null;
    }
  }

  async verifyRefreshToken(id: number) {
    const user = await this.usersService.findOne(id);
    if (!user.refreshToken) {
      throw new Error('no refresh token');
    }

    // Check refresh token
    return await this.jwtTokenService.verifyAsync(user.refreshToken, {
      secret: process.env.JWT_AUTH_REFRESH_TOKEN_SECRET_KEY,
    });
  }

  async refreshAllTokens(id: number) {
    try {
      const user = await this.usersService.findOne(id);

      /* Update refresh token */
      await this.usersService.update(user.id, {
        refreshToken: this.jwtTokenService.sign(
          {
            id: user.id,
            email: user.email,
            provider: user.provider,
          },
          {
            secret: process.env.JWT_AUTH_REFRESH_TOKEN_SECRET_KEY,
            expiresIn: process.env.JWT_AUTH_REFRESH_TOKEN_EXPIRE_IN,
          },
        ),
      });

      return {
        accessToken: this.jwtTokenService.sign({
          id: user.id,
          email: user.email,
          provider: user.provider,
        }),
      };
    } catch (e) {
      this.logger.error(e.message);
      throw e;
    }
  }
}
