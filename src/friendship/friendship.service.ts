import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BadgeService } from '../badges/badge.service';
import { FriendshipStatus } from '@prisma/client';

@Injectable()
export class FriendshipService {
  private readonly logger = new Logger(FriendshipService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly badgeService: BadgeService,
  ) {}

  // - sendFriendRequest
  async sendFriendRequest(fromUserId: string, toUserId: string) {
    return this.prisma.friendship.create({
      data: {
        user: { connect: { id: fromUserId } },
        friend: { connect: { id: toUserId } },
      },
    });
  }
  // - acceptFriendRequest
  async acceptFriendRequest(requestId: string) {
    const friendship = await this.prisma.friendship.update({
      where: { id: requestId },
      data: { status: FriendshipStatus.ACCEPTED },
    });

    // Check for social badges for both users
    try {
      await this.badgeService.checkAndAwardBadges(friendship.userId, 'friend_added');
      await this.badgeService.checkAndAwardBadges(friendship.friendId, 'friend_added');
    } catch (error) {
      this.logger.error(`Failed to check badges for friendship acceptance ${requestId}:`, error);
    }

    return friendship;
  }

  // - declineFriendRequest
  async declineFriendRequest(requestId: string) {
    return this.prisma.friendship.delete({
      where: { id: requestId },
    });
  }

  // - getFriends
  async getFriends(userId: string) {
    const friendships = await this.prisma.friendship.findMany({
      where: {
        OR: [
          { userId },
          { friendId: userId },
        ],
        status: FriendshipStatus.ACCEPTED,
      },
      include: {
        friend: {
          select: {
            id: true,
            username: true,
            email: true,
            fullname: true,
            avatarUrl: true,
          },
        },
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            fullname: true,
            avatarUrl: true,
          },
        },
      },
    });

    // Only return the other user's data
    return friendships.map(f => {
      const otherUser = f.userId === userId ? f.friend : f.user;
      return {
        id: otherUser.id,
        username: otherUser.username,
        email: otherUser.email,
        fullname: otherUser.fullname,
        avatarUrl: otherUser.avatarUrl,
      };
    });
  }

  // - getPendingRequests
  async getPendingRequests(userId: string) {
    const requests = await this.prisma.friendship.findMany({
      where: {
        OR: [
          { userId },
          { friendId: userId },
        ],
        status: FriendshipStatus.PENDING,
      },
      include: {
        friend: {
          select: {
            id: true,
            username: true,
            email: true,
            fullname: true,
            avatarUrl: true,
          },
        },
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            fullname: true,
            avatarUrl: true,
          },
        },
      },
    });

    // Only return the other user's data
    return requests.map(f => {
      const otherUser = f.userId === userId ? f.friend : f.user;
      return {
        id: otherUser.id,
        username: otherUser.username,
        email: otherUser.email,
        fullname: otherUser.fullname,
        avatarUrl: otherUser.avatarUrl,
      };
    });
  }

  // - removeFriend
  async removeFriend(userId: string, friendId: string) {
    return this.prisma.friendship.deleteMany({
      where: {
        userId,
        friendId,
        status: FriendshipStatus.ACCEPTED,
      },
    });
  }

  async searchUsers(query: string) {
    return this.prisma.user.findMany({
      where: {
        OR: [
          { username: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
          { fullname: { contains: query, mode: 'insensitive' } },
        ],
      },
      select: {
        id: true,
        username: true,
        email: true,
        fullname: true,
        avatarUrl: true,
      },
    });
  }
}