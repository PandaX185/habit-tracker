import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { BadgeService } from './badge.service';
import { BadgeProgressDto } from './badge.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

interface RequestWithUser extends Request {
  user: {
    userId: string;
    email: string;
    username: string;
    fullname: string;
    avatarUrl?: string;
  };
}

@ApiTags('badges')
@Controller('badges')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class BadgeController {
  constructor(private readonly badgeService: BadgeService) {}

  @Get()
  @ApiOperation({ summary: 'Get all available badges' })
  @ApiResponse({ status: 200, description: 'List of all badges' })
  async getAllBadges() {
    return this.badgeService.getAllBadges();
  }

  @Get('my-badges')
  @ApiOperation({ summary: 'Get current user\'s earned badges' })
  @ApiResponse({ status: 200, description: 'List of user\'s earned badges' })
  async getMyBadges(@Req() req: RequestWithUser) {
    return this.badgeService.getUserBadges(req.user.userId);
  }

  @Get('progress')
  @ApiOperation({ summary: 'Get current user\'s badge progress' })
  @ApiResponse({ status: 200, description: 'List of badge progress for unearned badges' })
  async getBadgeProgress(@Req() req: RequestWithUser): Promise<BadgeProgressDto[]> {
    return this.badgeService.getBadgeProgress(req.user.userId);
  }

  @Get('seed')
  @ApiOperation({ summary: 'Seed default badges (admin only)' })
  @ApiResponse({ status: 200, description: 'Badges seeded successfully' })
  async seedBadges() {
    await this.badgeService.seedDefaultBadges();
    return { message: 'Badges seeded successfully' };
  }
}