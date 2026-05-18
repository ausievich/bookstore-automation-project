export const TestUsers = {
  valid: {
    email: 'user@bookstore.test',
    password: 'password123',
  },
  invalidPassword: {
    email: 'user@bookstore.test',
    password: 'wrong-password',
  },
} as const;
