/**
 * Domain: Online Bookstore
 * Feature: Book Search & Filtering
 * Owner: bookstore-qa
 */
import { test, expect } from '@automation/test/test-base/fixtures';
import { LoginSteps } from '@automation/main/ui/steps/login.steps';
import { CatalogSteps } from '@automation/main/ui/steps/catalog.steps';
import { CatalogPage } from '@automation/main/ui/pages/catalog.page';
import { TestUsers } from '@automation/main/common/constants/credentials';
import { allure } from 'allure-playwright';
import { Owner } from '@automation/main/common/annotations';

test.describe('Book Search & Filtering', () => {
  test.beforeEach(async ({ page }) => {
    await allure.owner(Owner.Bookstore);
    await allure.feature('Catalog');
    const login = new LoginSteps(page);
    await login.loginAsValidUser(TestUsers.valid.email, TestUsers.valid.password);
  });

  test('@TmsLink:C2001 search by title shows matching books', async ({ page }) => {
    const steps = new CatalogSteps(page);
    await steps.searchByTitle('Dune');
    await steps.expectBookVisible('Dune');
  });

  test('@TmsLink:C2002 filter by category', async ({ page }) => {
    const catalog = new CatalogPage(page);
    await catalog.open();
    await catalog.filterByCategory('Technology');
    await expect(catalog.getBookItems().first()).toContainText('Technology');
  });

  test('@TmsLink:C2003 sort by price ascending', async ({ page }) => {
    const catalog = new CatalogPage(page);
    await catalog.open();
    await catalog.sortByPrice('price_asc');
    const first = catalog.getBookItems().first();
    await expect(first).toContainText('$');
  });

  test('@TmsLink:C2004 no results message', async ({ page }) => {
    const steps = new CatalogSteps(page);
    await steps.searchByTitle('zzzz-nonexistent-title');
    await steps.expectNoResults();
  });
});
