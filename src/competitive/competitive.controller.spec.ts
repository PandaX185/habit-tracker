import { Test, TestingModule } from '@nestjs/testing';
import { CompetitiveController } from './competitive.controller';
import { CompetitiveService } from './competitive.service';
import { BadgeService } from '../badges/badge.service';

describe('CompetitiveController', () => {
  let controller: CompetitiveController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompetitiveController],
      providers: [
        CompetitiveService,
        require('../prisma/prisma.service').PrismaService,
        BadgeService
      ],
    }).compile();

    controller = module.get<CompetitiveController>(CompetitiveController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});