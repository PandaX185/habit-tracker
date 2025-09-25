import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsInt, IsOptional, IsDateString, IsUUID, Min, Max, Length, IsIn, IsEnum } from 'class-validator';

export class CreateHabitDto {
  @ApiProperty({
    description: 'Name of the habit',
    example: 'Drink 8 glasses of water',
    minLength: 1,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 100, { message: 'Title must be between 1 and 100 characters' })
  title: string;

  @ApiPropertyOptional({
    description: 'Detailed description of the habit',
    example: 'Stay hydrated throughout the day by drinking water regularly',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @Length(0, 500, { message: 'Description must not exceed 500 characters' })
  description?: string;

  @ApiProperty({
    description: 'How often the habit should be performed',
    example: 1,
    minimum: 1,
    maximum: 365,
  })
  @IsInt()
  @Min(1, { message: 'Repetition interval must be at least 1' })
  @Max(365, { message: 'Repetition interval must not exceed 365' })
  repetitionInterval: number;

  @ApiProperty({
    description: 'Time unit for repetition (days, weeks, months)',
    example: 'days',
    enum: ['days', 'weeks', 'months'],
  })
  @IsString()
  @IsNotEmpty()
  @IsIn(['days', 'weeks', 'months'], { message: 'Repetition unit must be one of: days, weeks, months' })
  repetitionUnit: string;

  @ApiProperty({
    description: 'Points awarded for completing this habit',
    example: 10,
    minimum: 1,
    maximum: 1000,
  })
  @IsInt()
  @Min(1, { message: 'Points must be at least 1' })
  @Max(1000, { message: 'Points must not exceed 1000' })
  points: number;

  @ApiPropertyOptional({
    description: 'Difficulty level (1-5)',
    example: 2,
    minimum: 1,
    maximum: 5,
  })
  @IsOptional()
  @IsInt()
  @Min(1, { message: 'Difficulty must be at least 1' })
  @Max(5, { message: 'Difficulty must not exceed 5' })
  difficulty?: number;
}

export class UpdateHabitDto {
  @ApiPropertyOptional({
    description: 'Name of the habit',
    example: 'Drink 8 glasses of water daily',
    minLength: 1,
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Length(1, 100, { message: 'Title must be between 1 and 100 characters' })
  title?: string;

  @ApiPropertyOptional({
    description: 'Detailed description of the habit',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @Length(0, 500, { message: 'Description must not exceed 500 characters' })
  description?: string;

  @ApiPropertyOptional({
    description: 'How often the habit should be performed',
    minimum: 1,
    maximum: 365,
  })
  @IsOptional()
  @IsInt()
  @Min(1, { message: 'Repetition interval must be at least 1' })
  @Max(365, { message: 'Repetition interval must not exceed 365' })
  repetitionInterval?: number;

  @ApiPropertyOptional({
    description: 'Time unit for repetition',
    enum: ['days', 'weeks', 'months'],
  })
  @IsOptional()
  @IsString()
  @IsIn(['days', 'weeks', 'months'], { message: 'Repetition unit must be one of: days, weeks, months' })
  repetitionUnit?: string;

  @ApiPropertyOptional({
    description: 'Points awarded for completing this habit',
    minimum: 1,
    maximum: 1000,
  })
  @IsOptional()
  @IsInt()
  @Min(1, { message: 'Points must be at least 1' })
  @Max(1000, { message: 'Points must not exceed 1000' })
  points?: number;

  @ApiPropertyOptional({
    description: 'Difficulty level (1-5)',
    minimum: 1,
    maximum: 5,
  })
  @IsOptional()
  @IsInt()
  @Min(1, { message: 'Difficulty must be at least 1' })
  @Max(5, { message: 'Difficulty must not exceed 5' })
  difficulty?: number;
}

export class HabitResponse {
  @ApiProperty({
    description: 'Unique habit ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Habit title',
    example: 'Drink 8 glasses of water',
  })
  title: string;

  @ApiPropertyOptional({
    description: 'Habit description',
  })
  description?: string;

  @ApiProperty({
    description: 'Repetition interval',
    example: 1,
  })
  repetitionInterval: number;

  @ApiProperty({
    description: 'Repetition unit',
    example: 'days',
  })
  repetitionUnit: string;

  @ApiProperty({
    description: 'Points for completion',
    example: 10,
  })
  points: number;

  @ApiProperty({
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  userId: string;

  @ApiPropertyOptional({
    description: 'Difficulty level',
  })
  difficulty?: number;

  @ApiProperty({
    description: 'Whether the habit is currently active',
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Current streak count',
    example: 5,
  })
  streak: number;

  @ApiProperty({
    description: 'Longest streak achieved',
    example: 12,
  })
  longestStreak: number;

  @ApiPropertyOptional({
    description: 'Last completion date',
    format: 'date-time',
  })
  lastCompletedAt?: Date;

  @ApiProperty({
    description: 'Creation date',
    format: 'date-time',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update date',
    format: 'date-time',
  })
  updatedAt: Date;
}

export class CompleteHabitDto {
  @ApiPropertyOptional({
    description: 'Optional notes about the completion',
    example: 'Completed early today!',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @Length(0, 500, { message: 'Notes must not exceed 500 characters' })
  notes?: string;
}

export class HabitCompletionResponse {
  @ApiProperty({
    description: 'Completion ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Habit ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  habitId: string;

  @ApiProperty({
    description: 'Completion timestamp',
    format: 'date-time',
  })
  completedAt: Date;

  @ApiPropertyOptional({
    description: 'Optional completion notes',
  })
  notes?: string;
}

export class HabitStreakResponse {
  @ApiProperty({
    description: 'Current streak count',
    example: 5,
  })
  currentStreak: number;

  @ApiProperty({
    description: 'Longest streak achieved',
    example: 12,
  })
  longestStreak: number;

  @ApiPropertyOptional({
    description: 'Last completion date',
    format: 'date-time',
  })
  lastCompletedAt?: Date;
}

export class UserTotalStreaksResponse {
  @ApiProperty({
    description: 'Sum of all current habit streaks',
    example: 25,
  })
  currentTotalStreak: number;

  @ApiProperty({
    description: 'Sum of all longest habit streaks',
    example: 67,
  })
  longestTotalStreak: number;

  @ApiProperty({
    description: 'Individual habit streak details',
    type: [Object],
  })
  habitStreaks: Array<{
    title: string;
    currentStreak: number;
    longestStreak: number;
  }>;
}

export class CompletionStatsResponse {
  @ApiProperty({
    description: 'Total number of habit completions',
    example: 45,
  })
  totalCompletions: number;

  @ApiProperty({
    description: 'Number of unique days with completions',
    example: 28,
  })
  activeDays: number;

  @ApiProperty({
    description: 'Average completions per active day',
    example: 1.61,
  })
  avgCompletionsPerDay: number;
}

export class CalendarDayResponse {
  @ApiProperty({
    description: 'Date in YYYY-MM-DD format',
    example: '2024-09-24',
  })
  date: string;

  @ApiProperty({
    description: 'Completions for this day',
    type: [Object],
  })
  completions: Array<{
    habitId: string;
    habitTitle: string;
    points: number;
    completedAt: Date;
  }>;

  @ApiProperty({
    description: 'Total points earned this day',
    example: 25,
  })
  totalPoints: number;
}