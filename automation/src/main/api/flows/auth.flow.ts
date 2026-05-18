import { HttpClient } from '@automation/main/api/clients/http-client';
import { AuthController } from '@automation/main/api/controllers/auth.controller';
import { UserBuilder } from '@automation/main/api/builders/user.builder';

export class AuthFlow {
  private readonly auth: AuthController;

  constructor(http: HttpClient) {
    this.auth = new AuthController(http);
  }

  async loginAsDefaultUser(): Promise<string> {
    const { status, data } = await this.auth.login(new UserBuilder().build());
    if (status !== 200 || !('token' in data)) {
      throw new Error('Failed to authenticate default test user');
    }
    return data.token;
  }
}
