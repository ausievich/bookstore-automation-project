import { Page, expect } from '@playwright/test';
import { CatalogPage } from '@automation/main/ui/pages/catalog.page';

export class CatalogSteps {
  private readonly catalogPage: CatalogPage;

  constructor(page: Page) {
    this.catalogPage = new CatalogPage(page);
  }

  async searchByTitle(title: string): Promise<void> {
    await testStep(`Search for "${title}"`, async () => {
      await this.catalogPage.open();
      await this.catalogPage.search(title);
    });
  }

  async expectBookVisible(titlePart: string): Promise<void> {
    await testStep('Verify search results', async () => {
      await expect(this.catalogPage.getBookItems().filter({ hasText: titlePart }).first()).toBeVisible();
    });
  }

  async expectNoResults(): Promise<void> {
    await expect(this.catalogPage.getNoResultsMessage()).toBeVisible();
  }

  async addBook(bookId: string): Promise<void> {
    await testStep(`Add book ${bookId} to cart`, async () => {
      await this.catalogPage.open();
      await this.catalogPage.addBookToCart(bookId);
    });
  }

  async expectCartCount(count: number): Promise<void> {
    await expect(this.catalogPage.getCartCounter()).toHaveText(String(count), { timeout: 10_000 });
  }

  async refreshCartCounter(): Promise<void> {
    await this.catalogPage.open();
    await this.catalogPage.getCartCounter().waitFor();
  }
}

async function testStep<T>(title: string, body: () => Promise<T>): Promise<T> {
  const { test } = await import('@playwright/test');
  return test.step(title, body);
}
