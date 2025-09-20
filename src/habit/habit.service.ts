import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HabitService {
  constructor(private readonly prisma: PrismaService) {}

  create(createHabitDto: Prisma.HabitCreateInput, userId: string) {
    return this.prisma.habit.create({
      data: { ...createHabitDto, user: { connect: { id: userId } } },
    });
  }

  findAll(userId: string) {
    return this.prisma.habit.findMany({
      where: { userId },
    });
  }

  findOne(id: string, userId: string) {
    return this.prisma.habit.findUnique({
      where: { id, userId },
    });
  }

  update(id: string, updateHabitDto: Prisma.HabitUpdateInput, userId: string) {
    return this.prisma.habit.update({
      where: { id, userId },
      data: updateHabitDto,
    });
  }

  remove(id: string, userId: string) {
    return this.prisma.habit.delete({
      where: { id, userId },
    });
  }
}
