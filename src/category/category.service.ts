import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { DEFAULT_CATEGORIES } from './category.consts';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) { }

  findAll() {
    return this.prisma.category.findMany();
  }

  findAllHabitCategories(id: string) {
    return this.prisma.habitCategory.findMany({
      where: { habitId: id },
      include: { category: true },
    });
  }

  async seedCategories() {
    for (const category of DEFAULT_CATEGORIES) {
      await this.prisma.category.upsert({
        where: { name: category.name },
        update: {},
        create: category,
      });
    }
  }
}
