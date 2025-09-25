import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  UserProfile,
  UploadAvatarResponse,
} from './auth.dto';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from './jwt-auth.guard';
import { FilebaseService } from '../filebase/filebase.service';
import { File as MulterFile } from 'multer';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';

interface AuthenticatedUser {
  userId: string;
  email: string;
  username: string;
  fullname: string;
  avatarUrl?: string;
}

interface AuthenticatedRequest {
  user: AuthenticatedUser;
}

interface GoogleAuthRequest {
  user: RegisterResponse;
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly filebaseService: FilebaseService,
  ) {}

  @Post('register')
  @ApiOperation({
    summary: 'Register a new user',
    description: 'Creates a new user account with email, password, and profile information.',
  })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered',
    type: RegisterResponse,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation failed',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - user already exists',
  })
  @UsePipes(new ValidationPipe())
  async register(@Body() data: RegisterRequest): Promise<RegisterResponse> {
    return this.authService.registerUser(data);
  }

  @Post('login')
  @ApiOperation({
    summary: 'User login',
    description: 'Authenticates a user with email and password, returns JWT token.',
  })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    type: LoginResponse,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - invalid credentials',
  })
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  async login(@Body() data: LoginRequest): Promise<LoginResponse> {
    return this.authService.login(data);
  }

  @Post('avatar')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Upload user avatar',
    description: 'Uploads an avatar image for the authenticated user.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Avatar image file',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Image file (JPEG, PNG, etc.)',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Avatar uploaded successfully',
    type: UploadAvatarResponse,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - no file uploaded or invalid file',
  })
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @Req() req: AuthenticatedRequest,
    @UploadedFile() file?: MulterFile,
  ): Promise<{ url: string }> {
    if (!file) {
      throw new Error('No file uploaded');
    }

    const url = await this.filebaseService.uploadFile(
      `avatars/${Date.now()}-${file.originalname}`,
      file.buffer,
      file.mimetype,
    );
    const userId = req.user.userId;
    await this.authService.updateAvatar(userId, url);

    return { url };
  }

  @Get('profile')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get user profile',
    description: 'Retrieves the profile information of the authenticated user.',
  })
  @ApiResponse({
    status: 200,
    description: 'Profile retrieved successfully',
    type: UserProfile,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @UseGuards(JwtAuthGuard)
  getProfile(@Req() req: AuthenticatedRequest): AuthenticatedUser {
    return req.user;
  }

  @Get('google')
  @ApiOperation({
    summary: 'Initiate Google OAuth',
    description: 'Redirects to Google OAuth login page.',
  })
  @ApiResponse({
    status: 302,
    description: 'Redirect to Google OAuth',
  })
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // This route initiates Google OAuth
  }

  @Get('google/callback')
  @ApiOperation({
    summary: 'Google OAuth callback',
    description: 'Handles the callback from Google OAuth and returns user data.',
  })
  @ApiResponse({
    status: 200,
    description: 'Google authentication successful',
    type: RegisterResponse,
  })
  @ApiResponse({
    status: 401,
    description: 'Authentication failed',
  })
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req: GoogleAuthRequest): RegisterResponse {
    return req.user;
  }
}
