// DTOs for friendship operations
import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class SendFriendRequestDto {
  // No additional fields needed - target user ID comes from URL param
  // But we can add validation for the URL parameter in the controller
}

export class FriendRequestResponseDto {
  @ApiProperty({
    description: 'Unique identifier of the friend request',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  id: string;

  @ApiProperty({
    description: 'ID of the user who sent the friend request',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  fromUserId: string;

  @ApiProperty({
    description: 'ID of the user who received the friend request',
    example: '123e4567-e89b-12d3-a456-426614174001'
  })
  toUserId: string;

  @ApiProperty({
    description: 'Current status of the friend request',
    enum: ['pending', 'accepted'],
    example: 'pending'
  })
  status: 'pending' | 'accepted';

  @ApiProperty({
    description: 'When the friend request was created',
    example: '2025-01-15T10:30:00.000Z'
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Information about the user who sent the request',
    type: 'object',
    properties: {
      id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
      username: { type: 'string', example: 'john_doe' },
      fullname: { type: 'string', example: 'John Doe' },
      avatarUrl: { type: 'string', example: 'https://example.com/avatar.jpg', nullable: true }
    }
  })
  fromUser: {
    id: string;
    username: string;
    fullname: string;
    avatarUrl?: string;
  };
}

export class FriendshipResponseDto {
  @ApiProperty({
    description: 'Unique identifier of the friendship',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  id: string;

  @ApiProperty({
    description: 'ID of the first user in the friendship',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  userId: string;

  @ApiProperty({
    description: 'ID of the second user in the friendship',
    example: '123e4567-e89b-12d3-a456-426614174001'
  })
  friendId: string;

  @ApiProperty({
    description: 'When the friendship was established',
    example: '2025-01-15T10:30:00.000Z'
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Information about the friend',
    type: 'object',
    properties: {
      id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174001' },
      username: { type: 'string', example: 'jane_smith' },
      fullname: { type: 'string', example: 'Jane Smith' },
      avatarUrl: { type: 'string', example: 'https://example.com/avatar2.jpg', nullable: true },
      level: { type: 'number', example: 5 },
      xpPoints: { type: 'number', example: 1250 }
    }
  })
  friend: {
    id: string;
    username: string;
    fullname: string;
    avatarUrl?: string;
    level: number;
    xpPoints: number;
  };
}

export class FriendshipStatsDto {
  @ApiProperty({
    description: 'Total number of friends',
    example: 12
  })
  totalFriends: number;

  @ApiProperty({
    description: 'Number of pending friend requests received',
    example: 3
  })
  pendingRequests: number;

  @ApiProperty({
    description: 'Number of friend requests sent',
    example: 5
  })
  sentRequests: number;
}