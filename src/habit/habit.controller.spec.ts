import { Test, TestingModule } from '@nestjs/testing';
import { HabitController } from './habit.controller';
import { HabitService } from './habit.service';
import { Prisma } from '@prisma/client';

describe('HabitController', () => {
  let controller: HabitController;
  let service: any;

  const mockHabit = {
    id: 'habit-id',
    title: 'Test Habit',
    description: 'Test Description',
    repetitionInterval: 1,
    repetitionUnit: 'days',
    points: 10,
    userId: 'user-id',
    category: 'Health',
    difficulty: 2,
    isActive: true,
    streak: 0,
    lastCompletedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const mockHabitService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [HabitController],
      providers: [
        {
          provide: HabitService,
          useValue: mockHabitService,
        },
      ],
    }).compile();

    controller = module.get<HabitController>(HabitController);
    service = module.get(HabitService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a habit', async () => {
      const createHabitDto = {
        title: 'New Habit',
        repetitionInterval: 1,
        repetitionUnit: 'days',
        points: 10,
      };
      const userId = 'user-id';
      const mockReq = { user: { userId } };

      service.create.mockResolvedValue(mockHabit);

      const result = await controller.create(createHabitDto, mockReq as any);

      expect(service.create).toHaveBeenCalledWith(createHabitDto, userId);
      expect(result).toEqual(mockHabit);
    });

    it('should validate habit creation input', async () => {
      const invalidHabitDto = {
        title: '', // Invalid: empty title
        repetitionInterval: 0, // Invalid: less than 1
        repetitionUnit: 'invalid', // Invalid: not in enum
        points: 0, // Invalid: less than 1
      };
      const userId = 'user-id';
      const mockReq = { user: { userId } };

      // Mock the service to not be called due to validation failure
      service.create.mockResolvedValue(mockHabit);

      // This should throw a validation error before reaching the service
      await expect(controller.create(invalidHabitDto as any, mockReq as any)).rejects.toThrow();
      expect(service.create).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all habits for user', async () => {
      const userId = 'user-id';
      const habits = [mockHabit];
      const mockReq = { user: { userId } };

      service.findAll.mockResolvedValue(habits);

      const result = await controller.findAll(mockReq as any);

      expect(service.findAll).toHaveBeenCalledWith(userId);
      expect(result).toEqual(habits);
    });
  });

  describe('findOne', () => {
    it('should return a habit', async () => {
      const id = 'habit-id';
      const userId = 'user-id';
      const mockReq = { user: { userId } };

      service.findOne.mockResolvedValue(mockHabit);

      const result = await controller.findOne(id, mockReq as any);

      expect(service.findOne).toHaveBeenCalledWith(id, userId);
      expect(result).toEqual(mockHabit);
    });
  });

  describe('update', () => {
    it('should update a habit', async () => {
      const id = 'habit-id';
      const userId = 'user-id';
      const updateHabitDto = { title: 'Updated' };
      const mockReq = { user: { userId } };

      service.update.mockResolvedValue(mockHabit);

      const result = await controller.update(
        id,
        updateHabitDto,
        mockReq as any,
      );

      expect(service.update).toHaveBeenCalledWith(id, updateHabitDto, userId);
      expect(result).toEqual(mockHabit);
    });
  });

  describe('remove', () => {
    it('should delete a habit', async () => {
      const id = 'habit-id';
      const userId = 'user-id';
      const mockReq = { user: { userId } };

      service.remove.mockResolvedValue(mockHabit);

      const result = await controller.remove(id, mockReq as any);

      expect(service.remove).toHaveBeenCalledWith(id, userId);
      expect(result).toEqual(mockHabit);
    });
  });
});
