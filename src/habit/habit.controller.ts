import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { HabitService } from './habit.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  CreateHabitDto,
  UpdateHabitDto,
  HabitResponse,
  CompleteHabitDto,
  HabitCompletionResponse,
  HabitStreakResponse,
  UserTotalStreaksResponse,
  CompletionStatsResponse,
  CalendarDayResponse,
} from './habit.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';

interface RequestWithUser extends Request {
  user: {
    userId: string;
    email: string;
    username: string;
    fullname: string;
    avatarUrl?: string;
  };
}

@ApiTags('habits')
@Controller('habit')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class HabitController {
  constructor(private readonly habitService: HabitService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new habit',
    description: 'Creates a new habit for the authenticated user with specified repetition pattern and rewards.',
  })
  @ApiResponse({
    status: 201,
    description: 'Habit created successfully',
    type: HabitResponse,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation failed',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  create(
    @Body() createHabitDto: CreateHabitDto,
    @Req() req: RequestWithUser,
  ) {
    const userId = req.user.userId;
    return this.habitService.create(createHabitDto, userId);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all user habits',
    description: 'Retrieves all habits belonging to the authenticated user.',
  })
  @ApiResponse({
    status: 200,
    description: 'Habits retrieved successfully',
    type: [HabitResponse],
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  findAll(@Req() req: RequestWithUser) {
    const userId = req.user.userId;
    return this.habitService.findAll(userId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get specific habit',
    description: 'Retrieves a specific habit by ID for the authenticated user.',
  })
  @ApiParam({
    name: 'id',
    description: 'Habit ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Habit retrieved successfully',
    type: HabitResponse,
  })
  @ApiResponse({
    status: 404,
    description: 'Habit not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  findOne(@Param('id') id: string, @Req() req: RequestWithUser) {
    const userId = req.user.userId;
    return this.habitService.findOne(id, userId);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update habit',
    description: 'Updates an existing habit with new information.',
  })
  @ApiParam({
    name: 'id',
    description: 'Habit ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Habit updated successfully',
    type: HabitResponse,
  })
  @ApiResponse({
    status: 404,
    description: 'Habit not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  update(
    @Param('id') id: string,
    @Body() updateHabitDto: UpdateHabitDto,
    @Req() req: RequestWithUser,
  ) {
    const userId = req.user.userId;
    return this.habitService.update(id, updateHabitDto, userId);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete habit',
    description: 'Deletes a habit and all its completion records.',
  })
  @ApiParam({
    name: 'id',
    description: 'Habit ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Habit deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Habit not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  remove(@Param('id') id: string, @Req() req: RequestWithUser) {
    const userId = req.user.userId;
    return this.habitService.remove(id, userId);
  }

  @Post(':id/complete')
  @ApiOperation({
    summary: 'Complete a habit',
    description: 'Marks a habit as completed for today, updates streaks, and awards XP points.',
  })
  @ApiParam({
    name: 'id',
    description: 'Habit ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Habit completed successfully',
    type: HabitResponse,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - habit already completed today or inactive',
  })
  @ApiResponse({
    status: 404,
    description: 'Habit not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  completeHabit(
    @Param('id') id: string,
    @Req() req: RequestWithUser,
    @Body() body?: CompleteHabitDto,
  ) {
    const userId = req.user.userId;
    return this.habitService.completeHabit(id, userId, body?.notes);
  }

  @Get(':id/streak')
  @ApiOperation({
    summary: 'Get habit streak information',
    description: 'Retrieves current and longest streak information for a specific habit.',
  })
  @ApiParam({
    name: 'id',
    description: 'Habit ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Streak information retrieved successfully',
    type: HabitStreakResponse,
  })
  @ApiResponse({
    status: 404,
    description: 'Habit not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  getHabitStreak(@Param('id') id: string, @Req() req: RequestWithUser) {
    const userId = req.user.userId;
    return this.habitService.getHabitStreak(id, userId);
  }

  @Get('streaks/total')
  @ApiOperation({
    summary: 'Get total user streaks',
    description: 'Calculates combined streak statistics across all user habits.',
  })
  @ApiResponse({
    status: 200,
    description: 'Total streaks calculated successfully',
    type: UserTotalStreaksResponse,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  getUserTotalStreaks(@Req() req: RequestWithUser) {
    const userId = req.user.userId;
    return this.habitService.getUserTotalStreaks(userId);
  }

  @Get(':id/completions')
  @ApiOperation({
    summary: 'Get habit completion history',
    description: 'Retrieves completion records for a specific habit within an optional date range.',
  })
  @ApiParam({
    name: 'id',
    description: 'Habit ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    description: 'Start date for filtering completions (ISO format)',
    example: '2024-09-01T00:00:00.000Z',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    description: 'End date for filtering completions (ISO format)',
    example: '2024-09-30T23:59:59.999Z',
  })
  @ApiResponse({
    status: 200,
    description: 'Completion history retrieved successfully',
    type: [HabitCompletionResponse],
  })
  @ApiResponse({
    status: 404,
    description: 'Habit not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  getHabitCompletions(
    @Param('id') id: string,
    @Req() req: RequestWithUser,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const userId = req.user.userId;
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.habitService.getHabitCompletions(id, userId, start, end);
  }

  @Get('stats/completion')
  @ApiOperation({
    summary: 'Get completion statistics',
    description: 'Retrieves aggregated completion statistics for the user over a specified number of days.',
  })
  @ApiQuery({
    name: 'days',
    required: false,
    description: 'Number of days to analyze (default: 30)',
    example: 30,
  })
  @ApiResponse({
    status: 200,
    description: 'Completion statistics retrieved successfully',
    type: CompletionStatsResponse,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  getCompletionStats(
    @Req() req: RequestWithUser,
    @Query('days') days?: string,
  ) {
    const userId = req.user.userId;
    const daysNum = days ? parseInt(days, 10) : 30;
    return this.habitService.getCompletionStats(userId, daysNum);
  }

  @Get('calendar/:year/:month')
  @ApiOperation({
    summary: 'Get calendar view',
    description: 'Retrieves completion data organized by calendar days for visual progress tracking.',
  })
  @ApiParam({
    name: 'year',
    description: 'Year for calendar view',
    example: 2024,
  })
  @ApiParam({
    name: 'month',
    description: 'Month for calendar view (1-12)',
    example: 9,
  })
  @ApiResponse({
    status: 200,
    description: 'Calendar data retrieved successfully',
    type: [CalendarDayResponse],
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  getCalendarView(
    @Param('year') year: string,
    @Param('month') month: string,
    @Req() req: RequestWithUser,
  ) {
    const userId = req.user.userId;
    const yearNum = parseInt(year, 10);
    const monthNum = parseInt(month, 10);
    return this.habitService.getCalendarView(userId, yearNum, monthNum);
  }
}
