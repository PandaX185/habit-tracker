import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BadgeType, BadgeRarity, User } from '@prisma/client';
import { BadgeProgressDto } from './badge.dto';

@Injectable()
export class BadgeService {
  private readonly logger = new Logger(BadgeService.name);

  constructor(private prisma: PrismaService) {}

  async getAllBadges() {
    return this.prisma.badge.findMany({
      orderBy: { rarity: 'desc' },
    });
  }

  async getUserBadges(userId: string) {
    return this.prisma.userBadge.findMany({
      where: { userId },
      include: { badge: true },
      orderBy: { earnedAt: 'desc' },
    });
  }

  async getBadgeProgress(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        habits: {
          include: {
            completions: {
              where: {
                completedAt: {
                  gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
                },
              },
            },
          },
        },
        habitCompletions: true,
        userBadges: { include: { badge: true } },
      },
    });

    if (!user) return [];

    const badges = await this.prisma.badge.findMany();
    const progress: BadgeProgressDto[] = [];

    for (const badge of badges) {
      const userBadge = user.userBadges.find(ub => ub.badgeId === badge.id);
      if (userBadge) continue; // Already earned

      const badgeProgress = await this.calculateBadgeProgress(user, badge);
      if (badgeProgress) {
        progress.push(badgeProgress);
      }
    }

    return progress;
  }

  private async calculateBadgeProgress(user: any, badge: any): Promise<BadgeProgressDto | null> {
    switch (badge.type) {
      case BadgeType.STREAK:
        return this.calculateStreakProgress(user, badge);
      case BadgeType.LEVEL:
        return this.calculateLevelProgress(user, badge);
      case BadgeType.HABIT_COUNT:
        return this.calculateHabitCountProgress(user, badge);
      case BadgeType.CATEGORY:
        return this.calculateCategoryProgress(user, badge);
      case BadgeType.SOCIAL:
        return this.calculateSocialProgress(user, badge);
      case BadgeType.COMPETITIVE:
        return this.calculateCompetitiveProgress(user, badge);
      default:
        return null;
    }
  }

  private calculateStreakProgress(user: any, badge: any): BadgeProgressDto | null {
    const { targetStreak } = badge.criteria;
    const maxStreak = Math.max(...user.habits.map(h => h.currentStreak), 0);

    if (maxStreak >= targetStreak) {
      return null; // Should have been awarded already
    }

    return {
      badgeId: badge.id,
      currentProgress: maxStreak,
      targetProgress: targetStreak,
      progressData: { maxStreak },
    };
  }

  private calculateLevelProgress(user: any, badge: any): BadgeProgressDto | null {
    const { targetLevel } = badge.criteria;

    if (user.level >= targetLevel) {
      return null; // Should have been awarded already
    }

    return {
      badgeId: badge.id,
      currentProgress: user.level,
      targetProgress: targetLevel,
      progressData: { currentLevel: user.level },
    };
  }

  private calculateHabitCountProgress(user: any, badge: any): BadgeProgressDto | null {
    const { targetCount } = badge.criteria;
    const habitCount = user.habits.length;

    if (habitCount >= targetCount) {
      return null; // Should have been awarded already
    }

    return {
      badgeId: badge.id,
      currentProgress: habitCount,
      targetProgress: targetCount,
      progressData: { habitCount },
    };
  }

  private calculateCategoryProgress(user: any, badge: any): BadgeProgressDto | null {
    const { category, targetCount } = badge.criteria;
    const categoryHabits = user.habits.filter(h => h.category === category);
    const categoryCount = categoryHabits.length;

    if (categoryCount >= targetCount) {
      return null; // Should have been awarded already
    }

    return {
      badgeId: badge.id,
      currentProgress: categoryCount,
      targetProgress: targetCount,
      progressData: { category, categoryCount },
    };
  }

  private calculateSocialProgress(user: any, badge: any): BadgeProgressDto | null {
    // This would require additional queries for friends/competitive habits
    // For now, return null as this is more complex
    return null;
  }

  private calculateConsistencyProgress(user: any, badge: any): BadgeProgressDto | null {
    const { targetDays, withinDays } = badge.criteria;
    const recentCompletions = user.habitCompletions.filter(
      hc => hc.completedAt >= new Date(Date.now() - withinDays * 24 * 60 * 60 * 1000)
    );

    const uniqueDays = new Set(
      recentCompletions.map(hc => hc.completedAt.toDateString())
    ).size;

    if (uniqueDays >= targetDays) {
      return null; // Should have been awarded already
    }

    return {
      badgeId: badge.id,
      currentProgress: uniqueDays,
      targetProgress: targetDays,
      progressData: { uniqueDays, withinDays },
    };
  }

  private calculateCompetitiveProgress(user: any, badge: any): BadgeProgressDto | null {
    // This would require additional queries for competitive habits
    // For now, return null as this is more complex and better checked at specific events
    return null;
  }

  async checkAndAwardBadges(userId: string, trigger: 'habit_completion' | 'level_up' | 'habit_created' | 'friend_added' | 'competitive_created' | 'competitive_joined' | 'competitive_completed' | 'challenge_won') {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        habits: {
          include: {
            completions: {
              where: {
                completedAt: {
                  gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                },
              },
            },
          },
        },
        habitCompletions: true,
        userBadges: true,
        friendships: true,
        friendOf: true,
      },
    });

    if (!user) return [];

    const badges = await this.prisma.badge.findMany();
    const awardedBadges: any[] = [];

    for (const badge of badges) {
      const alreadyEarned = user.userBadges.some(ub => ub.badgeId === badge.id);
      if (alreadyEarned) continue;

      let shouldAward = false;

      switch (badge.type) {
        case BadgeType.STREAK:
          shouldAward = this.checkStreakBadge(user, badge);
          break;
        case BadgeType.LEVEL:
          shouldAward = this.checkLevelBadge(user, badge);
          break;
        case BadgeType.HABIT_COUNT:
          shouldAward = this.checkHabitCountBadge(user, badge);
          break;
        case BadgeType.CATEGORY:
          shouldAward = this.checkCategoryBadge(user, badge);
          break;
        case BadgeType.SOCIAL:
          shouldAward = this.checkSocialBadge(user, badge, trigger);
          break;
        case BadgeType.CONSISTENCY:
          shouldAward = this.checkConsistencyBadge(user, badge);
          break;
        case BadgeType.COMPETITIVE:
          shouldAward = this.checkCompetitiveBadge(user, badge, trigger);
          break;
      }

      if (shouldAward) {
        const userBadge = await this.prisma.userBadge.create({
          data: {
            userId,
            badgeId: badge.id,
          },
          include: { badge: true },
        });

        // Award XP
        await this.prisma.user.update({
          where: { id: userId },
          data: {
            xpPoints: { increment: badge.points },
          },
        });

        awardedBadges.push(userBadge);
        this.logger.log(`User ${userId} earned badge: ${badge.name}`);
      }
    }

    return awardedBadges;
  }

  private checkStreakBadge(user: any, badge: any): boolean {
    const { targetStreak } = badge.criteria;
    const maxStreak = Math.max(...user.habits.map(h => h.currentStreak), 0);
    return maxStreak >= targetStreak;
  }

  private checkLevelBadge(user: any, badge: any): boolean {
    const { targetLevel } = badge.criteria;
    return user.level >= targetLevel;
  }

  private checkHabitCountBadge(user: any, badge: any): boolean {
    const { targetCount } = badge.criteria;
    return user.habits.length >= targetCount;
  }

  private checkCategoryBadge(user: any, badge: any): boolean {
    const { category, targetCount } = badge.criteria;
    const categoryHabits = user.habits.filter(h => h.category === category);
    return categoryHabits.length >= targetCount;
  }

  private checkSocialBadge(user: any, badge: any, trigger: string): boolean {
    const { action } = badge.criteria;

    switch (action) {
      case 'add_friend':
        return trigger === 'friend_added' && (user.friendships.length + user.friendOf.length) >= badge.criteria.targetCount;
      case 'join_competitive':
        // This would need additional logic for competitive habits
        return false;
      default:
        return false;
    }
  }

  private checkConsistencyBadge(user: any, badge: any): boolean {
    const { targetDays, withinDays } = badge.criteria;
    const recentCompletions = user.habitCompletions.filter(
      hc => hc.completedAt >= new Date(Date.now() - withinDays * 24 * 60 * 60 * 1000)
    );

    const uniqueDays = new Set(
      recentCompletions.map(hc => hc.completedAt.toDateString())
    ).size;

    return uniqueDays >= targetDays;
  }

  private checkCompetitiveBadge(user: any, badge: any, trigger: string): boolean {
    const { action } = badge.criteria;

    switch (action) {
      case 'first_competitive':
        return trigger === 'competitive_created' || trigger === 'competitive_joined';
      case 'first_win':
        return trigger === 'challenge_won';
      case 'multiple_wins':
        // This would need to track total wins - for now, return false
        // In a real implementation, you'd need to track wins in user profile
        return false;
      default:
        return false;
    }
  }

  async seedDefaultBadges() {
    const defaultBadges = [
      // Streak badges
      {
        name: 'First Steps',
        description: 'Complete a habit for 7 consecutive days',
        type: BadgeType.STREAK,
        rarity: BadgeRarity.COMMON,
        criteria: { targetStreak: 7 },
        points: 50,
      },
      {
        name: 'Week Warrior',
        description: 'Maintain a 30-day streak',
        type: BadgeType.STREAK,
        rarity: BadgeRarity.RARE,
        criteria: { targetStreak: 30 },
        points: 200,
      },
      {
        name: 'Streak Master',
        description: 'Achieve a 100-day streak',
        type: BadgeType.STREAK,
        rarity: BadgeRarity.EPIC,
        criteria: { targetStreak: 100 },
        points: 500,
      },

      // Level badges
      {
        name: 'Rising Star',
        description: 'Reach level 5',
        type: BadgeType.LEVEL,
        rarity: BadgeRarity.COMMON,
        criteria: { targetLevel: 5 },
        points: 100,
      },
      {
        name: 'Habit Hero',
        description: 'Reach level 25',
        type: BadgeType.LEVEL,
        rarity: BadgeRarity.RARE,
        criteria: { targetLevel: 25 },
        points: 300,
      },
      {
        name: 'Legend',
        description: 'Reach level 50',
        type: BadgeType.LEVEL,
        rarity: BadgeRarity.LEGENDARY,
        criteria: { targetLevel: 50 },
        points: 1000,
      },

      // Habit count badges
      {
        name: 'Getting Started',
        description: 'Create 3 habits',
        type: BadgeType.HABIT_COUNT,
        rarity: BadgeRarity.COMMON,
        criteria: { targetCount: 3 },
        points: 25,
      },
      {
        name: 'Habit Collector',
        description: 'Create 10 habits',
        type: BadgeType.HABIT_COUNT,
        rarity: BadgeRarity.RARE,
        criteria: { targetCount: 10 },
        points: 150,
      },

      // Category badges
      {
        name: 'Health Enthusiast',
        description: 'Create 3 health-related habits',
        type: BadgeType.CATEGORY,
        rarity: BadgeRarity.COMMON,
        criteria: { category: 'health', targetCount: 3 },
        points: 75,
      },
      {
        name: 'Learning Machine',
        description: 'Create 5 learning habits',
        type: BadgeType.CATEGORY,
        rarity: BadgeRarity.RARE,
        criteria: { category: 'learning', targetCount: 5 },
        points: 250,
      },

      // Social badges
      {
        name: 'Social Butterfly',
        description: 'Add 5 friends',
        type: BadgeType.SOCIAL,
        rarity: BadgeRarity.COMMON,
        criteria: { action: 'add_friend', targetCount: 5 },
        points: 100,
      },

      // Consistency badges
      {
        name: 'Consistent',
        description: 'Complete habits on 10 different days in the last 14 days',
        type: BadgeType.CONSISTENCY,
        rarity: BadgeRarity.COMMON,
        criteria: { targetDays: 10, withinDays: 14 },
        points: 75,
      },
      {
        name: 'Unstoppable',
        description: 'Complete habits on 25 different days in the last 30 days',
        type: BadgeType.CONSISTENCY,
        rarity: BadgeRarity.RARE,
        criteria: { targetDays: 25, withinDays: 30 },
        points: 300,
      },

      // Competitive badges
      {
        name: 'Competitive Spirit',
        description: 'Create or join your first competitive habit',
        type: BadgeType.COMPETITIVE,
        rarity: BadgeRarity.COMMON,
        criteria: { action: 'first_competitive' },
        points: 100,
      },
      {
        name: 'Challenge Champion',
        description: 'Win your first habit challenge',
        type: BadgeType.COMPETITIVE,
        rarity: BadgeRarity.RARE,
        criteria: { action: 'first_win' },
        points: 250,
      },
      {
        name: 'Competition Master',
        description: 'Win 5 habit challenges',
        type: BadgeType.COMPETITIVE,
        rarity: BadgeRarity.EPIC,
        criteria: { action: 'multiple_wins', targetWins: 5 },
        points: 500,
      },
    ];

    for (const badge of defaultBadges) {
      await this.prisma.badge.upsert({
        where: { name: badge.name },
        update: {},
        create: badge,
      });
    }

    this.logger.log('Default badges seeded successfully');
  }
}