import { Page } from '@playwright/test';

export interface ShippingDetails {
  name: string;
  address: string;
  city: string;
  zip: string;
}

export class CheckoutPage {
  constructor(private readonly page: Page) {}

  async open(): Promise<this> {
    await this.page.goto('/checkout.html');
    return this;
  }

  async fillShipping(details: ShippingDetails): Promise<this> {
    await this.page.locator('[data-testid="ship-name"]').fill(details.name);
    await this.page.locator('[data-testid="ship-address"]').fill(details.address);
    await this.page.locator('[data-testid="ship-city"]').fill(details.city);
    await this.page.locator('[data-testid="ship-zip"]').fill(details.zip);
    return this;
  }

  async continueToPayment(): Promise<this> {
    await this.page.locator('[data-testid="shipping-next"]').click();
    return this;
  }

  async continueToReview(cardLast4 = '4242'): Promise<this> {
    await this.page.locator('[data-testid="card-last4"]').fill(cardLast4);
    await this.page.locator('[data-testid="payment-next"]').click();
    return this;
  }

  async placeOrder(): Promise<this> {
    await this.page.locator('[data-testid="confirm-order"]').click();
    await this.page.waitForURL(/order-success\.html/, { waitUntil: 'domcontentloaded' });
    return this;
  }

  getOrderSummary() {
    return this.page.locator('[data-testid="order-summary"]');
  }

  getPaymentSection() {
    return this.page.locator('[data-testid="payment-section"]');
  }
}
