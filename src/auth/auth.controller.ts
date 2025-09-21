import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from './auth.dto';
import {
  Body,
  Controller,
  HttpCode,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
}
