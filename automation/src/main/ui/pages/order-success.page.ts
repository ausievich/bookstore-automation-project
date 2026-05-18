import { Page } from '@playwright/test';

export class OrderSuccessPage {
  constructor(private readonly page: Page) {}

  getHeading() {
    return this.page.locator('[data-testid="order-success-heading"]');
  }

  getOrderNumber() {
    return this.page.locator('[data-testid="order-number"]');
  }
}
