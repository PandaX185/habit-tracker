import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { HabitService } from './habit.service';
import { Prisma } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('habit')
@UseGuards(JwtAuthGuard)
export class HabitController {
  constructor(private readonly habitService: HabitService) {}

  @Post()
  create(@Body() createHabitDto: Prisma.HabitCreateInput, @Req() req: any) {
    const userId = req.user.userId;
    return this.habitService.create(createHabitDto, userId);
  }

  @Get()
  findAll(@Req() req: any) {
    const userId = req.user.userId;
    return this.habitService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: any) {
    const userId = req.user.userId;
    return this.habitService.findOne(id, userId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHabitDto: Prisma.HabitUpdateInput, @Req() req: any) {
    const userId = req.user.userId;
    return this.habitService.update(id, updateHabitDto, userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    const userId = req.user.userId;
    return this.habitService.remove(id, userId);
  }
}
