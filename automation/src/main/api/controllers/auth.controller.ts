import { HttpClient } from '@automation/main/api/clients/http-client';
import { LoginRequest } from '@automation/main/api/builders/user.builder';

export interface LoginResponse {
  token: string;
  user: { id: string; email: string; name: string };
}

export class AuthController {
  constructor(private readonly http: HttpClient) {}

  async login(body: LoginRequest) {
    return this.http.request<LoginResponse | { error: string }>({
      method: 'POST',
      url: '/api/auth/login',
      data: body,
    });
  }
}
