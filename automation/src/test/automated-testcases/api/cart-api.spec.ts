/**
 * Domain: Online Bookstore
 * Feature: Cart API
 * Owner: bookstore-qa
 */
import { test, expect } from '@automation/test/test-base/fixtures';
import { Owner, allureMetadata } from '@automation/main/common/annotations';

test.describe('Cart API', () => {
  test.beforeEach(async ({ authToken }) => {
    await allureMetadata({ layer: 'API', owner: Owner.Bookstore });
    expect(authToken).toBeTruthy();
  });

  test('@TmsLink:C6001 add and get cart items', async ({ cartApi }) => {
    const add = await cartApi.addItem('b1', 1);
    expect(add.status).toBe(201);

    const cart = await cartApi.get();
    expect(cart.status).toBe(200);
    expect(cart.data.items.length).toBeGreaterThan(0);
  });

  test('@TmsLink:C6002 update quantity and remove item', async ({ cartApi }) => {
    await cartApi.addItem('b4', 1);
    const updated = await cartApi.updateItem('b4', 2);
    expect(updated.status).toBe(200);

    const removed = await cartApi.removeItem('b4');
    expect(removed.status).toBe(200);
    expect(removed.data.items.find((i) => i.bookId === 'b4')).toBeUndefined();
  });

  test('@TmsLink:C6003 stock limit returns 400', async ({ cartApi }) => {
    const result = await cartApi.addItem('b6', 1);
    expect(result.status).toBe(400);
  });
});
