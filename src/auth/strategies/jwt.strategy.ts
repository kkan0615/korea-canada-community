import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from '@/users/entities/user.entity';
import { AuthService } from '@/auth/auth.service';

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_AUTH_ACCESS_TOKEN_SECRET_KEY,
    });
  }

  async validate(payload: Pick<User, 'id' | 'email' | 'provider'>) {
    return { id: payload.id, email: payload.email, provider: payload.provider };
  }
}
