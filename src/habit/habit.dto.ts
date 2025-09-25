import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsInt, IsOptional, IsDateString, IsUUID, Min, Max } from 'class-validator';

export class CreateHabitDto {
  @ApiProperty({
    description: 'Name of the habit',
    example: 'Drink 8 glasses of water',
    minLength: 1,
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({
    description: 'Detailed description of the habit',
    example: 'Stay hydrated throughout the day by drinking water regularly',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'How often the habit should be performed',
    example: 1,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  repetitionInterval: number;

  @ApiProperty({
    description: 'Time unit for repetition (days, weeks, months)',
    example: 'days',
    enum: ['days', 'weeks', 'months'],
  })
  @IsString()
  @IsNotEmpty()
  repetitionUnit: string;

  @ApiProperty({
    description: 'Points awarded for completing this habit',
    example: 10,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  points: number;

  @ApiPropertyOptional({
    description: 'Difficulty level (1-5)',
    example: 2,
    minimum: 1,
    maximum: 5,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  difficulty?: number;
}

export class UpdateHabitDto {
  @ApiPropertyOptional({
    description: 'Name of the habit',
    example: 'Drink 8 glasses of water daily',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;

  @ApiPropertyOptional({
    description: 'Detailed description of the habit',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'How often the habit should be performed',
    minimum: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  repetitionInterval?: number;

  @ApiPropertyOptional({
    description: 'Time unit for repetition',
    enum: ['days', 'weeks', 'months'],
  })
  @IsOptional()
  @IsString()
  repetitionUnit?: string;

  @ApiPropertyOptional({
    description: 'Points awarded for completing this habit',
    minimum: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  points?: number;

  @ApiPropertyOptional({
    description: 'Difficulty level (1-5)',
    minimum: 1,
    maximum: 5,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
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
  })
  @IsOptional()
  @IsString()
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