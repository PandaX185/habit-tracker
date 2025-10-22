import { Test, TestingModule } from '@nestjs/testing';
import { HabitController } from './habit.controller';
import { HabitService } from './habit.service';

describe('HabitController', () => {
  let controller: HabitController;
  let service: any;

  const mockHabit = {
    id: 'habit-id',
    title: 'Test Habit',
    description: 'Test Description',
    repetitionDays: 127,
    userId: 'user-id',
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
        repetitionDays: 127,
      };
      const userId = 'user-id';
      const mockReq = { user: { userId } };

      service.create.mockResolvedValue(mockHabit);

      const result = await controller.create(createHabitDto, mockReq as any);

      expect(service.create).toHaveBeenCalledWith(createHabitDto, userId);
      expect(result).toEqual(mockHabit);
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
      const updateHabitDto = { title: 'Updated', repetitionDays: 127 };
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
