import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from './auth.service';
import { Test } from '@nestjs/testing';
import { RegisterRequest } from './auth.dto';

describe('AuthService', () => {
  let authService: AuthService;
  let prismaService: PrismaService;
  const registerReq: RegisterRequest = {
    email: 'test@example.com',
    password: 'password',
    fullname: 'Test User',
    username: 'testuser',
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [AuthService, PrismaService],
    }).compile();

    authService = moduleRef.get<AuthService>(AuthService);
    prismaService = moduleRef.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('Register', () => {
    it('should register a user', async () => {
      const res = await authService.registerUser(registerReq);

      expect(res.accessToken).toBeDefined();
      await prismaService.user.delete({ where: { email: registerReq.email } });
    });

    it('should return a conflict error for duplicate email', async () => {
      await authService.registerUser(registerReq);

      await expect(authService.registerUser(registerReq)).rejects.toThrow(
        ConflictException,
      );

      await prismaService.user.delete({ where: { email: registerReq.email } });
    });
  });

  describe('Login', () => {
    it('should login a user', async () => {
      await authService.registerUser(registerReq);
      const res = await authService.login({
        email: registerReq.email,
        password: registerReq.password,
      });

      expect(res.accessToken).toBeDefined();
      await prismaService.user.delete({ where: { email: registerReq.email } });
    });

    it('should return unauthorized error on wrong email', async () => {
      await expect(
        authService.login({
          email: 'test@example.com',
          password: 'password',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should return unauthorized error on wrong password', async () => {
      await authService.registerUser(registerReq);
      await expect(
        authService.login({
          email: 'test@example.com',
          password: 'password123',
        }),
      ).rejects.toThrow(UnauthorizedException);
      await prismaService.user.delete({ where: { email: registerReq.email } });
    });
  });
});
