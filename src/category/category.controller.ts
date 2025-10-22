import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, InternalServerErrorException } from '@nestjs/common';
import { CategoryService } from './category.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CategoryResponse } from './category.dto';

@Controller('category')
@ApiBearerAuth('JWT-auth')
@ApiTags('category')
@UseGuards(JwtAuthGuard)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  @ApiOperation({
    summary: 'Get all categories',
    description: 'Get all categories in the system'
  })
  @ApiResponse({
    status: 200,
    description: 'Categories fetched successfully',
    type: [CategoryResponse]
  })
  @Get()
  findAll() {
    return this.categoryService.findAll();
  }

  @ApiOperation({
    summary: 'Seed categories',
    description: 'Seed initial categories into the system'
  })
  @ApiResponse({
    status: 200,
    description: 'Categories seeded successfully'
  })
  @Get('seed')
  seedCategories() {
    this.categoryService.seedCategories().catch(
      (error) => {
        throw new InternalServerErrorException('Failed to seed categories: ' + error.message);
      }
    );
    return { message: 'Categories seeded successfully' }
  }

  @ApiOperation({
    summary: 'Get habit categories',
    description: 'Get all categories for a specific habit'
  })
  @ApiResponse({
    status: 200,
    description: 'Categories fetched successfully',
    type: [CategoryResponse]
  })
  @Get(':habitId')
  findAllHabitCategories(@Param('habitId') id: string) {
    return this.categoryService.findAllHabitCategories(id);
  }
}
