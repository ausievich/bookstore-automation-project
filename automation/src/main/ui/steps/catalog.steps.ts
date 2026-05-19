import { Page, expect } from '@playwright/test';
import { CatalogPage } from '@automation/main/ui/pages/catalog.page';

export class CatalogSteps {
  private readonly catalogPage: CatalogPage;

  constructor(page: Page) {
    this.catalogPage = new CatalogPage(page);
  }

  async openCatalog(): Promise<void> {
    await this.catalogPage.open();
    await expect(this.catalogPage.getBookItems()).not.toHaveCount(0);
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

  async expectAllVisibleBooksContain(text: string): Promise<void> {
    const titles = this.catalogPage.getBookTitles();

    await expect.poll(async () => {
      const count = await this.catalogPage.getBookItems().count();
      if (count === 0) return false;
      const matching = await titles.filter({ hasText: text }).count();
      return matching === count;
    }).toBe(true);
  }

  async expectAllVisibleBooksInCategory(category: string): Promise<void> {
    const categories = this.catalogPage.getBookCategories();

    await expect.poll(async () => {
      const count = await this.catalogPage.getBookItems().count();
      if (count === 0) return false;
      const matching = await categories.filter({ hasText: category }).count();
      return matching === count;
    }).toBe(true);
  }

  async expectPricesSorted(order: 'asc' | 'desc'): Promise<void> {
    await expect.poll(async () => {
      const prices = await this.readVisibleBookPrices();
      if (prices.length < 2) return false;
      return prices.every(
        (price, index) =>
          index === 0 ||
          (order === 'asc' ? price >= prices[index - 1] : price <= prices[index - 1]),
      );
    }).toBe(true);
  }

  async expectNoResults(): Promise<void> {
    await expect(this.catalogPage.getNoResultsMessage()).toBeVisible();
    await expect(this.catalogPage.getBookItems()).toHaveCount(0);
  }

  private async readVisibleBookPrices(): Promise<number[]> {
    return this.catalogPage.getBookPrices().evaluateAll((elements) =>
      elements.map((element) => Number(element.getAttribute('data-price'))),
    );
  }

  async expectCartCount(count: number): Promise<void> {
    await expect(this.catalogPage.getCartCounter()).toHaveText(String(count), { timeout: 10_000 });
  }
}
