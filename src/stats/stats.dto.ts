// DTOs for stats and leaderboard operations
import { ApiProperty } from '@nestjs/swagger';

export class UserStatsDto {
  @ApiProperty({
    description: 'Unique identifier of the user',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  id: string;

  @ApiProperty({
    description: 'Username of the user',
    example: 'john_doe'
  })
  username: string;

  @ApiProperty({
    description: 'Full name of the user',
    example: 'John Doe'
  })
  fullname: string;

  @ApiProperty({
    description: 'Avatar URL of the user',
    example: 'https://example.com/avatar.jpg',
    nullable: true
  })
  avatarUrl?: string;

  @ApiProperty({
    description: 'Current level of the user',
    example: 5
  })
  level: number;

  @ApiProperty({
    description: 'Total XP points earned by the user',
    example: 1250
  })
  xpPoints: number;

  @ApiProperty({
    description: 'Whether this user is the current authenticated user',
    example: true
  })
  isCurrentUser: boolean;

  @ApiProperty({
    description: 'Total number of habits created by the user',
    example: 8
  })
  totalHabits: number;

  @ApiProperty({
    description: 'Number of currently active habits',
    example: 6
  })
  activeHabits: number;

  @ApiProperty({
    description: 'Total number of habit completions',
    example: 245
  })
  totalCompletions: number;

  @ApiProperty({
    description: 'Sum of current streaks across all habits',
    example: 42
  })
  currentTotalStreak: number;

  @ApiProperty({
    description: 'Sum of longest streaks across all habits',
    example: 67
  })
  longestTotalStreak: number;

  @ApiProperty({
    description: 'Average points per habit',
    example: 15.5
  })
  averagePointsPerHabit: number;

  @ApiProperty({
    description: 'Completion rate percentage over the last 30 days',
    example: 78.5
  })
  completionRate: number;
}

export class LeaderboardResponseDto {
  @ApiProperty({
    description: 'Array of users ranked by XP points',
    type: [UserStatsDto]
  })
  leaderboard: UserStatsDto[];

  @ApiProperty({
    description: 'Total number of friends',
    example: 12
  })
  totalFriends: number;

  @ApiProperty({
    description: 'Current user\'s rank in the leaderboard (1-based)',
    example: 3
  })
  userRank: number;
}

export class LevelProgressDto {
  @ApiProperty({
    description: 'Current level of the user',
    example: 5
  })
  currentLevel: number;

  @ApiProperty({
    description: 'XP points required to reach current level',
    example: 400
  })
  xpForCurrentLevel: number;

  @ApiProperty({
    description: 'XP points required to reach next level',
    example: 500
  })
  xpForNextLevel: number;

  @ApiProperty({
    description: 'XP points earned in current level',
    example: 50
  })
  progressInLevel: number;

  @ApiProperty({
    description: 'XP points needed to reach next level',
    example: 50
  })
  xpNeededForNextLevel: number;

  @ApiProperty({
    description: 'Progress percentage in current level',
    example: 50.0
  })
  progressPercentage: number;
}

export class UserDetailedStatsDto {
  @ApiProperty({
    description: 'Basic user information',
    type: 'object',
    properties: {
      id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
      username: { type: 'string', example: 'john_doe' },
      fullname: { type: 'string', example: 'John Doe' },
      avatarUrl: { type: 'string', example: 'https://example.com/avatar.jpg', nullable: true },
      level: { type: 'number', example: 5 },
      xpPoints: { type: 'number', example: 1250 }
    }
  })
  user: {
    id: string;
    username: string;
    fullname: string;
    avatarUrl?: string;
    level: number;
    xpPoints: number;
  };

  @ApiProperty({
    description: 'Detailed habit statistics',
    type: 'object',
    properties: {
      totalHabits: { type: 'number', example: 8 },
      activeHabits: { type: 'number', example: 6 },
      totalCompletions: { type: 'number', example: 245 },
      currentTotalStreak: { type: 'number', example: 42 },
      longestTotalStreak: { type: 'number', example: 67 },
      averagePointsPerHabit: { type: 'number', example: 15.5 },
      completionRate: { type: 'number', example: 78.5 }
    }
  })
  stats: {
    totalHabits: number;
    activeHabits: number;
    totalCompletions: number;
    currentTotalStreak: number;
    longestTotalStreak: number;
    averagePointsPerHabit: number;
    completionRate: number;
  };

  @ApiProperty({
    description: 'Level progress information',
    type: LevelProgressDto
  })
  levelProgress: LevelProgressDto;
}