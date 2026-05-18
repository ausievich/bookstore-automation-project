import { Page } from '@playwright/test';

export class CatalogPage {
  constructor(private readonly page: Page) {}

  async open(): Promise<this> {
    await this.page.goto('/catalog.html');
    return this;
  }

  async search(query: string): Promise<this> {
    await this.page.locator('[data-testid="search-input"]').fill(query);
    await this.page.locator('[data-testid="search-submit"]').click();
    return this;
  }

  async filterByCategory(category: string): Promise<this> {
    await this.page.locator('[data-testid="category-filter"]').selectOption(category);
    await this.page.locator('[data-testid="search-submit"]').click();
    return this;
  }

  async sortByPrice(order: 'price_asc' | 'price_desc'): Promise<this> {
    await this.page.locator('[data-testid="sort-select"]').selectOption(order);
    await this.page.locator('[data-testid="search-submit"]').click();
    return this;
  }

  async addBookToCart(bookId: string): Promise<this> {
    const response = this.page.waitForResponse((r) => r.url().includes('/api/cart/items') && r.status() === 201);
    await this.page.locator(`[data-testid="add-to-cart-${bookId}"]`).click();
    await response;
    return this;
  }

  getBookItems() {
    return this.page.locator('[data-testid="book-list"] li');
  }

  getNoResultsMessage() {
    return this.page.locator('[data-testid="no-results-message"]');
  }

  getCartCounter() {
    return this.page.locator('[data-testid="cart-counter"]');
  }

  getDashboardHeading() {
    return this.page.locator('[data-testid="dashboard-heading"]');
  }
}
