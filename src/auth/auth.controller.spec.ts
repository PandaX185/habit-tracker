import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { FilebaseService } from '../filebase/filebase.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { File as MulterFile } from 'multer';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: jest.Mocked<AuthService>;
  let filebaseService: jest.Mocked<FilebaseService>;

  const mockUser = {
    userId: 'user-123',
    email: 'test@example.com',
    username: 'testuser',
    fullname: 'Test User',
    avatarUrl: 'https://example.com/avatar.jpg',
  };

  const mockFile = {
    originalname: 'test-avatar.jpg',
    buffer: Buffer.from('fake-image-data'),
    mimetype: 'image/jpeg',
  } as MulterFile;

  beforeEach(async () => {
    const mockAuthService = {
      registerUser: jest.fn(),
      login: jest.fn(),
      updateAvatar: jest.fn(),
    };

    const mockFilebaseService = {
      uploadFile: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: FilebaseService,
          useValue: mockFilebaseService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(AuthGuard('google'))
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get(AuthService);
    filebaseService = module.get(FilebaseService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getProfile', () => {
    it('should return user profile data', () => {
      const req = { user: mockUser };

      const result = controller.getProfile(req);

      expect(result).toEqual(mockUser);
    });

    it('should return user profile with optional avatarUrl', () => {
      const userWithoutAvatar = {
        userId: 'user-456',
        email: 'noavatar@example.com',
        username: 'noavatar',
        fullname: 'No Avatar User',
      };
      const req = { user: userWithoutAvatar };

      const result = controller.getProfile(req);

      expect(result).toEqual(userWithoutAvatar);
      expect(result.avatarUrl).toBeUndefined();
    });
  });

  describe('uploadFile (avatar)', () => {
    it('should upload avatar and update user profile', async () => {
      const req = { user: mockUser };
      const expectedUrl =
        'https://filebase.com/bucket/avatars/123456789-test-avatar.jpg';

      filebaseService.uploadFile.mockResolvedValue(expectedUrl);
      authService.updateAvatar.mockResolvedValue({
        id: mockUser.userId,
        username: mockUser.username,
        email: mockUser.email,
        fullname: mockUser.fullname,
        passwordHash: null,
        googleId: null,
        avatarUrl: expectedUrl,
        xpPoints: 0,
        level: 0,
      });

      const result = await controller.uploadFile(req, mockFile);

      expect(filebaseService.uploadFile).toHaveBeenCalledWith(
        expect.stringContaining('avatars/'),
        mockFile.buffer,
        mockFile.mimetype,
      );
      expect(authService.updateAvatar).toHaveBeenCalledWith(
        mockUser.userId,
        expectedUrl,
      );
      expect(result).toEqual({ url: expectedUrl });
    });

    it('should throw error when no file is uploaded', async () => {
      const req = { user: mockUser };

      await expect(
        controller.uploadFile(req, undefined as any),
      ).rejects.toThrow('No file uploaded');
      expect(filebaseService.uploadFile).not.toHaveBeenCalled();
      expect(authService.updateAvatar).not.toHaveBeenCalled();
    });

    it('should handle file upload with different mimetype', async () => {
      const req = { user: mockUser };
      const pngFile = {
        ...mockFile,
        originalname: 'avatar.png',
        mimetype: 'image/png',
      };
      const expectedUrl =
        'https://filebase.com/bucket/avatars/123456789-avatar.png';

      filebaseService.uploadFile.mockResolvedValue(expectedUrl);
      authService.updateAvatar.mockResolvedValue({
        id: mockUser.userId,
        username: mockUser.username,
        email: mockUser.email,
        fullname: mockUser.fullname,
        passwordHash: null,
        googleId: null,
        avatarUrl: expectedUrl,
        xpPoints: 0,
        level: 0,
      });

      const result = await controller.uploadFile(req, pngFile);

      expect(filebaseService.uploadFile).toHaveBeenCalledWith(
        expect.stringContaining('avatars/'),
        pngFile.buffer,
        'image/png',
      );
      expect(result).toEqual({ url: expectedUrl });
    });

    it('should propagate filebase service errors', async () => {
      const req = { user: mockUser };
      const error = new Error('File size exceeds 5MB');

      filebaseService.uploadFile.mockRejectedValue(error);

      await expect(controller.uploadFile(req, mockFile)).rejects.toThrow(
        'File size exceeds 5MB',
      );
      expect(authService.updateAvatar).not.toHaveBeenCalled();
    });

    it('should propagate auth service errors', async () => {
      const req = { user: mockUser };
      const expectedUrl =
        'https://filebase.com/bucket/avatars/123456789-test-avatar.jpg';

      filebaseService.uploadFile.mockResolvedValue(expectedUrl);
      authService.updateAvatar.mockRejectedValue(new Error('User not found'));

      await expect(controller.uploadFile(req, mockFile)).rejects.toThrow(
        'User not found',
      );
    });
  });

  describe('googleAuth', () => {
    it('should initiate Google OAuth (guard handles the logic)', () => {
      const result = controller.googleAuth();
      expect(result).toBeUndefined();
    });
  });

  describe('googleAuthRedirect', () => {
    it('should return the authenticated user response', () => {
      const mockResponse = { accessToken: 'jwt-token-123' };
      const req = { user: mockResponse };

      const result = controller.googleAuthRedirect(req);

      expect(result).toEqual(mockResponse);
    });
  });
});
