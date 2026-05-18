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
  private readonly page: Page;
  private readonly checkoutPage: CheckoutPage;
  private readonly orderSuccessPage: OrderSuccessPage;

  constructor(page: Page) {
    this.page = page;
    this.checkoutPage = new CheckoutPage(page);
    this.orderSuccessPage = new OrderSuccessPage(page);
  }

  async openCheckout(): Promise<void> {
    await this.checkoutPage.open();
  }

  async fillShippingAndContinueToPayment(shipping: ShippingDetails = defaultShipping): Promise<void> {
    await this.checkoutPage.fillShipping(shipping);
    await this.checkoutPage.continueToPayment();
    await expect(this.checkoutPage.getPaymentSection()).toBeVisible();
  }

  async fillPaymentAndContinueToReview(): Promise<void> {
    await this.checkoutPage.continueToReview();
    await expect(this.checkoutPage.getOrderSummary()).toContainText('Total:');
  }

  async placeOrder(): Promise<void> {
    await this.checkoutPage.placeOrder();
  }

  async expectOrderSuccess(): Promise<void> {
    await expect(this.orderSuccessPage.getHeading()).toBeVisible();
    await expect(this.orderSuccessPage.getOrderNumber()).not.toBeEmpty();
  }

  async getOrderNumber(): Promise<string> {
    const text = await this.orderSuccessPage.getOrderNumber().textContent();
    return text?.trim() ?? '';
  }

  async openOrdersList(): Promise<void> {
    await this.page.locator('[data-testid="view-orders-link"]').click();
  }

  async expectOrderInList(orderId: string): Promise<void> {
    await expect(this.page.locator(`[data-testid="order-${orderId}"]`)).toBeVisible();
  }
}
