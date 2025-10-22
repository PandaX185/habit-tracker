import { Module } from '@nestjs/common';
import { HabitService } from './habit.service';
import { HabitController } from './habit.controller';
import { AuthModule } from '../auth/auth.module';
import { BadgeModule } from '../badges/badge.module';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [
    AuthModule,
    BadgeModule,
  ],
  controllers: [HabitController],
  providers: [HabitService, PrismaService],
})
export class HabitModule { }
