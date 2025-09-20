import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { HabitModule } from './habit/habit.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [AuthModule, HabitModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
