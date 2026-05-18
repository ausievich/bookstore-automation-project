/**
 * Domain: Online Bookstore
 * Feature: Orders API
 * Owner: bookstore-qa
 */
import { test, expect } from '@automation/test/test-base/fixtures';
import { addBookToCartViaApi } from '@automation/test/test-base/api-cart-setup';
import { OrderDto, OrdersController } from '@automation/main/api/controllers/orders.controller';
import { Owner, allureMetadata } from '@automation/main/common/annotations';

const checkoutPayload = {
  shipping: { name: 'API User', address: '1 Test Rd', city: 'Testville', zip: '00000' },
  payment: { cardLast4: '9999' },
};

test.describe('Orders API', () => {
  test.beforeEach(async ({ cartApi, authToken }) => {
    await allureMetadata({ layer: 'API', owner: Owner.Bookstore });
    await test.step('Verify auth token is present', async () => {
      expect(authToken).toBeTruthy();
    });
    await addBookToCartViaApi(cartApi, 'b3', 1);
  });

  test('@TmsLink:C7001 place order and get by id', async ({ ordersApi }) => {
    let created: Awaited<ReturnType<OrdersController['create']>>;
    let orderId = '';
    let order: Awaited<ReturnType<OrdersController['getById']>>;

    await test.step('POST /api/orders', async () => {
      created = await ordersApi.create(checkoutPayload);
    });
    await test.step('Verify order created response', async () => {
      expect(created.status).toBe(201);
      expect(created.data).toMatchObject({ id: expect.any(String) });
      orderId = (created.data as OrderDto).id;
    });
    await test.step('GET /api/orders/:id', async () => {
      order = await ordersApi.getById(orderId);
    });
    await test.step('Verify order is confirmed', async () => {
      expect(order.status).toBe(200);
      expect(order.data).toMatchObject({ status: 'confirmed' });
    });
  });

  test('@TmsLink:C7002 list orders with pagination', async ({ ordersApi }) => {
    let list: Awaited<ReturnType<OrdersController['list']>>;

    await test.step('POST /api/orders', async () => {
      await ordersApi.create(checkoutPayload);
    });
    await test.step('GET /api/orders with pagination', async () => {
      list = await ordersApi.list(1, 5);
    });
    await test.step('Verify orders list response', async () => {
      expect(list.status).toBe(200);
      expect(list.data.items.length).toBeGreaterThan(0);
    });
  });
});
