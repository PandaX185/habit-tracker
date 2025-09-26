import { Test, TestingModule } from '@nestjs/testing';
import { FriendshipService } from './friendship.service';
import { PrismaService } from '../prisma/prisma.service';
import { BadgeService } from '../badges/badge.service';

describe('FriendshipService', () => {
  let service: FriendshipService;

  beforeEach(async () => {
    const mockBadgeServiceProvider = {
      provide: BadgeService,
      useValue: {
        checkAndAwardBadges: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [FriendshipService, PrismaService, mockBadgeServiceProvider],
    }).compile();

    service = module.get<FriendshipService>(FriendshipService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});