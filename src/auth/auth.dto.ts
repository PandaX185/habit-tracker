import { IsEmail, IsJWT, IsNotEmpty, IsStrongPassword } from 'class-validator';

export class LoginRequest {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsStrongPassword({
    minLength: 8,
    minNumbers: 1,
  })
  password: string;
}

export class LoginResponse {
  @IsJWT()
  accessToken: string;
}

export class RegisterRequest {
  @IsNotEmpty()
  username: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  fullname: string;

  @IsNotEmpty()
  @IsStrongPassword({
    minLength: 8,
    minNumbers: 1,
  })
  password: string;
  avatarUrl?: string;
}

export class RegisterResponse {
  @IsJWT()
  accessToken: string;
}
