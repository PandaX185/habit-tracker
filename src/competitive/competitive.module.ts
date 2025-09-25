import { Module } from '@nestjs/common';
import { CompetitiveService } from './competitive.service';
import { CompetitiveController } from './competitive.controller';

@Module({
  controllers: [CompetitiveController],
  providers: [CompetitiveService],
  exports: [CompetitiveService],
})
export class CompetitiveModule {}