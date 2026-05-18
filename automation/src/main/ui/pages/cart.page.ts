import { Page } from '@playwright/test';

export class CartPage {
  constructor(private readonly page: Page) {}

  async open(): Promise<this> {
    await this.page.goto('/cart.html');
    return this;
  }

  async goToCheckout(): Promise<this> {
    await this.page.locator('[data-testid="checkout-link"]').click();
    return this;
  }

  async updateQuantity(bookId: string, quantity: number): Promise<this> {
    await this.page.locator(`[data-testid="qty-${bookId}"]`).fill(String(quantity));
    await this.page.locator(`[data-testid="qty-${bookId}"]`).blur();
    return this;
  }

  async removeItem(bookId: string): Promise<this> {
    await this.page.locator(`[data-testid="remove-${bookId}"]`).click();
    return this;
  }

  getItems() {
    return this.page.locator('[data-testid="cart-items"] li');
  }

  getEmptyMessage() {
    return this.page.locator('[data-testid="empty-cart-message"]');
  }

  getSubtotal() {
    return this.page.locator('[data-testid="cart-subtotal"]');
  }
}
