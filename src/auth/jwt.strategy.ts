import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

interface JwtPayload {
  userId: string;
  email: string;
  username: string;
  fullname: string;
  avatarUrl?: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const extractJwt = ExtractJwt.fromAuthHeaderAsBearerToken();
    super({
      jwtFromRequest: extractJwt,
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'fallback-secret',
    });
  }

  validate(payload: JwtPayload) {
    return {
      userId: payload.userId,
      email: payload.email,
      username: payload.username,
      fullname: payload.fullname,
      avatarUrl: payload.avatarUrl,
    };
  }
}
