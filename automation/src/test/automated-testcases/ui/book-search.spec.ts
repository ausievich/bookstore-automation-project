/**
 * Domain: Online Bookstore
 * Feature: Book Search & Filtering
 * Owner: bookstore-qa
 * Test Description: Search, category filter, price sort, and empty results
 */
import { test } from '@automation/test/test-base/fixtures';
import { CatalogSteps } from '@automation/main/ui/steps/catalog.steps';
import { Owner, allureMetadata } from '@automation/main/common/annotations';

test.describe('Book Search & Filtering', () => {
  test.beforeEach(async () => {
    await allureMetadata({ layer: 'UI', owner: Owner.Bookstore });
  });

  test('@TmsLink:C2001 search by title shows matching books', async ({ catalogPage }) => {
    const catalog = new CatalogSteps(catalogPage);

    await test.step('Search for "Dune"', async () => {
      await catalog.search('Dune');
    });

    await test.step('Verify search results', async () => {
      await catalog.expectAllVisibleBooksContain('Dune');
    });
  });

  test('@TmsLink:C2002 filter by category', async ({ catalogPage }) => {
    const catalog = new CatalogSteps(catalogPage);

    await test.step('Filter by category "Technology"', async () => {
      await catalog.filterByCategory('Technology');
    });

    await test.step('Verify Technology category results', async () => {
      await catalog.expectAllVisibleBooksInCategory('Technology');
    });
  });

  test('@TmsLink:C2003 sort by price ascending', async ({ catalogPage }) => {
    const catalog = new CatalogSteps(catalogPage);

    await test.step('Sort books by price ascending', async () => {
      await catalog.sortByPrice('price_asc');
    });

    await test.step('Verify books sorted by price ascending', async () => {
      await catalog.expectPricesSorted('asc');
    });
  });

  test('@TmsLink:C2005 sort by price descending', async ({ catalogPage }) => {
    const catalog = new CatalogSteps(catalogPage);

    await test.step('Sort books by price descending', async () => {
      await catalog.sortByPrice('price_desc');
    });

    await test.step('Verify books sorted by price descending', async () => {
      await catalog.expectPricesSorted('desc');
    });
  });

  test('@TmsLink:C2004 no results message', async ({ catalogPage }) => {
    const catalog = new CatalogSteps(catalogPage);

    await test.step('Search for nonexistent title', async () => {
      await catalog.search('zzzz-nonexistent-title');
    });

    await test.step('Verify no results message', async () => {
      await catalog.expectNoResults();
    });
  });
});
