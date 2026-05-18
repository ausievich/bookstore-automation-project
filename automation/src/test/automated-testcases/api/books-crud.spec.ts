/**
 * Domain: Online Bookstore
 * Feature: Books CRUD API
 * Owner: bookstore-qa
 */
import { test, expect } from '@automation/test/test-base/fixtures';
import { BookBuilder } from '@automation/main/api/builders/book.builder';
import { Owner, allureMetadata } from '@automation/main/common/annotations';

test.describe('Books CRUD API', () => {
  test.beforeEach(async () => {
    await allureMetadata({ layer: 'API', owner: Owner.Bookstore });
  });

  test('@TmsLink:C5001 GET /api/books returns paginated list', async ({ booksApi }) => {
    const { status, data } = await booksApi.list({ page: 1, limit: 5 });
    expect(status).toBe(200);
    expect(data.items.length).toBeGreaterThan(0);
    expect(data.total).toBeGreaterThan(0);
  });

  test('@TmsLink:C5002 GET /api/books/:id returns single book', async ({ booksApi }) => {
    const { status, data } = await booksApi.getById('b1');
    expect(status).toBe(200);
    if ('id' in data) {
      expect(data.id).toBe('b1');
    }
  });

  test('@TmsLink:C5003 POST /api/books creates book when authenticated', async ({ booksApi, authToken }) => {
    expect(authToken).toBeTruthy();
    const payload = new BookBuilder().withTitle(`API Book ${Date.now()}`).build();
    const { status, data } = await booksApi.create(payload);
    expect(status).toBe(201);
    if ('title' in data) {
      expect(data.title).toBe(payload.title);
    }
  });

  test('@TmsLink:C5004 PUT and DELETE book', async ({ booksApi, authToken }) => {
    expect(authToken).toBeTruthy();
    const created = await booksApi.create(new BookBuilder().withTitle(`Temp ${Date.now()}`).build());
    if (!('id' in created.data)) return;
    const id = created.data.id;

    const updated = await booksApi.update(id, { price: 9.99 });
    expect(updated.status).toBe(200);

    const deleted = await booksApi.delete(id);
    expect(deleted.status).toBe(204);
  });

  test('@TmsLink:C5005 POST /api/books without auth returns 401', async ({ httpClient, booksApi }) => {
    httpClient.setAuthToken(null);
    const { status } = await booksApi.create(new BookBuilder().build());
    expect(status).toBe(401);
  });
});
