import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Req } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth
} from '@nestjs/swagger';
import { CompetitiveService } from './competitive.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  CreateCompetitiveHabitDto,
  InviteToHabitDto,
  HabitLeaderboardDto,
  CompetitiveHabitDto
} from './competitive.dto';

interface RequestWithUser extends Request {
  user: {
    userId: string;
    email: string;
    username: string;
    fullname: string;
    avatarUrl?: string;
  };
}

@ApiTags('competitive')
@ApiBearerAuth('JWT-auth')
@Controller('competitive')
@UseGuards(JwtAuthGuard)
export class CompetitiveController {
  constructor(private readonly competitiveService: CompetitiveService) {}

  @Post('habits')
  @ApiOperation({
    summary: 'Create a competitive habit',
    description: 'Create a new habit that multiple users can participate in competitively.'
  })
  @ApiBody({ type: CreateCompetitiveHabitDto })
  @ApiResponse({
    status: 201,
    description: 'Competitive habit created successfully',
    type: CompetitiveHabitDto
  })
  async createCompetitiveHabit(
    @Req() req: RequestWithUser,
    @Body() createHabitDto: CreateCompetitiveHabitDto
  ) {
    const userId = req.user.userId;
    return this.competitiveService.createCompetitiveHabit(userId, createHabitDto);
  }

  @Post('habits/:habitId/invite/:userId')
  @ApiOperation({
    summary: 'Invite user to competitive habit',
    description: 'Invite another user to join a competitive habit you own.'
  })
  @ApiParam({
    name: 'habitId',
    description: 'ID of the competitive habit',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiParam({
    name: 'userId',
    description: 'ID of the user to invite',
    example: '123e4567-e89b-12d3-a456-426614174001'
  })
  @ApiResponse({
    status: 201,
    description: 'Invitation sent successfully'
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - you are not the owner of this habit'
  })
  @ApiResponse({
    status: 404,
    description: 'Habit or user not found'
  })
  async inviteToHabit(
    @Req() req: RequestWithUser,
    @Param('habitId') habitId: string,
    @Param('userId') userId: string
  ) {
    const ownerId = req.user.userId;
    return this.competitiveService.inviteToHabit(habitId, ownerId, userId);
  }

  @Post('invitations/:participantId/accept')
  @ApiOperation({
    summary: 'Accept competitive habit invitation',
    description: 'Accept an invitation to join a competitive habit.'
  })
  @ApiParam({
    name: 'participantId',
    description: 'ID of the habit participant record',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiResponse({
    status: 200,
    description: 'Invitation accepted successfully'
  })
  @ApiResponse({
    status: 404,
    description: 'Invitation not found'
  })
  async acceptInvitation(
    @Req() req: RequestWithUser,
    @Param('participantId') participantId: string
  ) {
    const userId = req.user.userId;
    return this.competitiveService.acceptInvitation(participantId, userId);
  }

  @Post('invitations/:participantId/decline')
  @ApiOperation({
    summary: 'Decline competitive habit invitation',
    description: 'Decline an invitation to join a competitive habit.'
  })
  @ApiParam({
    name: 'participantId',
    description: 'ID of the habit participant record',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiResponse({
    status: 200,
    description: 'Invitation declined successfully'
  })
  async declineInvitation(
    @Req() req: RequestWithUser,
    @Param('participantId') participantId: string
  ) {
    const userId = req.user.userId;
    return this.competitiveService.declineInvitation(participantId, userId);
  }

  @Get('habits/:habitId/leaderboard')
  @ApiOperation({
    summary: 'Get habit leaderboard',
    description: 'Retrieve the leaderboard for a specific competitive habit showing all participants ranked by completions.'
  })
  @ApiParam({
    name: 'habitId',
    description: 'ID of the competitive habit',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiResponse({
    status: 200,
    description: 'Leaderboard retrieved successfully',
    type: HabitLeaderboardDto
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - you are not a participant in this habit'
  })
  async getHabitLeaderboard(
    @Req() req: RequestWithUser,
    @Param('habitId') habitId: string
  ) {
    const userId = req.user.userId;
    return this.competitiveService.getHabitLeaderboard(habitId, userId);
  }

  @Post('habits/:habitId/complete')
  @ApiOperation({
    summary: 'Complete competitive habit',
    description: 'Mark a competitive habit as completed for today and earn XP.'
  })
  @ApiParam({
    name: 'habitId',
    description: 'ID of the competitive habit',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        notes: {
          type: 'string',
          description: 'Optional notes about the completion',
          example: 'Did an extra 10 minutes today!'
        }
      }
    }
  })
  @ApiResponse({
    status: 201,
    description: 'Habit completed successfully'
  })
  @ApiResponse({
    status: 400,
    description: 'Habit already completed today'
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - you are not a participant in this habit'
  })
  async completeCompetitiveHabit(
    @Req() req: RequestWithUser,
    @Param('habitId') habitId: string,
    @Body() body?: { notes?: string }
  ) {
    const userId = req.user.userId;
    return this.competitiveService.completeCompetitiveHabit(habitId, userId, body?.notes);
  }

  @Get('habits')
  @ApiOperation({
    summary: 'Get user\'s competitive habits',
    description: 'Retrieve all competitive habits the user is participating in.'
  })
  @ApiResponse({
    status: 200,
    description: 'Competitive habits retrieved successfully',
    type: [CompetitiveHabitDto]
  })
  async getUserCompetitiveHabits(@Req() req: RequestWithUser) {
    const userId = req.user.userId;
    return this.competitiveService.getUserCompetitiveHabits(userId);
  }

  @Get('invitations/pending')
  @ApiOperation({
    summary: 'Get pending invitations',
    description: 'Retrieve all pending invitations to competitive habits for the current user.'
  })
  @ApiResponse({
    status: 200,
    description: 'Pending invitations retrieved successfully'
  })
  async getPendingInvitations(@Req() req: RequestWithUser) {
    const userId = req.user.userId;
    return this.competitiveService.getPendingInvitations(userId);
  }

  @Get('habits/:habitId/check-winner')
  @ApiOperation({
    summary: 'Check challenge winner',
    description: 'Check if the current user is the winner of a specific competitive habit challenge.'
  })
  @ApiParam({
    name: 'habitId',
    description: 'ID of the competitive habit',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiResponse({
    status: 200,
    description: 'Winner check completed successfully',
    schema: {
      type: 'object',
      properties: {
        isWinner: {
          type: 'boolean',
          description: 'Whether the current user is the winner'
        }
      }
    }
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - you are not a participant in this habit'
  })
  async checkChallengeWinner(
    @Req() req: RequestWithUser,
    @Param('habitId') habitId: string
  ) {
    const userId = req.user.userId;
    const isWinner = await this.competitiveService.checkChallengeWinner(habitId, userId);
    return { isWinner };
  }

  @Get('progress')
  @ApiOperation({
    summary: 'Get competitive progress',
    description: 'Get the user\'s competitive habit statistics including wins, participation, and completion counts.'
  })
  @ApiResponse({
    status: 200,
    description: 'Competitive progress retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        totalCompetitiveHabits: {
          type: 'number',
          description: 'Total number of competitive habits participated in'
        },
        totalWins: {
          type: 'number',
          description: 'Total number of challenges won'
        },
        totalCompletions: {
          type: 'number',
          description: 'Total habit completions in competitive habits'
        },
        winRate: {
          type: 'number',
          description: 'Win rate percentage'
        }
      }
    }
  })
  async getCompetitiveProgress(@Req() req: RequestWithUser) {
    const userId = req.user.userId;
    return this.competitiveService.getCompetitiveProgress(userId);
  }
}