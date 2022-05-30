import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '@/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '@/users/entities/user.entity';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    // @TODO: Open when res is required
    // const res = context.switchToHttp().getResponse();

    try {
      // Check access token in header
      const accessToken = req.headers.authorization
        ? req.headers.authorization.split('Bearer')[1].trim()
        : '';
      if (!accessToken) {
        throw new UnauthorizedException('Access token is not set');
      }

      // Check access token time
      const isValidAccessToken =
        this.authService.verifyAccessToken(accessToken);
      if (isValidAccessToken) {
        return this.activate(context);
      }
      /* If access token is expired, try to renew access token */
      const decoded = this.jwtService.decode(accessToken) as Pick<
        User,
        'id' | 'email' | 'provider'
      >;
      const isValidRefreshToken = await this.authService.verifyRefreshToken(
        decoded.id,
      );
      if (isValidRefreshToken) {
        const newAccessToken = (
          await this.authService.refreshAllTokens(decoded.id)
        ).accessToken;
        // Set new access-token
        req.headers.authorization = `Bearer ${newAccessToken}`;
      }

      return await this.activate(context);
    } catch (e) {
      req.headers.authorization = undefined;
      if (e.message !== 'jwt expired') {
        console.error(e);
      }

      return false;
    }
  }

  async activate(context: ExecutionContext): Promise<boolean> {
    return super.canActivate(context) as Promise<boolean>;
  }

  handleRequest(err, user) {
    if (err || !user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
