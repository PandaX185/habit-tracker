export class LoginRequest {
    email: string;
    password: string;
}

export class LoginResponse {
    accessToken: string;
}

export class RegisterRequest {
    username: string;
    email: string;
    fullname: string;
    password: string;
    avatarUrl?: string;
}

export class RegisterResponse {
    accessToken: string;
}
