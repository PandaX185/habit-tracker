import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth
} from '@nestjs/swagger';
import { StatsService } from './stats.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { LeaderboardResponseDto, UserDetailedStatsDto } from './stats.dto';

interface RequestWithUser extends Request {
  user: {
    userId: string;
    email: string;
    username: string;
    fullname: string;
    avatarUrl?: string;
  };
}

@ApiTags('stats')
@ApiBearerAuth('JWT-auth')
@Controller('stats')
@UseGuards(JwtAuthGuard)
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('leaderboard')
  @ApiOperation({
    summary: 'Get friends leaderboard',
    description: 'Retrieve a leaderboard showing the current user and their friends ranked by XP points, including habit statistics and streaks.'
  })
  @ApiResponse({
    status: 200,
    description: 'Leaderboard retrieved successfully',
    type: LeaderboardResponseDto
  })
  async getFriendsLeaderboard(@Req() req: RequestWithUser) {
    const userId = req.user.userId;
    return this.statsService.getFriendsLeaderboard(userId);
  }

  @Get('me')
  @ApiOperation({
    summary: 'Get detailed user statistics',
    description: 'Retrieve comprehensive statistics for the authenticated user including habit stats, level progress, and achievements.'
  })
  @ApiResponse({
    status: 200,
    description: 'User statistics retrieved successfully',
    type: UserDetailedStatsDto
  })
  async getUserDetailedStats(@Req() req: RequestWithUser) {
    const userId = req.user.userId;
    return this.statsService.getUserDetailedStats(userId);
  }
}