/**
 * Domain: Online Bookstore
 * Feature: Orders API
 * Owner: bookstore-qa
 */
import { test, expect } from '@automation/test/test-base/fixtures';
import { addBookToCartViaApi } from '@automation/test/test-base/api-cart-setup';
import { OrdersController } from '@automation/main/api/controllers/orders.controller';
import { CreateOrderRequest, OrderDto } from '@automation/main/api/models/order.models';
import { Owner, allureMetadata } from '@automation/main/common/annotations';

const checkoutPayload: CreateOrderRequest = {
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

  test('@TmsLink:C7001 POST /api/orders places order from cart', async ({ ordersApi }) => {
    let response: Awaited<ReturnType<OrdersController['create']>>;

    await test.step('POST /api/orders', async () => {
      response = await ordersApi.create(checkoutPayload);
    });

    await test.step('Verify order created with pending status', async () => {
      expect(response.status).toBe(201);
      expect(response.data).toMatchObject({ id: expect.any(String), status: 'pending' });
    });
  });

  test('@TmsLink:C7002 GET /api/orders/:id returns order details', async ({ ordersApi }) => {
    let orderId = '';
    let created: Awaited<ReturnType<OrdersController['create']>>;
    let response: Awaited<ReturnType<OrdersController['getById']>>;

    await test.step('POST /api/orders', async () => {
      created = await ordersApi.create(checkoutPayload);
    });

    await test.step('Read created order id', async () => {
      expect(created.status).toBe(201);
      orderId = (created.data as OrderDto).id;
    });

    await test.step('GET /api/orders/:id', async () => {
      response = await ordersApi.getById(orderId);
    });

    await test.step('Verify order details response', async () => {
      expect(response.status).toBe(200);
      expect(response.data).toMatchObject({ id: orderId, status: 'pending' });
    });
  });

  test('@TmsLink:C7003 GET /api/orders returns paginated list', async ({ ordersApi }) => {
    let response: Awaited<ReturnType<OrdersController['list']>>;

    await test.step('POST /api/orders', async () => {
      await ordersApi.create(checkoutPayload);
    });

    await test.step('GET /api/orders with pagination', async () => {
      response = await ordersApi.list(1, 5);
    });

    await test.step('Verify orders list response', async () => {
      expect(response.status).toBe(200);
      expect(response.data.items.length).toBeGreaterThan(0);
      expect(response.data.total).toBeGreaterThan(0);
    });
  });

  test('@TmsLink:C7004 order status transitions pending to confirmed to shipped', async ({ ordersApi }) => {
    let orderId = '';
    let created: Awaited<ReturnType<OrdersController['create']>>;
    let confirmed: Awaited<ReturnType<OrdersController['updateStatus']>>;
    let shipped: Awaited<ReturnType<OrdersController['updateStatus']>>;
    let order: Awaited<ReturnType<OrdersController['getById']>>;

    await test.step('POST /api/orders', async () => {
      created = await ordersApi.create(checkoutPayload);
    });

    await test.step('Verify new order is pending', async () => {
      expect(created.status).toBe(201);
      expect(created.data).toMatchObject({ status: 'pending' });
      orderId = (created.data as OrderDto).id;
    });

    await test.step('PATCH /api/orders/:id/status to confirmed', async () => {
      confirmed = await ordersApi.updateStatus(orderId, 'confirmed');
    });

    await test.step('Verify order is confirmed', async () => {
      expect(confirmed.status).toBe(200);
      expect(confirmed.data).toMatchObject({ id: orderId, status: 'confirmed' });
    });

    await test.step('PATCH /api/orders/:id/status to shipped', async () => {
      shipped = await ordersApi.updateStatus(orderId, 'shipped');
    });

    await test.step('Verify order is shipped', async () => {
      expect(shipped.status).toBe(200);
      expect(shipped.data).toMatchObject({ id: orderId, status: 'shipped' });
    });

    await test.step('GET /api/orders/:id', async () => {
      order = await ordersApi.getById(orderId);
    });

    await test.step('Verify final order status is shipped', async () => {
      expect(order.status).toBe(200);
      expect(order.data).toMatchObject({ id: orderId, status: 'shipped' });
    });
  });

  test('@TmsLink:C7005 invalid status transition returns 400', async ({ ordersApi }) => {
    let orderId = '';
    let response: Awaited<ReturnType<OrdersController['updateStatus']>>;

    await test.step('POST /api/orders', async () => {
      const created = await ordersApi.create(checkoutPayload);
      orderId = (created.data as OrderDto).id;
    });

    await test.step('PATCH pending order directly to shipped', async () => {
      response = await ordersApi.updateStatus(orderId, 'shipped');
    });

    await test.step('Verify invalid transition is rejected', async () => {
      expect(response.status).toBe(400);
      expect(response.data).toMatchObject({ error: expect.stringContaining('Cannot transition') });
    });
  });
});
