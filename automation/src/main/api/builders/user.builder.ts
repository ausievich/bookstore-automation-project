import { LoginRequest } from '@automation/main/api/models/auth.models';

export class UserBuilder {
  private data: LoginRequest = {
    email: 'user@bookstore.test',
    password: 'password123',
  };

  withEmail(email: string): this {
    this.data.email = email;
    return this;
  }

  withPassword(password: string): this {
    this.data.password = password;
    return this;
  }

  build(): LoginRequest {
    return { ...this.data };
  }
}
