import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HabitService {
  private readonly logger = new Logger(HabitService.name);

  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue('habit-reactivation') private readonly habitQueue: Queue,
  ) {}

  create(createHabitDto: Prisma.HabitCreateInput, userId: string) {
    return this.prisma.habit.create({
      data: { ...createHabitDto, user: { connect: { id: userId } } },
    });
  }

  findAll(userId: string) {
    return this.prisma.habit.findMany({
      where: { userId },
    });
  }

  findOne(id: string, userId: string) {
    return this.prisma.habit.findUnique({
      where: { id, userId },
    });
  }

  update(id: string, updateHabitDto: Prisma.HabitUpdateInput, userId: string) {
    return this.prisma.habit.update({
      where: { id, userId },
      data: updateHabitDto,
    });
  }

  async remove(id: string, userId: string) {
    // Cancel any pending reactivation jobs for this habit
    await this.cancelHabitReactivationJob(id);

    return this.prisma.habit.delete({
      where: { id, userId },
    });
  }

  async completeHabit(id: string, userId: string) {
    return this.prisma.$transaction(async (prisma) => {
      // Get the habit
      const habit = await prisma.habit.findUnique({
        where: { id, userId },
      });

      if (!habit) {
        throw new Error('Habit not found');
      }

      if (!habit.isActive) {
        throw new Error('Habit is not active');
      }

      // Calculate next deadline
      const now = new Date();
      const nextDeadline = new Date(now);

      switch (habit.repetitionUnit) {
        case 'days':
          nextDeadline.setDate(now.getDate() + habit.repetitionInterval);
          break;
        case 'weeks':
          nextDeadline.setDate(now.getDate() + habit.repetitionInterval * 7);
          break;
        case 'months':
          nextDeadline.setMonth(now.getMonth() + habit.repetitionInterval);
          break;
        default:
          throw new Error('Invalid repetition unit');
      }

      // Calculate streak
      let newStreak = habit.streak + 1;

      // If last completed was more than the interval ago, reset streak
      if (habit.lastCompletedAt) {
        const timeSinceLastCompletion =
          now.getTime() - habit.lastCompletedAt.getTime();
        const intervalMs = this.getIntervalInMs(
          habit.repetitionInterval,
          habit.repetitionUnit,
        );

        if (timeSinceLastCompletion > intervalMs * 1.25) {
          // Allow some flexibility
          newStreak = 1;
        }
      }

      // Cancel any existing reactivation job for this habit
      await this.cancelHabitReactivationJob(id);

      // Update habit
      const updatedHabit = await prisma.habit.update({
        where: { id, userId },
        data: {
          streak: newStreak,
          lastCompletedAt: now,
          isActive: false, // Disable until next deadline
        },
      });

      // Update user XP and get user object
      await prisma.user.update({
        where: { id: userId },
        data: {
          xpPoints: {
            increment: habit.points,
          },
        },
      });
      
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });
      if (!user) {
        throw new Error('User not found');
      }
      const newLevel = Math.floor(user.xpPoints / 100) + 1;
      await prisma.user.update({
        where: { id: userId },
        data: {
          level: newLevel,
        },
      });

      // Schedule reactivation job
      const delay = nextDeadline.getTime() - now.getTime();
      await this.habitQueue.add(
        'reactivate-habit',
        { habitId: id },
        {
          delay,
          jobId: `reactivate-${id}`, // Unique job ID for cancellation
          removeOnComplete: true,
          removeOnFail: true,
        },
      );

      this.logger.log(`Scheduled reactivation for habit ${id} in ${delay}ms`);

      return updatedHabit;
    });
  }

  private async cancelHabitReactivationJob(habitId: string) {
    try {
      const job = await this.habitQueue.getJob(`reactivate-${habitId}`);
      if (job) {
        await job.remove();
        this.logger.log(`Cancelled reactivation job for habit ${habitId}`);
      }
    } catch (error) {
      this.logger.error(
        `Failed to cancel reactivation job for habit ${habitId}:`,
        error,
      );
    }
  }

  private getIntervalInMs(interval: number, unit: string): number {
    const msPerDay = 24 * 60 * 60 * 1000;
    switch (unit) {
      case 'days':
        return interval * msPerDay;
      case 'weeks':
        return interval * 7 * msPerDay;
      case 'months':
        return interval * 30 * msPerDay;
      default:
        return msPerDay;
    }
  }
}
