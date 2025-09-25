// DTOs for competitive habits operations
import { ApiProperty } from '@nestjs/swagger';

export class CreateCompetitiveHabitDto {
  @ApiProperty({
    description: 'Title of the competitive habit',
    example: 'Morning Run Challenge'
  })
  title: string;

  @ApiProperty({
    description: 'Description of the habit',
    example: 'Run for at least 30 minutes every morning',
    required: false
  })
  description?: string;

  @ApiProperty({
    description: 'How often the habit should be repeated',
    example: 1,
    minimum: 1
  })
  repetitionInterval: number;

  @ApiProperty({
    description: 'Unit for repetition (days, weeks, months)',
    example: 'days',
    enum: ['days', 'weeks', 'months']
  })
  repetitionUnit: string;

  @ApiProperty({
    description: 'XP points awarded for completing this habit',
    example: 20,
    minimum: 1
  })
  points: number;

  @ApiProperty({
    description: 'Difficulty level (1-5)',
    example: 3,
    minimum: 1,
    maximum: 5,
    required: false
  })
  difficulty?: number;

  @ApiProperty({
    description: 'Maximum number of participants (null = unlimited)',
    example: 10,
    minimum: 2,
    required: false
  })
  maxParticipants?: number;
}

export class InviteToHabitDto {
  @ApiProperty({
    description: 'ID of the user to invite',
    example: '123e4567-e89b-12d3-a456-426614174001'
  })
  userId: string;
}

export class CompetitiveHabitDto {
  @ApiProperty({
    description: 'Unique identifier of the habit',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  id: string;

  @ApiProperty({
    description: 'Title of the habit',
    example: 'Morning Run Challenge'
  })
  title: string;

  @ApiProperty({
    description: 'Description of the habit',
    example: 'Run for at least 30 minutes every morning'
  })
  description: string | null;

  @ApiProperty({
    description: 'Repetition interval',
    example: 1
  })
  repetitionInterval: number;

  @ApiProperty({
    description: 'Repetition unit',
    example: 'days'
  })
  repetitionUnit: string;

  @ApiProperty({
    description: 'XP points per completion',
    example: 20
  })
  points: number;

  @ApiProperty({
    description: 'ID of the habit owner',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  userId: string;

  @ApiProperty({
    description: 'Whether this is a competitive habit',
    example: true
  })
  isCompetitive: boolean;

  @ApiProperty({
    description: 'Maximum number of participants',
    example: 10
  })
  maxParticipants: number | null;

  @ApiProperty({
    description: 'Difficulty level',
    example: 3
  })
  difficulty: number | null;

  @ApiProperty({
    description: 'Whether the habit is currently active',
    example: true
  })
  isActive: boolean;

  @ApiProperty({
    description: 'When the habit was created',
    example: '2025-01-15T10:30:00.000Z'
  })
  createdAt: Date;

  @ApiProperty({
    description: 'When the habit was last updated',
    example: '2025-01-15T10:30:00.000Z'
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'List of participants',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        userId: { type: 'string' },
        status: { type: 'string', enum: ['PENDING', 'ACCEPTED', 'DECLINED', 'REMOVED'] },
        joinedAt: { type: 'string', format: 'date-time' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            username: { type: 'string' },
            fullname: { type: 'string' },
            avatarUrl: { type: 'string' }
          }
        }
      }
    }
  })
  participants: any[];

  @ApiProperty({
    description: 'Total number of participants',
    example: 5
  })
  participantCount: number;

  @ApiProperty({
    description: 'Whether the current user is the owner',
    example: true
  })
  isOwner: boolean;
}

export class HabitParticipantDto {
  @ApiProperty({
    description: 'Participant record ID',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  participantId: string;

  @ApiProperty({
    description: 'User information',
    type: 'object',
    properties: {
      id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174001' },
      username: { type: 'string', example: 'john_doe' },
      fullname: { type: 'string', example: 'John Doe' },
      avatarUrl: { type: 'string', example: 'https://example.com/avatar.jpg' },
      level: { type: 'number', example: 5 }
    }
  })
  user: {
    id: string;
    username: string;
    fullname: string;
    avatarUrl?: string;
    level: number;
  };

  @ApiProperty({
    description: 'Total completions by this participant',
    example: 25
  })
  totalCompletions: number;

  @ApiProperty({
    description: 'Completions in the last 30 days',
    example: 15
  })
  recentCompletions: number;

  @ApiProperty({
    description: 'Current streak',
    example: 7
  })
  currentStreak: number;

  @ApiProperty({
    description: 'When the user joined the habit',
    example: '2025-01-15T10:30:00.000Z'
  })
  joinedAt: Date;

  @ApiProperty({
    description: 'Whether this is the current user',
    example: false
  })
  isCurrentUser: boolean;
}

export class HabitLeaderboardDto {
  @ApiProperty({
    description: 'ID of the habit',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  habitId: string;

  @ApiProperty({
    description: 'Participants ranked by completions',
    type: [HabitParticipantDto]
  })
  leaderboard: HabitParticipantDto[];

  @ApiProperty({
    description: 'Total number of participants',
    example: 8
  })
  totalParticipants: number;

  @ApiProperty({
    description: 'Current user\'s rank (1-based)',
    example: 3
  })
  userRank: number;
}