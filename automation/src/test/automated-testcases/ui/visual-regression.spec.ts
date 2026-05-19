/**
 * Domain: Online Bookstore
 * Feature: Visual Regression
 * Owner: bookstore-qa
 * Test Description: Screenshot comparison for stable UI surfaces
 */
import { test, expect } from '@automation/test/test-base/fixtures';
import { LoginSteps } from '@automation/main/ui/steps/login.steps';
import { LoginPage } from '@automation/main/ui/pages/login.page';
import { CartPage } from '@automation/main/ui/pages/cart.page';
import { CartSteps } from '@automation/main/ui/steps/cart.steps';
import { loginAsBookstoreUser } from '@automation/test/test-base/ui-login';
import { Owner, allureMetadata } from '@automation/main/common/annotations';

test.describe('Visual regression', () => {
  test.beforeEach(async () => {
    await allureMetadata({ layer: 'UI', owner: Owner.Bookstore });
  });

  test('@TmsLink:C9001 login form matches baseline screenshot', async ({ page }) => {
    const steps = new LoginSteps(page);
    const loginPage = new LoginPage(page);

    await test.step('Open login page', async () => {
      await steps.openLogin();
    });

    await test.step('Compare login card screenshot', async () => {
      const loginCard = loginPage.getLoginCardLocator();
      await expect(loginCard).toBeVisible();
      await expect(loginCard).toHaveScreenshot('login-card.png');
    });
  });

  test('@TmsLink:C9002 empty cart summary card matches baseline screenshot', async ({ page }) => {
    const cartPage = new CartPage(page);
    const cart = new CartSteps(page);

    await test.step('Login and open empty cart', async () => {
      await loginAsBookstoreUser(page);
      await cart.openCart();
    });

    await test.step('Verify empty cart state', async () => {
      await cart.expectEmptyCart();
    });

    await test.step('Compare cart summary card screenshot', async () => {
      const summaryCard = cartPage.getSummaryCardLocator();
      await expect(summaryCard).toBeVisible();
      await expect(summaryCard).toHaveScreenshot('empty-cart-summary-card.png');
    });
  });
});
