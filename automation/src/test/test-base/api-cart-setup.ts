import { test } from '@playwright/test';
import { CartController } from '@automation/main/api/controllers/cart.controller';

export async function addBookToCartViaApi(cartApi: CartController, bookId: string, quantity: number): Promise<void> {
  await test.step(`Add book ${bookId} to cart via API`, async () => {
    await cartApi.addItem(bookId, quantity);
  });
}
