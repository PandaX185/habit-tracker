import { Test, TestingModule } from '@nestjs/testing';
import { HabitService } from './habit.service';
import { PrismaService } from '../prisma/prisma.service';
import { BadgeService } from '../badges/badge.service';
import { Prisma } from '@prisma/client';
import { getQueueToken } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

describe('HabitService', () => {
  let service: HabitService;
  let prismaService: PrismaService;
  let mockQueue: jest.Mocked<Queue>;
  let mockBadgeService: jest.Mocked<BadgeService>;

  beforeEach(async () => {
    const mockBadgeServiceProvider = {
      provide: BadgeService,
      useValue: {
        checkAndAwardBadges: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [HabitService, PrismaService, mockBadgeServiceProvider],
    }).compile();

    service = module.get<HabitService>(HabitService);
    prismaService = module.get<PrismaService>(PrismaService);
    mockBadgeService = module.get(BadgeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a habit successfully', async () => {
      const uniqueId = Date.now().toString();
      // Create a test user first
      const user = await prismaService.user.create({
        data: {
          username: `testuser${uniqueId}`,
          email: `test${uniqueId}@example.com`,
          fullname: 'Test User',
          passwordHash: 'hash',
        },
      });

      const createHabitDto = {
        title: 'New Habit',
        repetitionDays: 127, // All days
      };

      const result = await service.create(createHabitDto, user.id);

      expect(result).toBeDefined();
      expect(result.title).toBe('New Habit');
      expect(result.userId).toBe(user.id);

      // Clean up
      await prismaService.habit.delete({ where: { id: result.id } });
      await prismaService.user.delete({ where: { id: user.id } });
    });
  });

  describe('findAll', () => {
    it('should return all habits for a user', async () => {
      const uniqueId = Date.now().toString();
      // Create a test user
      const user = await prismaService.user.create({
        data: {
          username: `testuser2${uniqueId}`,
          email: `test2${uniqueId}@example.com`,
          fullname: 'Test User 2',
          passwordHash: 'hash',
        },
      });

      // Create a habit
      const habit = await prismaService.habit.create({
        data: {
          title: 'Test Habit',
          repetitionDays: 127, // All days
          user: { connect: { id: user.id } },
        },
      });

      const result = await service.findAll(user.id);

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(habit.id);

      // Clean up
      await prismaService.habit.delete({ where: { id: habit.id } });
      await prismaService.user.delete({ where: { id: user.id } });
    });

    it('should return empty array if no habits', async () => {
      const uniqueId = Date.now().toString();
      // Create a test user
      const user = await prismaService.user.create({
        data: {
          username: `testuser3${uniqueId}`,
          email: `test3${uniqueId}@example.com`,
          fullname: 'Test User 3',
          passwordHash: 'hash',
        },
      });

      const result = await service.findAll(user.id);

      expect(result).toEqual([]);

      // Clean up
      await prismaService.user.delete({ where: { id: user.id } });
    });
  });

  describe('findOne', () => {
    it('should return a habit if found and belongs to user', async () => {
      const uniqueId = Date.now().toString();
      // Create a test user
      const user = await prismaService.user.create({
        data: {
          username: `testuser4${uniqueId}`,
          email: `test4${uniqueId}@example.com`,
          fullname: 'Test User 4',
          passwordHash: 'hash',
        },
      });

      // Create a habit
      const habit = await prismaService.habit.create({
        data: {
          title: 'Test Habit',
          repetitionDays: 127, // All days
          user: { connect: { id: user.id } },
        },
      });

      const result = await service.findOne(habit.id, user.id);

      expect(result).toBeDefined();
      expect(result!.id).toBe(habit.id);

      // Clean up
      await prismaService.habit.delete({ where: { id: habit.id } });
      await prismaService.user.delete({ where: { id: user.id } });
    });

    it('should return null if habit not found', async () => {
      const uniqueId = Date.now().toString();
      // Create a test user
      const user = await prismaService.user.create({
        data: {
          username: `testuser5${uniqueId}`,
          email: `test5${uniqueId}@example.com`,
          fullname: 'Test User 5',
          passwordHash: 'hash',
        },
      });

      await expect(
        service.findOne('non-existent-id', user.id),
      ).rejects.toThrow('Habit not found');

      // Clean up
      await prismaService.user.delete({ where: { id: user.id } });
    });
  });

  describe('update', () => {
    it('should update a habit successfully', async () => {
      const uniqueId = Date.now().toString();
      // Create a test user
      const user = await prismaService.user.create({
        data: {
          username: `testuser6${uniqueId}`,
          email: `test6${uniqueId}@example.com`,
          fullname: 'Test User 6',
          passwordHash: 'hash',
        },
      });

      // Create a habit
      const habit = await prismaService.habit.create({
        data: {
          title: 'Test Habit',
          repetitionDays: 127, // All days
          user: { connect: { id: user.id } },
        },
      });

      const updateHabitDto = {
        title: 'Updated Habit',
        repetitionDays: 127,
      };

      const result = await service.update(habit.id, updateHabitDto, user.id);

      expect(result.title).toBe('Updated Habit');

      // Clean up
      await prismaService.habit.delete({ where: { id: habit.id } });
      await prismaService.user.delete({ where: { id: user.id } });
    });

    it('should throw error if habit not found or not owned', async () => {
      const uniqueId = Date.now().toString();
      // Create a test user
      const user = await prismaService.user.create({
        data: {
          username: `testuser7${uniqueId}`,
          email: `test7${uniqueId}@example.com`,
          fullname: 'Test User 7',
          passwordHash: 'hash',
        },
      });

      const updateHabitDto = { title: 'Updated', repetitionDays: 127 };

      await expect(
        service.update('non-existent-id', updateHabitDto, user.id),
      ).rejects.toThrow();

      // Clean up
      await prismaService.user.delete({ where: { id: user.id } });
    });
  });

  describe('remove', () => {
    it('should delete a habit successfully', async () => {
      const uniqueId = Date.now().toString();
      // Create a test user
      const user = await prismaService.user.create({
        data: {
          username: `testuser8${uniqueId}`,
          email: `test8${uniqueId}@example.com`,
          fullname: 'Test User 8',
          passwordHash: 'hash',
        },
      });

      // Create a habit
      const habit = await prismaService.habit.create({
        data: {
          title: 'Test Habit',
          repetitionDays: 127, // All days
          user: { connect: { id: user.id } },
        },
      });

      const result = await service.remove(habit.id, user.id);

      expect(result.id).toBe(habit.id);

      // Verify deleted
      const check = await prismaService.habit.findUnique({
        where: { id: habit.id },
      });
      expect(check).toBeNull();

      // Clean up user
      await prismaService.user.delete({ where: { id: user.id } });
    });

    it('should throw error if habit not found or not owned', async () => {
      const uniqueId = Date.now().toString();
      // Create a test user
      const user = await prismaService.user.create({
        data: {
          username: `testuser9${uniqueId}`,
          email: `test9${uniqueId}@example.com`,
          fullname: 'Test User 9',
          passwordHash: 'hash',
        },
      });

      await expect(
        service.remove('non-existent-id', user.id),
      ).rejects.toThrow();

      // Clean up
      await prismaService.user.delete({ where: { id: user.id } });
    });
  });

  describe('completeHabit', () => {
    it('should complete a habit and schedule reactivation', async () => {
      // Increase timeout for this test
      jest.setTimeout(30000);
      const uniqueId = Date.now().toString();
      // Create a test user
      const user = await prismaService.user.create({
        data: {
          username: `testuser10${uniqueId}`,
          email: `test10${uniqueId}@example.com`,
          fullname: 'Test User 10',
          passwordHash: 'hash',
          xpPoints: 0,
        },
      });

      // Create a habit
      const habit = await prismaService.habit.create({
        data: {
          title: 'Daily Exercise',
          repetitionDays: 127, // All days
          user: { connect: { id: user.id } },
          streak: 0,
        },
      });

      const result = await service.completeHabit(habit.id, user.id);

      expect(result.streak).toBe(1);
      expect(result.isActive).toBe(false);
      expect(result.lastCompletedAt).toBeDefined();

      // Check that user XP was updated
      const updatedUser = await prismaService.user.findUnique({
        where: { id: user.id },
      });
      expect(updatedUser!.xpPoints).toBe(1);

      // Clean up
      await prismaService.habit.delete({ where: { id: habit.id } });
      await prismaService.user.delete({ where: { id: user.id } });
    });

    it('should throw error if habit not found', async () => {
      const uniqueId = Date.now().toString();
      // Create a test user
      const user = await prismaService.user.create({
        data: {
          username: `testuser11${uniqueId}`,
          email: `test11${uniqueId}@example.com`,
          fullname: 'Test User 11',
          passwordHash: 'hash',
        },
      });

      await expect(
        service.completeHabit('non-existent-id', user.id),
      ).rejects.toThrow('Habit not found');

      // Clean up
      await prismaService.user.delete({ where: { id: user.id } });
    });

    it('should throw error if habit is not active', async () => {
      const uniqueId = Date.now().toString();
      // Create a test user
      const user = await prismaService.user.create({
        data: {
          username: `testuser12${uniqueId}`,
          email: `test12${uniqueId}@example.com`,
          fullname: 'Test User 12',
          passwordHash: 'hash',
        },
      });

      // Create an inactive habit
      const habit = await prismaService.habit.create({
        data: {
          title: 'Inactive Habit',
          repetitionDays: 127, // All days
          user: { connect: { id: user.id } },
          lastCompletedAt: new Date(), // Completed today, so inactive
        },
      });

      await expect(service.completeHabit(habit.id, user.id)).rejects.toThrow(
        'Habit is not active',
      );

      // Clean up
      await prismaService.habit.delete({ where: { id: habit.id } });
      await prismaService.user.delete({ where: { id: user.id } });
    });
  });
});
