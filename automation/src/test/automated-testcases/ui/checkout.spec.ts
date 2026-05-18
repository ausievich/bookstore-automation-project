/**
 * Domain: Online Bookstore
 * Feature: Checkout Flow
 * Owner: bookstore-qa
 */
import { test } from '@automation/test/test-base/fixtures';
import { loginAsBookstoreUser } from '@automation/test/test-base/ui-login';
import { CatalogSteps } from '@automation/main/ui/steps/catalog.steps';
import { CartSteps } from '@automation/main/ui/steps/cart.steps';
import { CheckoutSteps } from '@automation/main/ui/steps/checkout.steps';
import { Owner, allureMetadata } from '@automation/main/common/annotations';

test.describe('Checkout Flow', () => {
  test.beforeEach(async ({ page }) => {
    await allureMetadata({ layer: 'UI', owner: Owner.Bookstore });
    await loginAsBookstoreUser(page);

    const catalog = new CatalogSteps(page);
    await test.step('Open catalog', async () => {
      await catalog.openCatalog();
    });
    await test.step('Add book b3 to cart', async () => {
      await catalog.addBook('b3');
    });
  });

  test('@TmsLink:C4001 complete checkout and view order in list', async ({ page }) => {
    const cart = new CartSteps(page);
    const checkout = new CheckoutSteps(page);
    let orderId = '';

    await test.step('Open cart', async () => {
      await cart.openCart();
    });
    await test.step('Proceed to checkout', async () => {
      await cart.goToCheckout();
    });
    await test.step('Fill shipping and continue to payment', async () => {
      await checkout.fillShippingAndContinueToPayment();
    });
    await test.step('Fill payment and continue to review', async () => {
      await checkout.fillPaymentAndContinueToReview();
    });
    await test.step('Place order', async () => {
      await checkout.placeOrder();
    });
    await test.step('Verify order success page', async () => {
      await checkout.expectOrderSuccess();
    });
    await test.step('Read order number', async () => {
      orderId = await checkout.getOrderNumber();
    });
    await test.step('Open my orders list', async () => {
      await checkout.openOrdersList();
    });
    await test.step(`Verify order ${orderId} in list`, async () => {
      await checkout.expectOrderInList(orderId);
    });
  });
});
