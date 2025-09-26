import { Module } from '@nestjs/common';
import { CompetitiveService } from './competitive.service';
import { CompetitiveController } from './competitive.controller';
import { BadgeModule } from '../badges/badge.module';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [BadgeModule],
  controllers: [CompetitiveController],
  providers: [CompetitiveService, PrismaService],
  exports: [CompetitiveService],
})
export class CompetitiveModule {}