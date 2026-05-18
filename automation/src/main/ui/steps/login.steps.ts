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

  async openLogin(): Promise<void> {
    await this.loginPage.open();
  }

  async submitCredentials(email: string, password: string): Promise<void> {
    await this.loginPage.fillEmail(email);
    await this.loginPage.fillPassword(password);
    await this.loginPage.submit();
  }

  async submitEmptyForm(): Promise<void> {
    await this.loginPage.submit();
  }

  async waitForCatalogRedirect(): Promise<void> {
    await this.loginPage.waitForCatalogRedirect();
  }

  async expectDashboardVisible(): Promise<void> {
    await expect(this.catalogPage.getDashboardHeading()).toBeVisible();
  }

  async expectLoginError(): Promise<void> {
    await expect(this.loginPage.getErrorLocator()).toBeVisible();
  }

  async expectValidationMessages(): Promise<void> {
    await expect(this.loginPage.getEmailValidationLocator()).toBeVisible();
    await expect(this.loginPage.getPasswordValidationLocator()).toBeVisible();
  }
}
