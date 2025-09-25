import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class CompetitiveService {
  constructor(private readonly prisma: PrismaService) {}

  // Create a competitive habit
  async createCompetitiveHabit(
    ownerId: string,
    habitData: {
      title: string;
      description?: string;
      repetitionInterval: number;
      repetitionUnit: string;
      points: number;
      difficulty?: number;
      maxParticipants?: number;
    }
  ) {
    return this.prisma.habit.create({
      data: {
        ...habitData,
        userId: ownerId,
        isCompetitive: true,
        maxParticipants: habitData.maxParticipants,
        // Owner automatically becomes a participant
        participants: {
          create: {
            userId: ownerId,
            status: 'ACCEPTED',
            joinedAt: new Date(),
          }
        }
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                fullname: true,
                avatarUrl: true,
              }
            }
          }
        }
      }
    });
  }

  // Invite a user to a competitive habit
  async inviteToHabit(habitId: string, ownerId: string, inviteeId: string) {
    // Check if habit exists and is competitive
    const habit = await this.prisma.habit.findFirst({
      where: {
        id: habitId,
        userId: ownerId,
        isCompetitive: true,
      }
    });

    if (!habit) {
      throw new NotFoundException('Competitive habit not found or you are not the owner');
    }

    // Check if max participants limit is reached
    if (habit.maxParticipants) {
      const participantCount = await this.prisma.habitParticipant.count({
        where: {
          habitId,
          status: 'ACCEPTED'
        }
      });

      if (participantCount >= habit.maxParticipants) {
        throw new BadRequestException('Maximum participants limit reached');
      }
    }

    // Check if user is already invited or participating
    const existingParticipant = await this.prisma.habitParticipant.findUnique({
      where: {
        habitId_userId: {
          habitId,
          userId: inviteeId,
        }
      }
    });

    if (existingParticipant) {
      if (existingParticipant.status === 'ACCEPTED') {
        throw new BadRequestException('User is already participating in this habit');
      } else if (existingParticipant.status === 'PENDING') {
        throw new BadRequestException('User is already invited to this habit');
      }
    }

    // Check if users are friends (optional - you might want to restrict to friends only)
    const friendship = await this.prisma.friendship.findFirst({
      where: {
        OR: [
          { userId: ownerId, friendId: inviteeId, status: 'ACCEPTED' },
          { userId: inviteeId, friendId: ownerId, status: 'ACCEPTED' }
        ]
      }
    });

    if (!friendship) {
      throw new BadRequestException('You can only invite friends to competitive habits');
    }

    // Create invitation
    return this.prisma.habitParticipant.create({
      data: {
        habitId,
        userId: inviteeId,
        status: 'PENDING',
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            fullname: true,
            avatarUrl: true,
          }
        },
        habit: {
          select: {
            id: true,
            title: true,
            description: true,
          }
        }
      }
    });
  }

  // Accept invitation to competitive habit
  async acceptInvitation(participantId: string, userId: string) {
    const participant = await this.prisma.habitParticipant.findFirst({
      where: {
        id: participantId,
        userId,
        status: 'PENDING',
      }
    });

    if (!participant) {
      throw new NotFoundException('Invitation not found or already processed');
    }

    return this.prisma.habitParticipant.update({
      where: { id: participantId },
      data: {
        status: 'ACCEPTED',
        joinedAt: new Date(),
      },
      include: {
        habit: {
          select: {
            id: true,
            title: true,
            description: true,
            points: true,
            repetitionInterval: true,
            repetitionUnit: true,
          }
        }
      }
    });
  }

  // Decline invitation to competitive habit
  async declineInvitation(participantId: string, userId: string) {
    const participant = await this.prisma.habitParticipant.findFirst({
      where: {
        id: participantId,
        userId,
        status: 'PENDING',
      }
    });

    if (!participant) {
      throw new NotFoundException('Invitation not found');
    }

    return this.prisma.habitParticipant.update({
      where: { id: participantId },
      data: { status: 'DECLINED' }
    });
  }

  // Get habit leaderboard (participants only)
  async getHabitLeaderboard(habitId: string, userId: string) {
    // Check if user is a participant
    const userParticipant = await this.prisma.habitParticipant.findFirst({
      where: {
        habitId,
        userId,
        status: 'ACCEPTED',
      }
    });

    if (!userParticipant) {
      throw new ForbiddenException('You are not a participant in this habit');
    }

    // Get all accepted participants
    const participants = await this.prisma.habitParticipant.findMany({
      where: {
        habitId,
        status: 'ACCEPTED',
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            fullname: true,
            avatarUrl: true,
            level: true,
          }
        },
        completions: {
          orderBy: { completedAt: 'desc' },
          take: 100, // Limit for performance
        }
      }
    });

    // Calculate stats for each participant
    const leaderboard = participants.map(participant => {
      const completions = participant.completions.length;
      const recentCompletions = participant.completions.filter(c => {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return c.completedAt >= thirtyDaysAgo;
      }).length;

      // Calculate streak (simplified - in a real app you'd want more sophisticated logic)
      let currentStreak = 0;
      const sortedCompletions = participant.completions
        .sort((a, b) => b.completedAt.getTime() - a.completedAt.getTime());

      // This is a simplified streak calculation - you'd want to make it more robust
      for (let i = 0; i < sortedCompletions.length - 1; i++) {
        const current = sortedCompletions[i];
        const next = sortedCompletions[i + 1];
        const diffTime = current.completedAt.getTime() - next.completedAt.getTime();
        const diffDays = diffTime / (1000 * 60 * 60 * 24);

        if (diffDays <= 1) { // Allow for same day or next day
          currentStreak++;
        } else {
          break;
        }
      }

      return {
        participantId: participant.id,
        user: participant.user,
        totalCompletions: completions,
        recentCompletions,
        currentStreak,
        joinedAt: participant.joinedAt,
        isCurrentUser: participant.userId === userId,
      };
    });

    // Sort by total completions (descending)
    leaderboard.sort((a, b) => b.totalCompletions - a.totalCompletions);

    return {
      habitId,
      leaderboard,
      totalParticipants: participants.length,
      userRank: leaderboard.findIndex(p => p.isCurrentUser) + 1,
    };
  }

  // Complete a competitive habit
  async completeCompetitiveHabit(habitId: string, userId: string, notes?: string) {
    // Check if user is a participant
    const participant = await this.prisma.habitParticipant.findFirst({
      where: {
        habitId,
        userId,
        status: 'ACCEPTED',
      }
    });

    if (!participant) {
      throw new ForbiddenException('You are not a participant in this habit');
    }

    const habit = await this.prisma.habit.findUnique({
      where: { id: habitId }
    });

    if (!habit || !habit.isCompetitive) {
      throw new NotFoundException('Competitive habit not found');
    }

    // Check if already completed today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const existingCompletion = await this.prisma.habitCompletion.findFirst({
      where: {
        habitId,
        userId,
        completedAt: {
          gte: today,
          lt: tomorrow,
        }
      }
    });

    if (existingCompletion) {
      throw new BadRequestException('Habit already completed today');
    }

    // Create completion
    const completion = await this.prisma.habitCompletion.create({
      data: {
        habitId,
        userId,
        participantId: participant.id,
        notes,
      }
    });

    // Award XP to user
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { xpPoints: true }
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const newXpPoints = user.xpPoints + habit.points;
    const newLevel = Math.floor(newXpPoints / 100) + 1;

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        xpPoints: newXpPoints,
        level: newLevel,
      }
    });

    return completion;
  }

  // Get user's competitive habits
  async getUserCompetitiveHabits(userId: string) {
    const habits = await this.prisma.habit.findMany({
      where: {
        isCompetitive: true,
        participants: {
          some: {
            userId,
            status: 'ACCEPTED',
          }
        }
      },
      include: {
        participants: {
          where: { status: 'ACCEPTED' },
          include: {
            user: {
              select: {
                id: true,
                username: true,
                fullname: true,
                avatarUrl: true,
              }
            }
          }
        },
        user: { // Owner
          select: {
            id: true,
            username: true,
            fullname: true,
          }
        }
      }
    });

    return habits.map(habit => ({
      ...habit,
      participantCount: habit.participants.length,
      isOwner: habit.userId === userId,
    }));
  }

  // Get pending invitations for user
  async getPendingInvitations(userId: string) {
    return this.prisma.habitParticipant.findMany({
      where: {
        userId,
        status: 'PENDING',
      },
      include: {
        habit: {
          include: {
            user: { // Owner info
              select: {
                id: true,
                username: true,
                fullname: true,
                avatarUrl: true,
              }
            }
          }
        }
      }
    });
  }
}