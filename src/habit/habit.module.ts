import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { HabitService } from './habit.service';
import { HabitController } from './habit.controller';
import { HabitProcessor } from './habit.processor';
import { AuthModule } from '../auth/auth.module';
import { BadgeModule } from '../badges/badge.module';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'habit-reactivation',
    }),
    AuthModule,
    BadgeModule,
  ],
  controllers: [HabitController],
  providers: [HabitService, HabitProcessor, PrismaService],
})
export class HabitModule {}
