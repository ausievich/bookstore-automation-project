/**
 * Domain: Online Bookstore
 * Feature: Book Search & Filtering
 * Owner: bookstore-qa
 */
import { test } from '@automation/test/test-base/fixtures';
import { loginAsBookstoreUser } from '@automation/test/test-base/ui-login';
import { CatalogSteps } from '@automation/main/ui/steps/catalog.steps';
import { Owner, allureMetadata } from '@automation/main/common/annotations';

test.describe('Book Search & Filtering', () => {
  test.beforeEach(async ({ page }) => {
    await allureMetadata({ layer: 'UI', owner: Owner.Bookstore });
    await loginAsBookstoreUser(page);
  });

  test('@TmsLink:C2001 search by title shows matching books', async ({ page }) => {
    const catalog = new CatalogSteps(page);

    await test.step('Open catalog', async () => {
      await catalog.openCatalog();
    });

    await test.step('Search for "Dune"', async () => {
      await catalog.search('Dune');
    });

    await test.step('Verify search results', async () => {
      await catalog.expectAllVisibleBooksContain('Dune');
    });
  });

  test('@TmsLink:C2002 filter by category', async ({ page }) => {
    const catalog = new CatalogSteps(page);

    await test.step('Open catalog', async () => {
      await catalog.openCatalog();
    });

    await test.step('Filter by category "Technology"', async () => {
      await catalog.filterByCategory('Technology');
    });

    await test.step('Verify Technology category results', async () => {
      await catalog.expectAllVisibleBooksInCategory('Technology');
    });
  });

  test('@TmsLink:C2003 sort by price ascending', async ({ page }) => {
    const catalog = new CatalogSteps(page);

    await test.step('Open catalog', async () => {
      await catalog.openCatalog();
    });

    await test.step('Sort books by price ascending', async () => {
      await catalog.sortByPrice('price_asc');
    });

    await test.step('Verify books sorted by price ascending', async () => {
      await catalog.expectPricesSorted('asc');
    });
  });

  test('@TmsLink:C2004 no results message', async ({ page }) => {
    const catalog = new CatalogSteps(page);

    await test.step('Open catalog', async () => {
      await catalog.openCatalog();
    });

    await test.step('Search for nonexistent title', async () => {
      await catalog.search('zzzz-nonexistent-title');
    });

    await test.step('Verify no results message', async () => {
      await catalog.expectNoResults();
    });
  });
});
