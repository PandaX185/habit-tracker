import { IsEmail, IsJWT, IsNotEmpty, IsStrongPassword, IsOptional, IsString, IsUrl, Length, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LoginRequest {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
    format: 'email',
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'StrongPass123!',
    minLength: 8,
  })
  @IsNotEmpty({ message: 'Password is required' })
  @IsStrongPassword({
    minLength: 8,
    minNumbers: 1,
    minLowercase: 1,
    minUppercase: 1,
    minSymbols: 1,
  }, {
    message: 'Password must be at least 8 characters long and contain at least one number, one lowercase letter, one uppercase letter, and one special character'
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
    minLength: 3,
    maxLength: 30,
    pattern: '^[a-zA-Z0-9_-]+$',
  })
  @IsNotEmpty({ message: 'Username is required' })
  @IsString()
  @Length(3, 30, { message: 'Username must be between 3 and 30 characters' })
  @Matches(/^[a-zA-Z0-9_-]+$/, { message: 'Username can only contain letters, numbers, underscores, and hyphens' })
  username: string;

  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
    format: 'email',
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({
    description: 'Full name of the user',
    example: 'John Doe',
    minLength: 1,
    maxLength: 100,
  })
  @IsNotEmpty({ message: 'Full name is required' })
  @IsString()
  @Length(1, 100, { message: 'Full name must be between 1 and 100 characters' })
  fullname: string;

  @ApiProperty({
    description: 'Strong password for the account',
    example: 'StrongPass123!',
    minLength: 8,
  })
  @IsNotEmpty({ message: 'Password is required' })
  @IsStrongPassword({
    minLength: 8,
    minNumbers: 1,
    minLowercase: 1,
    minUppercase: 1,
  }, {
    message: 'Password must be at least 8 characters long and contain at least one number, one lowercase letter, and one uppercase letter'
  })
  password: string;

  @ApiPropertyOptional({
    description: 'Optional avatar URL',
    example: 'https://example.com/avatar.jpg',
    format: 'url',
  })
  @IsOptional()
  @IsUrl({}, { message: 'Avatar URL must be a valid URL' })
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
