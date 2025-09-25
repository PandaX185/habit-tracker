import { Controller, Get, Post, Delete, Param, UseGuards, Req } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth
} from '@nestjs/swagger';
import { FriendshipService } from './friendship.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FriendRequestResponseDto, FriendshipResponseDto } from './friendship.dto';

interface RequestWithUser extends Request {
  user: {
    userId: string;
    email: string;
    username: string;
    fullname: string;
    avatarUrl?: string;
  };
}

@ApiTags('friendship')
@ApiBearerAuth('JWT-auth')
@Controller('friendship')
@UseGuards(JwtAuthGuard)
export class FriendshipController {
  constructor(private readonly friendshipService: FriendshipService) {}

  @Post('request/:userId')
  @ApiOperation({
    summary: 'Send a friend request',
    description: 'Send a friend request to another user. The friendship will be established once the other user accepts the request.'
  })
  @ApiParam({
    name: 'userId',
    description: 'ID of the user to send the friend request to',
    example: '123e4567-e89b-12d3-a456-426614174001'
  })
  @ApiResponse({
    status: 201,
    description: 'Friend request sent successfully',
    type: FriendRequestResponseDto
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid user ID or request already exists'
  })
  @ApiResponse({
    status: 404,
    description: 'User not found'
  })
  async sendFriendRequest(@Req() req: RequestWithUser, @Param('userId') userId: string) {
    const fromUserId = req.user.userId;
    return this.friendshipService.sendFriendRequest(fromUserId, userId);
  }

  @Post('accept/:requestId')
  @ApiOperation({
    summary: 'Accept a friend request',
    description: 'Accept a pending friend request to establish a friendship.'
  })
  @ApiParam({
    name: 'requestId',
    description: 'ID of the friend request to accept',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiResponse({
    status: 200,
    description: 'Friend request accepted successfully',
    type: FriendshipResponseDto
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid request ID or request not pending'
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - can only accept requests sent to you'
  })
  @ApiResponse({
    status: 404,
    description: 'Friend request not found'
  })
  async acceptFriendRequest(@Param('requestId') requestId: string) {
    return this.friendshipService.acceptFriendRequest(requestId);
  }

  @Post('decline/:requestId')
  @ApiOperation({
    summary: 'Decline a friend request',
    description: 'Decline a pending friend request. The request will be marked as declined.'
  })
  @ApiParam({
    name: 'requestId',
    description: 'ID of the friend request to decline',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiResponse({
    status: 200,
    description: 'Friend request declined successfully'
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid request ID'
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - can only decline requests sent to you'
  })
  @ApiResponse({
    status: 404,
    description: 'Friend request not found'
  })
  async declineFriendRequest(@Param('requestId') requestId: string) {
    return this.friendshipService.declineFriendRequest(requestId);
  }

  @Get('friends')
  @ApiOperation({
    summary: 'Get user\'s friends',
    description: 'Retrieve the list of friends for the authenticated user.'
  })
  @ApiResponse({
    status: 200,
    description: 'List of friends retrieved successfully',
    type: [FriendshipResponseDto]
  })
  async getFriends(@Req() req: RequestWithUser) {
    const userId = req.user.userId;
    return this.friendshipService.getFriends(userId);
  }

  @Get('requests')
  @ApiOperation({
    summary: 'Get pending friend requests',
    description: 'Retrieve pending friend requests received by the authenticated user.'
  })
  @ApiResponse({
    status: 200,
    description: 'Pending friend requests retrieved successfully',
    type: [FriendRequestResponseDto]
  })
  async getPendingRequests(@Req() req: RequestWithUser) {
    const userId = req.user.userId;
    return this.friendshipService.getPendingRequests(userId);
  }

  @Delete('friends/:userId')
  @ApiOperation({
    summary: 'Remove a friend',
    description: 'Remove an existing friendship with another user.'
  })
  @ApiParam({
    name: 'userId',
    description: 'ID of the friend to remove',
    example: '123e4567-e89b-12d3-a456-426614174001'
  })
  @ApiResponse({
    status: 200,
    description: 'Friend removed successfully'
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid user ID'
  })
  @ApiResponse({
    status: 404,
    description: 'Friendship not found'
  })
  async removeFriend(@Req() req: RequestWithUser, @Param('userId') userId: string) {
    const fromUserId = req.user.userId;
    return this.friendshipService.removeFriend(fromUserId, userId);
  }
}