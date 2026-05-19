export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthUserDto {
  id: string;
  email: string;
  name: string;
}

export interface LoginResponse {
  token: string;
  user: AuthUserDto;
}
