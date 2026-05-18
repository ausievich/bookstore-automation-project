import { Page, expect } from '@playwright/test';
import { CatalogPage } from '@automation/main/ui/pages/catalog.page';

export class CatalogSteps {
  private readonly catalogPage: CatalogPage;

  constructor(page: Page) {
    this.catalogPage = new CatalogPage(page);
  }

  async openCatalog(): Promise<void> {
    await this.catalogPage.open();
  }

  async search(title: string): Promise<void> {
    await this.catalogPage.search(title);
  }

  async filterByCategory(category: string): Promise<void> {
    await this.catalogPage.filterByCategory(category);
  }

  async sortByPrice(order: 'price_asc' | 'price_desc'): Promise<void> {
    await this.catalogPage.sortByPrice(order);
  }

  async addBook(bookId: string): Promise<void> {
    await this.catalogPage.addBookToCart(bookId);
  }

  async refreshCartCounter(): Promise<void> {
    await this.catalogPage.open();
    await this.catalogPage.getCartCounter().waitFor();
  }

  async expectBookVisible(titlePart: string): Promise<void> {
    await expect(this.catalogPage.getBookItems().filter({ hasText: titlePart }).first()).toBeVisible();
  }

  async expectFirstBookContains(text: string): Promise<void> {
    await expect(this.catalogPage.getBookItems().first()).toContainText(text);
  }

  async expectFirstBookShowsPrice(): Promise<void> {
    await expect(this.catalogPage.getBookItems().first()).toContainText('$');
  }

  async expectNoResults(): Promise<void> {
    await expect(this.catalogPage.getNoResultsMessage()).toBeVisible();
  }

  async expectCartCount(count: number): Promise<void> {
    await expect(this.catalogPage.getCartCounter()).toHaveText(String(count), { timeout: 10_000 });
  }
}
