import { HttpClient } from '@automation/main/api/clients/http-client';
import { ApiErrorDto } from '@automation/main/api/models/api-error.models';
import { LoginRequest, LoginResponse } from '@automation/main/api/models/auth.models';

export class AuthController {
  constructor(private readonly http: HttpClient) {}

  async login(body: LoginRequest) {
    return this.http.request<LoginResponse | ApiErrorDto>({
      method: 'POST',
      url: '/api/auth/login',
      data: body,
    });
  }
}
