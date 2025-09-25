import { IsEmail, IsJWT, IsNotEmpty, IsStrongPassword, IsOptional, IsString, IsUrl } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LoginRequest {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
    format: 'email',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'StrongPass123!',
    minLength: 8,
  })
  @IsNotEmpty()
  @IsStrongPassword({
    minLength: 8,
    minNumbers: 1,
  })
  password: string;
}

export class LoginResponse {
  @ApiProperty({
    description: 'JWT access token for authentication',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @IsJWT()
  accessToken: string;
}

export class RegisterRequest {
  @ApiProperty({
    description: 'Unique username for the user',
    example: 'johndoe',
    minLength: 1,
  })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
    format: 'email',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Full name of the user',
    example: 'John Doe',
    minLength: 1,
  })
  @IsNotEmpty()
  @IsString()
  fullname: string;

  @ApiProperty({
    description: 'Strong password for the account',
    example: 'StrongPass123!',
    minLength: 8,
  })
  @IsNotEmpty()
  @IsStrongPassword({
    minLength: 8,
    minNumbers: 1,
  })
  password: string;

  @ApiPropertyOptional({
    description: 'Optional avatar URL',
    example: 'https://example.com/avatar.jpg',
    format: 'url',
  })
  @IsOptional()
  @IsUrl()
  avatarUrl?: string;
}

export class RegisterResponse {
  @ApiProperty({
    description: 'JWT access token for the new user',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @IsJWT()
  accessToken: string;
}

export class UserProfile {
  @ApiProperty({
    description: 'Unique user ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  userId: string;

  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'Username',
    example: 'johndoe',
  })
  username: string;

  @ApiProperty({
    description: 'Full name',
    example: 'John Doe',
  })
  fullname: string;

  @ApiPropertyOptional({
    description: 'Avatar URL if uploaded',
    example: 'https://example.com/avatar.jpg',
  })
  avatarUrl?: string;
}

export class UploadAvatarResponse {
  @ApiProperty({
    description: 'URL of the uploaded avatar',
    example: 'https://filebase.com/avatars/1234567890-avatar.jpg',
  })
  url: string;
}
