import { Page, expect } from '@playwright/test';
import { CartPage } from '@automation/main/ui/pages/cart.page';

export class CartSteps {
  private readonly cartPage: CartPage;

  constructor(page: Page) {
    this.cartPage = new CartPage(page);
  }

  async openCart(): Promise<void> {
    await testStep('Open cart', () => this.cartPage.open());
  }

  async expectItemCount(count: number): Promise<void> {
    await expect(this.cartPage.getItems()).toHaveCount(count);
  }

  async expectEmptyCart(): Promise<void> {
    await expect(this.cartPage.getEmptyMessage()).toBeVisible();
  }

  async removeItem(bookId: string): Promise<void> {
    await this.cartPage.removeItem(bookId);
  }

  async updateQuantity(bookId: string, qty: number): Promise<void> {
    await this.cartPage.updateQuantity(bookId, qty);
  }

  async expectSubtotalContains(amount: string): Promise<void> {
    await expect(this.cartPage.getSubtotal()).toContainText(amount);
  }
}

async function testStep<T>(title: string, body: () => Promise<T>): Promise<T> {
  const { test } = await import('@playwright/test');
  return test.step(title, body);
}
