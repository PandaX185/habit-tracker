import { Test, TestingModule } from '@nestjs/testing';
import { HabitService } from './habit.service';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

describe('HabitService', () => {
  let service: HabitService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HabitService, PrismaService],
    }).compile();

    service = module.get<HabitService>(HabitService);
    prismaService = module.get<PrismaService>(PrismaService);
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
        repetitionInterval: 2,
        repetitionUnit: 'weeks',
        points: 20,
      } as Prisma.HabitCreateInput;

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
          repetitionInterval: 1,
          repetitionUnit: 'days',
          points: 10,
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
          repetitionInterval: 1,
          repetitionUnit: 'days',
          points: 10,
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

      const result = await service.findOne('non-existent-id', user.id);

      expect(result).toBeNull();

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
          repetitionInterval: 1,
          repetitionUnit: 'days',
          points: 10,
          user: { connect: { id: user.id } },
        },
      });

      const updateHabitDto: Prisma.HabitUpdateInput = {
        title: 'Updated Habit',
        points: 15,
      };

      const result = await service.update(habit.id, updateHabitDto, user.id);

      expect(result.title).toBe('Updated Habit');
      expect(result.points).toBe(15);

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

      const updateHabitDto: Prisma.HabitUpdateInput = { title: 'Updated' };

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
          repetitionInterval: 1,
          repetitionUnit: 'days',
          points: 10,
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
});
