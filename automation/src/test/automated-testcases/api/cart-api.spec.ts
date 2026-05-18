/**
 * Domain: Online Bookstore
 * Feature: Cart API
 * Owner: bookstore-qa
 */
import { test, expect } from '@automation/test/test-base/fixtures';
import { CartController } from '@automation/main/api/controllers/cart.controller';
import { Owner, allureMetadata } from '@automation/main/common/annotations';

test.describe('Cart API', () => {
  test.beforeEach(async ({ authToken }) => {
    await allureMetadata({ layer: 'API', owner: Owner.Bookstore });
    await test.step('Verify auth token is present', async () => {
      expect(authToken).toBeTruthy();
    });
  });

  test('@TmsLink:C6001 add and get cart items', async ({ cartApi }) => {
    let addResponse: Awaited<ReturnType<CartController['addItem']>>;
    let cartResponse: Awaited<ReturnType<CartController['get']>>;

    await test.step('POST /api/cart/items with book b1', async () => {
      addResponse = await cartApi.addItem('b1', 1);
    });
    await test.step('Verify add item response', async () => {
      expect(addResponse.status).toBe(201);
    });
    await test.step('GET /api/cart', async () => {
      cartResponse = await cartApi.get();
    });
    await test.step('Verify cart has items', async () => {
      expect(cartResponse.status).toBe(200);
      expect(cartResponse.data.items.length).toBeGreaterThan(0);
    });
  });

  test('@TmsLink:C6002 update quantity and remove item', async ({ cartApi }) => {
    let updated: Awaited<ReturnType<CartController['updateItem']>>;
    let removed: Awaited<ReturnType<CartController['removeItem']>>;

    await test.step('POST /api/cart/items with book b4', async () => {
      await cartApi.addItem('b4', 1);
    });
    await test.step('PATCH /api/cart/items/b4 quantity to 2', async () => {
      updated = await cartApi.updateItem('b4', 2);
    });
    await test.step('Verify update item response', async () => {
      expect(updated.status).toBe(200);
    });
    await test.step('DELETE /api/cart/items/b4', async () => {
      removed = await cartApi.removeItem('b4');
    });
    await test.step('Verify book b4 removed from cart', async () => {
      expect(removed.status).toBe(200);
      expect(removed.data.items.find((item) => item.bookId === 'b4')).toBeUndefined();
    });
  });

  test('@TmsLink:C6003 stock limit returns 400', async ({ cartApi }) => {
    let response: Awaited<ReturnType<CartController['addItem']>>;

    await test.step('POST /api/cart/items with out-of-stock book b6', async () => {
      response = await cartApi.addItem('b6', 1);
    });
    await test.step('Verify 400 bad request response', async () => {
      expect(response.status).toBe(400);
    });
  });
});
