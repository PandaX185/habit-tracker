import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BadgeType } from '@prisma/client';
import { defaultBadges } from './badge.consts';

@Injectable()
export class BadgeService {
  private readonly logger = new Logger(BadgeService.name);

  constructor(private prisma: PrismaService) { }

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