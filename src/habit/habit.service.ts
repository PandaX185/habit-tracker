import { Injectable, InternalServerErrorException, Logger, MethodNotAllowedException, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { BadgeService } from '../badges/badge.service';
import { CreateHabitDto, HabitResponse, UpdateHabitDto } from './dto/habit.dto';
import { WEEK_DAYS, extractRepetitionDays, isHabitActive } from './habit.utils';

@Injectable()
export class HabitService {
  private readonly logger = new Logger(HabitService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly badgeService: BadgeService,
  ) { }

  async create(createHabitDto: CreateHabitDto, userId: string) {
    // Exclude categories from direct habit creation because Prisma expects a nested create/connect structure.
    const { categories, ...habitData } = createHabitDto;
    const habit = await this.prisma.habit.create({
      data: { ...habitData, user: { connect: { id: userId } }, isCompetitive: false },
    });

    try {
      await this.prisma.habitCategory.createMany({
        data: (categories || []).map(category => ({
          habitId: habit.id,
          categoryId: category,
        })),
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to associate categories with habit: ' + error.message);
    }

    const result = await this.prisma.habit.findUnique({
      where: { id: habit.id },
      include: {
        categories: {
          include: { category: true },
          omit: { habitId: true, categoryId: true },
        },
      },
    });

    // Check for habit count badges after creating a habit
    try {
      await this.badgeService.checkAndAwardBadges(userId, 'habit_created');
    } catch (error) {
      this.logger.error(`Failed to check badges for habit creation ${userId}:`, error);
    }
    return HabitResponse.fromHabitEntity(result);
  }

  async findAll(userId: string) {
    const habits = await this.prisma.habit.findMany({
      where: { userId },
      select: {
        id: true,
        title: true,
        description: true,
        repetitionDays: true,
        userId: true,
        streak: true,
        longestStreak: true,
        lastCompletedAt: true,
        categories: {
          include: { category: true },
          omit: { habitId: true, categoryId: true },
        },
        createdAt: true,
        updatedAt: true,
      },
    });
    return habits.map(habit => HabitResponse.fromHabitEntity(habit));
  }

  async findOne(id: string, userId: string) {
    const habit = await this.prisma.habit.findUnique({
      where: { id, userId },
      select: {
        id: true,
        title: true,
        description: true,
        repetitionDays: true,
        userId: true,
        streak: true,
        longestStreak: true,
        lastCompletedAt: true,
        categories: {
          include: { category: true },
          omit: { habitId: true, categoryId: true },
        },
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!habit) {
      throw new NotFoundException('Habit not found');
    }

    return HabitResponse.fromHabitEntity(habit);
  }

  async update(id: string, updateHabitDto: UpdateHabitDto, userId: string) {
    const { categories, ...habitData } = updateHabitDto;
    await this.prisma.habitCategory.deleteMany({
      where: { habitId: id },
    });

    await this.prisma.habitCategory.createMany({
      data: (categories || []).map(category => ({
        habitId: id,
        categoryId: category,
      })),
    });

    const habit = await this.prisma.habit.update({
      where: { id, userId },
      data: habitData,
      include: {
        categories: {
          include: { category: true },
          omit: { habitId: true, categoryId: true },
        },
      },
    });

    return HabitResponse.fromHabitEntity(habit);
  }

  async remove(id: string, userId: string) {
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
      throw new NotFoundException('Habit not found');
    }

    if (!isHabitActive(habit.repetitionDays, habit.lastCompletedAt)) {
      throw new MethodNotAllowedException('Habit is not active');
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
      throw new MethodNotAllowedException('Habit already completed today');
    }

    // Calculate next deadline
    const nextDeadline = new Date(now);
    const repetitionDays: string[] = extractRepetitionDays(habit.repetitionDays);
    const currentDayIndex = now.getDay(); // 0 (Sun) to 6 (Sat)
    for (let i = currentDayIndex + 1; i < 7; i++) {
      if (repetitionDays.includes(WEEK_DAYS[i])) {
        nextDeadline.setDate(now.getDate() + (i - currentDayIndex));
        break;
      }
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

      // Update habit
      const updatedHabit = await prisma.habit.update({
        where: { id, userId },
        data: {
          streak: newStreak,
          longestStreak: newLongestStreak,
          lastCompletedAt: now,
        },
      });

      return HabitResponse.fromHabitEntity(updatedHabit);
    });

    // Update user XP and level (outside transaction for reliability)
    try {
      const leveledUp = await this.updateUserProgress(userId, 1); // All habits now give 1 XP point

      // Check for badges after habit completion and potential level up
      await this.badgeService.checkAndAwardBadges(userId, 'habit_completion');
      if (leveledUp) {
        await this.badgeService.checkAndAwardBadges(userId, 'level_up');
      }
    } catch (error) {
      this.logger.error(`Failed to update user progress for ${userId}:`, error);
      // Don't fail the habit completion if user progress update fails
    }

    return updatedHabit;
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
      throw new NotFoundException('Habit not found');
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
      take: 100,
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
      WITH daily_stats AS (
        SELECT
          DATE("completedAt") as "completion_date",
          COUNT(*) as "completions_per_day"
        FROM "HabitCompletion" hc
        JOIN "Habit" h ON hc."habitId" = h."id"
        WHERE h."userId" = ${userId}
        AND hc."completedAt" >= ${startDate}
        GROUP BY DATE("completedAt")
      )
      SELECT
        (SELECT COUNT(*) FROM "HabitCompletion" hc JOIN "Habit" h ON hc."habitId" = h."id" WHERE h."userId" = ${userId} AND hc."completedAt" >= ${startDate}) as "totalCompletions",
        COUNT(DISTINCT "completion_date") as "activeDays",
        AVG("completions_per_day") as "avgCompletionsPerDay"
      FROM daily_stats
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
        completedAt: completion.completedAt,
      });
      acc[date].totalPoints += 1; // All habits now give 1 point
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
    const newLevel = Math.floor(newXpPoints / 10) + 1;

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
