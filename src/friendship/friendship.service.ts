import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FriendshipStatus } from '@prisma/client';

@Injectable()
export class FriendshipService {
  constructor(private readonly prisma: PrismaService) {}

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
    return this.prisma.friendship.update({
      where: { id: requestId },
      data: { status: FriendshipStatus.ACCEPTED },
    });
  }

  // - declineFriendRequest
  async declineFriendRequest(requestId: string) {
    return this.prisma.friendship.delete({
      where: { id: requestId },
    });
  }

  // - getFriends
  async getFriends(userId: string) {
    return this.prisma.friendship.findMany({
      where: {
        userId,
        status: FriendshipStatus.ACCEPTED,
      },
      include: {
        friend: true,
      },
    });
  }

  // - getPendingRequests
  async getPendingRequests(userId: string) {
    return this.prisma.friendship.findMany({
      where: {
        userId,
        status: FriendshipStatus.PENDING,
      },
      include: {
        friend: true,
      },
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
}