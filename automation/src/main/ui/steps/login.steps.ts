import { Page, expect } from '@playwright/test';
import { LoginPage } from '@automation/main/ui/pages/login.page';
import { CatalogPage } from '@automation/main/ui/pages/catalog.page';

export class LoginSteps {
  private readonly loginPage: LoginPage;
  private readonly catalogPage: CatalogPage;

  constructor(page: Page) {
    this.loginPage = new LoginPage(page);
    this.catalogPage = new CatalogPage(page);
  }

  async loginAs(email: string, password: string): Promise<void> {
    await testStep('Open login page', () => this.loginPage.open());
    await testStep('Submit credentials', async () => {
      await this.loginPage.fillEmail(email);
      await this.loginPage.fillPassword(password);
      await this.loginPage.submit();
    });
  }

  async loginAsValidUser(email: string, password: string): Promise<void> {
    await this.loginAs(email, password);
    await this.loginPage.waitForCatalogRedirect();
  }

  async expectDashboardVisible(): Promise<void> {
    await testStep('Verify catalog dashboard', async () => {
      await expect(this.catalogPage.getDashboardHeading()).toBeVisible();
    });
  }

  async expectLoginError(): Promise<void> {
    await testStep('Verify login error', async () => {
      await expect(this.loginPage.getErrorLocator()).toBeVisible();
    });
  }

  async expectValidationMessages(): Promise<void> {
    await testStep('Verify validation messages', async () => {
      await expect(this.loginPage.getEmailValidationLocator()).toBeVisible();
      await expect(this.loginPage.getPasswordValidationLocator()).toBeVisible();
    });
  }

  async submitEmptyLogin(): Promise<void> {
    await this.loginPage.open();
    await this.loginPage.submit();
  }
}

async function testStep<T>(title: string, body: () => Promise<T>): Promise<T> {
  const { test } = await import('@playwright/test');
  return test.step(title, body);
}
