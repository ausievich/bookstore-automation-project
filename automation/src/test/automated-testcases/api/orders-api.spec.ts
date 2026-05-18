/**
 * Domain: Online Bookstore
 * Feature: Orders API
 * Owner: bookstore-qa
 */
import { test, expect } from '@automation/test/test-base/fixtures';
import { allure } from 'allure-playwright';
import { Owner } from '@automation/main/common/annotations';

const shipping = { name: 'API User', address: '1 Test Rd', city: 'Testville', zip: '00000' };
const payment = { cardLast4: '9999' };

test.describe('Orders API', () => {
  test.beforeEach(async ({ cartApi, authToken }) => {
    await allure.owner(Owner.Bookstore);
    expect(authToken).toBeTruthy();
    await cartApi.addItem('b3', 1);
  });

  test('@TmsLink:C7001 place order and get by id', async ({ ordersApi }) => {
    const created = await ordersApi.create({ shipping, payment });
    expect(created.status).toBe(201);
    if (!('id' in created.data)) return;

    const order = await ordersApi.getById(created.data.id);
    expect(order.status).toBe(200);
    if ('id' in order.data) {
      expect(order.data.status).toBe('confirmed');
    }
  });

  test('@TmsLink:C7002 list orders with pagination', async ({ ordersApi }) => {
    await ordersApi.create({ shipping, payment });
    const list = await ordersApi.list(1, 5);
    expect(list.status).toBe(200);
    expect(list.data.items.length).toBeGreaterThan(0);
  });
});
