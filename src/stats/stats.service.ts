import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StatsService {
  constructor(private readonly prisma: PrismaService) {}

  // Get leaderboard for user's friends including themselves
  async getFriendsLeaderboard(userId: string) {
    // First get all friends of the user
    const friendships = await this.prisma.friendship.findMany({
      where: {
        OR: [
          { userId },
          { friendId: userId }
        ]
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            fullname: true,
            avatarUrl: true,
            level: true,
            xpPoints: true,
          }
        },
        friend: {
          select: {
            id: true,
            username: true,
            fullname: true,
            avatarUrl: true,
            level: true,
            xpPoints: true,
          }
        }
      }
    });

    // Extract unique friend IDs
    const friendIds = new Set<string>();
    friendships.forEach(friendship => {
      if (friendship.userId !== userId) friendIds.add(friendship.userId);
      if (friendship.friendId !== userId) friendIds.add(friendship.friendId);
    });

    // Get current user data
    const currentUser = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        fullname: true,
        avatarUrl: true,
        level: true,
        xpPoints: true,
      }
    });

    // Get friends data
    const friends = await this.prisma.user.findMany({
      where: {
        id: { in: Array.from(friendIds) }
      },
      select: {
        id: true,
        username: true,
        fullname: true,
        avatarUrl: true,
        level: true,
        xpPoints: true,
      }
    });

    // Combine current user and friends
    const allUsers = [currentUser, ...friends].filter(user => user !== null);

    // Get habit stats for each user (streaks, completion rates, etc.)
    const usersWithStats = await Promise.all(
      allUsers.map(async (user) => {
        const habitStats = await this.getUserHabitStats(user.id);
        return {
          ...user,
          ...habitStats,
          isCurrentUser: user.id === userId,
        };
      })
    );

    // Sort by XP points (descending) for leaderboard
    const leaderboard = usersWithStats.sort((a, b) => (b.xpPoints || 0) - (a.xpPoints || 0));

    return {
      leaderboard,
      totalFriends: friends.length,
      userRank: leaderboard.findIndex(user => user.id === userId) + 1,
    };
  }

  // Get detailed stats for a specific user
  async getUserDetailedStats(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        fullname: true,
        avatarUrl: true,
        level: true,
        xpPoints: true,
      }
    });

    if (!user) {
      throw new Error('User not found');
    }

    const habitStats = await this.getUserHabitStats(userId);
    const levelProgress = this.calculateLevelProgress(user.xpPoints);

    return {
      user,
      stats: habitStats,
      levelProgress,
    };
  }

  // Helper method to get habit statistics for a user
  private async getUserHabitStats(userId: string) {
    const habits = await this.prisma.habit.findMany({
      where: { userId },
      select: {
        id: true,
        streak: true,
        longestStreak: true,
        isActive: true,
        _count: {
          select: { completions: true }
        }
      }
    });

    const totalHabits = habits.length;
    const activeHabits = habits.filter(h => h.isActive).length;
    const totalCompletions = habits.reduce((sum, h) => sum + h._count.completions, 0);
    const currentTotalStreak = habits.reduce((sum, h) => sum + h.streak, 0);
    const longestTotalStreak = habits.reduce((sum, h) => sum + h.longestStreak, 0);

    // Calculate completion rate (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentCompletions = await this.prisma.habitCompletion.count({
      where: {
        habit: { userId },
        completedAt: { gte: thirtyDaysAgo }
      }
    });

    const completionRate = totalHabits > 0 ? (recentCompletions / (totalHabits * 30)) * 100 : 0;

    return {
      totalHabits,
      activeHabits,
      totalCompletions,
      currentTotalStreak,
      longestTotalStreak,
      completionRate: Math.round(completionRate * 100) / 100,
    };
  }

  // Helper method to calculate level progress
  private calculateLevelProgress(xpPoints: number) {
    const currentLevel = Math.floor(xpPoints / 10) + 1;
    const xpForCurrentLevel = (currentLevel - 1) * 10;
    const xpForNextLevel = currentLevel * 10;
    const progressInLevel = xpPoints - xpForCurrentLevel;
    const xpNeededForNextLevel = xpForNextLevel - xpPoints;
    const progressPercentage = (progressInLevel / 10) * 100;

    return {
      currentLevel,
      xpForCurrentLevel,
      xpForNextLevel,
      progressInLevel,
      xpNeededForNextLevel,
      progressPercentage: Math.round(progressPercentage * 100) / 100,
    };
  }
}