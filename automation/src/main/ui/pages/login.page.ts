import { Page } from '@playwright/test';
import { LoginLocators } from '@automation/main/ui/locators/login.locators';

export class LoginPage {
  constructor(private readonly page: Page) {}

  async open(): Promise<this> {
    await this.page.goto('/login.html');
    return this;
  }

  async fillEmail(email: string): Promise<this> {
    await this.page.locator(LoginLocators.email).fill(email);
    return this;
  }

  async fillPassword(password: string): Promise<this> {
    await this.page.locator(LoginLocators.password).fill(password);
    return this;
  }

  async submit(): Promise<this> {
    await this.page.locator(LoginLocators.submit).click();
    return this;
  }

  async waitForCatalogRedirect(): Promise<this> {
    await this.page.waitForURL('**/catalog.html', { timeout: 10_000 });
    return this;
  }

  getErrorLocator() {
    return this.page.locator(LoginLocators.error);
  }

  getEmailValidationLocator() {
    return this.page.locator(LoginLocators.emailValidation);
  }

  getPasswordValidationLocator() {
    return this.page.locator(LoginLocators.passwordValidation);
  }
}
