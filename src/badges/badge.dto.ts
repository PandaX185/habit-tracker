import { IsEnum, IsOptional, IsString, IsObject, IsNumber, Min, Max } from 'class-validator';
import { BadgeType, BadgeRarity } from '@prisma/client';

export class BadgeProgressDto {
  @IsString({ message: 'Badge ID must be a string' })
  badgeId: string;

  @IsNumber({}, { message: 'Current progress must be a number' })
  @Min(0, { message: 'Current progress must be at least 0' })
  currentProgress: number;

  @IsNumber({}, { message: 'Target progress must be a number' })
  @Min(1, { message: 'Target progress must be at least 1' })
  targetProgress: number;

  @IsOptional()
  @IsObject({ message: 'Progress data must be an object' })
  progressData?: Record<string, any>;
}