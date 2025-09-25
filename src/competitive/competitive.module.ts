import { Module } from '@nestjs/common';
import { CompetitiveService } from './competitive.service';
import { CompetitiveController } from './competitive.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [CompetitiveController],
  providers: [CompetitiveService, PrismaService],
  exports: [CompetitiveService],
})
export class CompetitiveModule {}