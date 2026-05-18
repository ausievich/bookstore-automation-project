import { Page, expect } from '@playwright/test';
import { CheckoutPage, ShippingDetails } from '@automation/main/ui/pages/checkout.page';
import { OrderSuccessPage } from '@automation/main/ui/pages/order-success.page';

const defaultShipping: ShippingDetails = {
  name: 'Test User',
  address: '123 Main St',
  city: 'Charlottesville',
  zip: '22901',
};

export class CheckoutSteps {
  private readonly checkoutPage: CheckoutPage;
  private readonly orderSuccessPage: OrderSuccessPage;

  constructor(page: Page) {
    this.checkoutPage = new CheckoutPage(page);
    this.orderSuccessPage = new OrderSuccessPage(page);
  }

  async completeCheckout(shipping: ShippingDetails = defaultShipping): Promise<void> {
    await testStep('Complete multi-step checkout', async () => {
      await this.checkoutPage.open();
      await this.checkoutPage.fillShipping(shipping);
      await this.checkoutPage.continueToPayment();
      await expect(this.checkoutPage.getPaymentSection()).toBeVisible();
      await this.checkoutPage.continueToReview();
      await expect(this.checkoutPage.getOrderSummary()).toContainText('Total:');
      await this.checkoutPage.placeOrder();
    });
  }

  async expectOrderSuccess(): Promise<void> {
    await expect(this.orderSuccessPage.getHeading()).toBeVisible();
    await expect(this.orderSuccessPage.getOrderNumber()).not.toBeEmpty();
  }
}

async function testStep<T>(title: string, body: () => Promise<T>): Promise<T> {
  const { test } = await import('@playwright/test');
  return test.step(title, body);
}
