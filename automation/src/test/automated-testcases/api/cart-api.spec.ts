/**
 * Domain: Online Bookstore
 * Feature: Cart API
 * Owner: bookstore-qa
 * Test Description: Cart item lifecycle and stock limit validation
 */
import { test, expect } from '@automation/test/test-base/fixtures';
import { CartController } from '@automation/main/api/controllers/cart.controller';
import { CartDto } from '@automation/main/api/models/cart.models';
import { Owner, allureMetadata } from '@automation/main/common/annotations';

test.describe('Cart API', () => {
  test.beforeEach(async ({ authToken }) => {
    await allureMetadata({ layer: 'API', owner: Owner.Bookstore });

    await test.step('Verify auth token is present', async () => {
      expect(authToken).toBeTruthy();
    });
  });

  test('@TmsLink:C6001 POST /api/cart/items adds item to cart', async ({ cartApi }) => {
    let response: Awaited<ReturnType<CartController['addItem']>>;

    await test.step('POST /api/cart/items with book b1', async () => {
      response = await cartApi.addItem('b1', 1);
    });

    await test.step('Verify add item response', async () => {
      expect(response.status).toBe(201);
      const cart = response.data as CartDto;
      expect(cart.items.some((item) => item.bookId === 'b1')).toBe(true);
    });
  });

  test('@TmsLink:C6002 GET /api/cart returns current cart', async ({ cartApi }) => {
    let cartResponse: Awaited<ReturnType<CartController['get']>>;

    await test.step('POST /api/cart/items with book b1', async () => {
      await cartApi.addItem('b1', 1);
    });

    await test.step('GET /api/cart', async () => {
      cartResponse = await cartApi.get();
    });

    await test.step('Verify cart has items', async () => {
      expect(cartResponse.status).toBe(200);
      expect(cartResponse.data.items.length).toBeGreaterThan(0);
      expect(cartResponse.data.subtotal).toBeGreaterThan(0);
    });
  });

  test('@TmsLink:C6003 PATCH /api/cart/items/:id updates quantity', async ({ cartApi }) => {
    const bookId = 'b4';
    const updatedQuantity = 2;
    let response: Awaited<ReturnType<CartController['updateItem']>>;

    await test.step('POST /api/cart/items with book b4', async () => {
      await cartApi.addItem(bookId, 1);
    });

    await test.step(`PATCH /api/cart/items/${bookId} quantity to ${updatedQuantity}`, async () => {
      response = await cartApi.updateItem(bookId, updatedQuantity);
    });

    await test.step('Verify update item response', async () => {
      expect(response.status).toBe(200);
      const cart = response.data as CartDto;
      expect(cart.items.find((item) => item.bookId === bookId)?.quantity).toBe(updatedQuantity);
    });
  });

  test('@TmsLink:C6004 DELETE /api/cart/items/:id removes item', async ({ cartApi }) => {
    const bookId = 'b4';
    let response: Awaited<ReturnType<CartController['removeItem']>>;

    await test.step('POST /api/cart/items with book b4', async () => {
      await cartApi.addItem(bookId, 1);
    });

    await test.step(`DELETE /api/cart/items/${bookId}`, async () => {
      response = await cartApi.removeItem(bookId);
    });

    await test.step('Verify book removed from cart', async () => {
      expect(response.status).toBe(200);
      expect(response.data.items.find((item) => item.bookId === bookId)).toBeUndefined();
    });
  });

  test('@TmsLink:C6005 POST /api/cart/items returns 400 when stock limit exceeded', async ({ cartApi }) => {
    let response: Awaited<ReturnType<CartController['addItem']>>;

    await test.step('POST /api/cart/items with out-of-stock book b6', async () => {
      response = await cartApi.addItem('b6', 1);
    });

    await test.step('Verify 400 bad request response', async () => {
      expect(response.status).toBe(400);
    });
  });
});
