import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
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

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly filebaseService: FilebaseService) {}

  @Post('register')
  @UsePipes(new ValidationPipe())
  async register(@Body() data: RegisterRequest): Promise<RegisterResponse> {
    return this.authService.registerUser(data);
  }

  @Post('login')
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  async login(@Body() data: LoginRequest): Promise<LoginResponse> {
    return this.authService.login(data);
  }

  @Post('avatar')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@Req() req: AuthenticatedRequest, @UploadedFile() file: MulterFile): Promise<{ url: string }> {
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
  @UseGuards(JwtAuthGuard)
  async getProfile(@Req() req: AuthenticatedRequest): Promise<AuthenticatedUser> {
    return req.user;
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // This route initiates Google OAuth
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req: GoogleAuthRequest): RegisterResponse {
    return req.user;
  }
}
