import { Test, TestingModule } from '@nestjs/testing';
import { FriendshipController } from './friendship.controller';
import { FriendshipService } from './friendship.service';
import { PrismaService } from '../prisma/prisma.service';
import { BadgeService } from '../badges/badge.service';

describe('FriendshipController', () => {
  let controller: FriendshipController;

  beforeEach(async () => {
    const mockBadgeServiceProvider = {
      provide: BadgeService,
      useValue: {
        checkAndAwardBadges: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [FriendshipController],
      providers: [FriendshipService, PrismaService, mockBadgeServiceProvider],
    }).compile();

    controller = module.get<FriendshipController>(FriendshipController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});