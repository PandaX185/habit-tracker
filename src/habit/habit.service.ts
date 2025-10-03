import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { BadgeService } from '../badges/badge.service';
import { CreateHabitDto, UpdateHabitDto } from './habit.dto';

@Injectable()
export class HabitService {
  private readonly logger = new Logger(HabitService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly badgeService: BadgeService,
    @InjectQueue('habit-reactivation') private readonly habitQueue: Queue,
  ) { }

  create(createHabitDto: CreateHabitDto, userId: string) {
    return this.prisma.habit.create({
      data: { ...createHabitDto, user: { connect: { id: userId } }, isCompetitive: false },
    }).then(async (habit) => {
      // Check for habit count badges after creating a habit
      try {
        await this.badgeService.checkAndAwardBadges(userId, 'habit_created');
      } catch (error) {
        this.logger.error(`Failed to check badges for habit creation ${userId}:`, error);
      }
      return habit;
    });
  }

  findAll(userId: string) {
    return this.prisma.habit.findMany({
      where: { userId },
      select: {
        id: true,
        title: true,
        description: true,
        repetitionInterval: true,
        repetitionUnit: true,
        points: true,
        userId: true,
        isActive: true,
        streak: true,
        longestStreak: true,
        lastCompletedAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  findOne(id: string, userId: string) {
    return this.prisma.habit.findUnique({
      where: { id, userId },
      select: {
        id: true,
        title: true,
        description: true,
        repetitionInterval: true,
        repetitionUnit: true,
        points: true,
        userId: true,
        isActive: true,
        streak: true,
        longestStreak: true,
        lastCompletedAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  update(id: string, updateHabitDto: UpdateHabitDto, userId: string) {
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

  async completeHabit(id: string, userId: string, notes?: string) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Calculate next deadline (needed for job scheduling)
    const habit = await this.prisma.habit.findUnique({
      where: { id, userId },
    });

    if (!habit) {
      throw new Error('Habit not found');
    }

    if (!habit.isActive) {
      return { message: 'Habit is not active. Wait until the next deadline to complete it again.' };
    }

    // Check if already completed today
    const existingCompletion = await this.prisma.habitCompletion.findFirst({
      where: {
        habitId: id,
        completedAt: {
          gte: today,
          lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
        },
      },
    });

    if (existingCompletion) {
      throw new Error('Habit already completed today');
    }

    // Calculate next deadline
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

    // Use transaction only for database operations
    const updatedHabit = await this.prisma.$transaction(async (prisma) => {
      // Create completion record first
      await prisma.habitCompletion.create({
        data: {
          habitId: id,
          userId: userId,
          completedAt: now,
          notes,
        },
      });

      // Calculate streak incrementally (more efficient)
      const newStreak = await this.calculateStreakIncrementally(prisma, habit, now);
      const newLongestStreak = Math.max(habit.longestStreak, newStreak);

      // Cancel any existing reactivation job for this habit
      await this.cancelHabitReactivationJob(id);

      // Update habit
      const updatedHabit = await prisma.habit.update({
        where: { id, userId },
        data: {
          streak: newStreak,
          longestStreak: newLongestStreak,
          lastCompletedAt: now,
          isActive: false, // Disable until next deadline
        },
      });

      return updatedHabit;
    });

    // Update user XP and level (outside transaction for reliability)
    try {
      const leveledUp = await this.updateUserProgress(userId, habit.points);

      // Check for badges after habit completion and potential level up
      await this.badgeService.checkAndAwardBadges(userId, 'habit_completion');
      if (leveledUp) {
        await this.badgeService.checkAndAwardBadges(userId, 'level_up');
      }
    } catch (error) {
      this.logger.error(`Failed to update user progress for ${userId}:`, error);
      // Don't fail the habit completion if user progress update fails
    }

    // Schedule reactivation job outside transaction
    try {
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
    } catch (error) {
      this.logger.error(`Failed to schedule reactivation job for habit ${id}:`, error);
    }

    return updatedHabit;
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

  async getHabitStreak(habitId: string, userId: string) {
    const habit = await this.prisma.habit.findUnique({
      where: { id: habitId, userId },
    });

    if (!habit) {
      throw new Error('Habit not found');
    }

    return {
      currentStreak: habit.streak,
      longestStreak: habit.longestStreak,
      lastCompletedAt: habit.lastCompletedAt,
    };
  }

  async getUserTotalStreaks(userId: string) {
    // Optimized query using aggregation
    const habits = await this.prisma.habit.findMany({
      where: { userId },
      select: {
        streak: true,
        longestStreak: true,
        title: true,
      },
    });

    const currentTotalStreak = habits.reduce((sum, habit) => sum + habit.streak, 0);
    const longestTotalStreak = habits.reduce((sum, habit) => sum + habit.longestStreak, 0);

    return {
      currentTotalStreak,
      longestTotalStreak,
      habitStreaks: habits.map(habit => ({
        title: habit.title,
        currentStreak: habit.streak,
        longestStreak: habit.longestStreak,
      })),
    };
  }

  // Optimized: Get habit completions for a date range
  async getHabitCompletions(habitId: string, userId: string, startDate?: Date, endDate?: Date) {
    // Verify ownership
    const habit = await this.prisma.habit.findFirst({
      where: { id: habitId, userId },
    });

    if (!habit) {
      throw new Error('Habit not found');
    }

    const completions = await this.prisma.habitCompletion.findMany({
      where: {
        habitId,
        completedAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { completedAt: 'desc' },
      take: 100, // Limit results
    });

    return completions;
  }

  // Optimized: Get completion stats for dashboard
  async getCompletionStats(userId: string, days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Use raw SQL for complex aggregations (more efficient)
    const stats = await this.prisma.$queryRaw<
      Array<{
        totalCompletions: bigint;
        activeDays: bigint;
        avgCompletionsPerDay: number | null;
      }>
    >`
      SELECT
        COUNT(*) as "totalCompletions",
        COUNT(DISTINCT DATE("completedAt")) as "activeDays",
        AVG("completions_per_day") as "avgCompletionsPerDay"
      FROM (
        SELECT
          DATE("completedAt") as "completion_date",
          COUNT(*) as "completions_per_day"
        FROM "HabitCompletion" hc
        JOIN "Habit" h ON hc."habitId" = h."id"
        WHERE h."userId" = ${userId}
        AND hc."completedAt" >= ${startDate}
        GROUP BY DATE("completedAt")
      ) daily_stats
    `;

    // Return the first result or default values
    const result = stats[0] || {
      totalCompletions: 0n,
      activeDays: 0n,
      avgCompletionsPerDay: 0,
    };

    return {
      totalCompletions: Number(result.totalCompletions),
      activeDays: Number(result.activeDays),
      avgCompletionsPerDay: result.avgCompletionsPerDay || 0,
    };
  }

  private async calculateStreakIncrementally(
    prisma: Prisma.TransactionClient,
    habit: any,
    currentDate: Date,
  ): Promise<number> {
    const today = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());

    if (!habit.lastCompletedAt) {
      return 1; // First completion
    }

    const lastCompletedDate = new Date(habit.lastCompletedAt.getFullYear(), habit.lastCompletedAt.getMonth(), habit.lastCompletedAt.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    if (lastCompletedDate.getTime() === yesterday.getTime()) {
      // Completed yesterday, continue streak
      return habit.streak + 1;
    } else if (lastCompletedDate.getTime() === today.getTime()) {
      // Already completed today, shouldn't happen due to our check above
      return habit.streak;
    } else {
      // Gap in completion, reset streak
      return 1;
    }
  }

  // Optimized: Get calendar view data for visual progress tracking
  async getCalendarView(userId: string, year: number, month: number) {
    const startDate = new Date(year, month - 1, 1); // Month is 0-indexed
    const endDate = new Date(year, month, 1); // First day of next month

    const completions = await this.prisma.habitCompletion.findMany({
      where: {
        habit: { userId },
        completedAt: {
          gte: startDate,
          lt: endDate,
        },
      },
      select: {
        completedAt: true,
        habit: {
          select: {
            id: true,
            title: true,
            points: true,
          },
        },
      },
      orderBy: { completedAt: 'asc' },
    });

    // Group by date
    const calendarData = completions.reduce((acc, completion) => {
      const date = completion.completedAt.toISOString().split('T')[0]; // YYYY-MM-DD format
      if (!acc[date]) {
        acc[date] = {
          date,
          completions: [],
          totalPoints: 0,
        };
      }
      acc[date].completions.push({
        habitId: completion.habit.id,
        habitTitle: completion.habit.title,
        points: completion.habit.points,
        completedAt: completion.completedAt,
      });
      acc[date].totalPoints += completion.habit.points;
      return acc;
    }, {} as Record<string, { date: string; completions: any[]; totalPoints: number }>);

    return Object.values(calendarData);
  }

  private async updateUserProgress(userId: string, points: number): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const oldLevel = user.level;
    const newXpPoints = user.xpPoints + points;
    const newLevel = Math.floor(newXpPoints / 100) + 1;

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        xpPoints: newXpPoints,
        level: newLevel,
      },
    });

    return newLevel > oldLevel; // Return true if leveled up
  }
}
