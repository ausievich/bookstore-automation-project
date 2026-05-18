/**
 * Domain: Online Bookstore
 * Feature: Checkout Flow
 * Owner: bookstore-qa
 */
import { test, expect } from '@automation/test/test-base/fixtures';
import { LoginSteps } from '@automation/main/ui/steps/login.steps';
import { CatalogSteps } from '@automation/main/ui/steps/catalog.steps';
import { CartSteps } from '@automation/main/ui/steps/cart.steps';
import { CheckoutSteps } from '@automation/main/ui/steps/checkout.steps';
import { TestUsers } from '@automation/main/common/constants/credentials';
import { Owner, allureMetadata } from '@automation/main/common/annotations';

test.describe('Checkout Flow', () => {
  test.beforeEach(async ({ page }) => {
    await allureMetadata({ layer: 'UI', owner: Owner.Bookstore });
    const login = new LoginSteps(page);
    await login.loginAsValidUser(TestUsers.valid.email, TestUsers.valid.password);
    const catalog = new CatalogSteps(page);
    await catalog.addBook('b3');
  });

  test('@TmsLink:C4001 complete checkout and view order in list', async ({ page }) => {
    const cart = new CartSteps(page);
    await cart.openCart();
    await page.locator('[data-testid="checkout-link"]').click();

    const checkout = new CheckoutSteps(page);
    await checkout.completeCheckout();
    await checkout.expectOrderSuccess();

    const orderId = await page.locator('[data-testid="order-number"]').textContent();
    await page.locator('[data-testid="view-orders-link"]').click();
    await expect(page.locator(`[data-testid="order-${orderId}"]`)).toBeVisible();
  });
});
