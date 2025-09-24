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
import { Prisma } from '@prisma/client';
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

@Controller('habit')
@UseGuards(JwtAuthGuard)
export class HabitController {
  constructor(private readonly habitService: HabitService) {}

  @Post()
  create(
    @Body() createHabitDto: Prisma.HabitCreateInput,
    @Req() req: RequestWithUser,
  ) {
    const userId = req.user.userId;
    return this.habitService.create(createHabitDto, userId);
  }

  @Get()
  findAll(@Req() req: RequestWithUser) {
    const userId = req.user.userId;
    return this.habitService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: RequestWithUser) {
    const userId = req.user.userId;
    return this.habitService.findOne(id, userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateHabitDto: Prisma.HabitUpdateInput,
    @Req() req: RequestWithUser,
  ) {
    const userId = req.user.userId;
    return this.habitService.update(id, updateHabitDto, userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: RequestWithUser) {
    const userId = req.user.userId;
    return this.habitService.remove(id, userId);
  }

  @Post(':id/complete')
  completeHabit(
    @Param('id') id: string,
    @Req() req: RequestWithUser,
    @Body() body?: { notes?: string },
  ) {
    const userId = req.user.userId;
    return this.habitService.completeHabit(id, userId, body?.notes);
  }

  @Get(':id/completions')
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

  @Get('streaks/total')
  getUserTotalStreaks(@Req() req: RequestWithUser) {
    const userId = req.user.userId;
    return this.habitService.getUserTotalStreaks(userId);
  }

  @Get('stats/completion')
  getCompletionStats(
    @Req() req: RequestWithUser,
    @Query('days') days?: string,
  ) {
    const userId = req.user.userId;
    const daysNum = days ? parseInt(days, 10) : 30;
    return this.habitService.getCompletionStats(userId, daysNum);
  }

  @Get('calendar/:year/:month')
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
