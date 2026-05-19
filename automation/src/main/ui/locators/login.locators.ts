export const LoginLocators = {
  email: '[data-testid="email-input"]',
  password: '[data-testid="password-input"]',
  submit: '[data-testid="login-submit"]',
  error: '[data-testid="login-error"]',
  emailValidation: '[data-testid="email-validation"]',
  passwordValidation: '[data-testid="password-validation"]',
  heading: '[data-testid="login-heading"]',
  card: '[data-testid="login-card"]',
} as const;
