import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import AuthUtils from './auth.utils';
import { compareSync, genSaltSync, hashSync } from 'bcryptjs';
import { RegisterRequest, RegisterResponse, LoginRequest } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async registerUser(data: RegisterRequest): Promise<RegisterResponse> {
    return await this.prisma.$transaction(async (prisma) => {
      const existingUser = await prisma.user.findUnique({
        where: { email: data.email },
      });

      if (existingUser) {
        throw new ConflictException('User already exists');
      }

      const user = await prisma.user.create({
        data: {
          username: data.username,
          email: data.email,
          fullname: data.fullname,
          passwordHash: hashSync(data.password, genSaltSync()),
          avatarUrl: data.avatarUrl,
        },
      });

      const accessToken = AuthUtils.generateAccessToken(user);
      return { accessToken };
    });
  }

  async login(req: LoginRequest): Promise<RegisterResponse> {
    const user = await this.prisma.user.findUnique({
      where: { email: req.email },
    });

    if (!user) {
      throw new UnauthorizedException('User does not exist');
    }

    const isPasswordValid = compareSync(req.password, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    const accessToken = AuthUtils.generateAccessToken(user);
    return { accessToken };
  }
}
