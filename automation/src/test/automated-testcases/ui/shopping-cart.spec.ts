/**
 * Domain: Online Bookstore
 * Feature: Shopping Cart
 * Owner: bookstore-qa
 * Test Description: Add, update, remove items and empty cart state
 */
import { test } from '@automation/test/test-base/fixtures';
import { loginAsBookstoreUser } from '@automation/test/test-base/ui-login';
import { CatalogSteps } from '@automation/main/ui/steps/catalog.steps';
import { CartSteps } from '@automation/main/ui/steps/cart.steps';
import { Owner, allureMetadata } from '@automation/main/common/annotations';

test.describe('Shopping Cart', () => {
  test.beforeEach(async ({ page }) => {
    await allureMetadata({ layer: 'UI', owner: Owner.Bookstore });
    await loginAsBookstoreUser(page);
  });

  test('@TmsLink:C3001 add book updates cart counter', async ({ page }) => {
    const catalog = new CatalogSteps(page);

    await test.step('Open catalog', async () => {
      await catalog.openCatalog();
    });

    await test.step('Add book b1 to cart', async () => {
      await catalog.addBook('b1');
    });

    await test.step('Refresh catalog page', async () => {
      await catalog.refreshCartCounter();
    });

    await test.step('Verify cart counter shows 1', async () => {
      await catalog.expectCartCount(1);
    });
  });

  test('@TmsLink:C3002 multiple books in cart', async ({ page }) => {
    const catalog = new CatalogSteps(page);
    const cart = new CartSteps(page);

    await test.step('Open catalog', async () => {
      await catalog.openCatalog();
    });

    await test.step('Add book b1 to cart', async () => {
      await catalog.addBook('b1');
    });

    await test.step('Add book b3 to cart', async () => {
      await catalog.addBook('b3');
    });

    await test.step('Open cart', async () => {
      await cart.openCart();
    });

    await test.step('Verify cart has 2 items', async () => {
      await cart.expectItemCount(2);
    });
  });

  test('@TmsLink:C3003 remove book from cart', async ({ page }) => {
    const catalog = new CatalogSteps(page);
    const cart = new CartSteps(page);

    await test.step('Open catalog', async () => {
      await catalog.openCatalog();
    });

    await test.step('Add book b1 to cart', async () => {
      await catalog.addBook('b1');
    });

    await test.step('Open cart', async () => {
      await cart.openCart();
    });

    await test.step('Remove book b1 from cart', async () => {
      await cart.removeItem('b1');
    });

    await test.step('Verify empty cart message', async () => {
      await cart.expectEmptyCart();
    });
  });

  test('@TmsLink:C3004 update quantity recalculates subtotal', async ({ page }) => {
    const catalog = new CatalogSteps(page);
    const cart = new CartSteps(page);

    await test.step('Open catalog', async () => {
      await catalog.openCatalog();
    });

    await test.step('Add book b4 to cart', async () => {
      await catalog.addBook('b4');
    });

    await test.step('Open cart', async () => {
      await cart.openCart();
    });

    await test.step('Set quantity of b4 to 2', async () => {
      await cart.updateQuantity('b4', 2);
    });

    await test.step('Verify subtotal contains 44.00', async () => {
      await cart.expectSubtotalContains('44.00');
    });
  });

  test('@TmsLink:C3005 empty cart message', async ({ page }) => {
    const cart = new CartSteps(page);

    await test.step('Open cart', async () => {
      await cart.openCart();
    });

    await test.step('Verify empty cart message', async () => {
      await cart.expectEmptyCart();
    });
  });
});
