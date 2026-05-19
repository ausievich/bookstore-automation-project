/**
 * Domain: Online Bookstore
 * Feature: Books CRUD API
 * Owner: bookstore-qa
 * Test Description: Books REST CRUD operations, pagination, and auth errors
 */
import { test, expect } from '@automation/test/test-base/fixtures';
import { BookBuilder } from '@automation/main/api/builders/book.builder';
import { BooksController } from '@automation/main/api/controllers/books.controller';
import { BookDto } from '@automation/main/api/models/book.models';
import { Owner, allureMetadata } from '@automation/main/common/annotations';

test.describe('Books CRUD API', () => {
  test.beforeEach(async () => {
    await allureMetadata({ layer: 'API', owner: Owner.Bookstore });
  });

  test('@TmsLink:C5001 GET /api/books returns paginated list', async ({ booksApi }) => {
    let response: Awaited<ReturnType<BooksController['list']>>;

    await test.step('GET /api/books with pagination', async () => {
      response = await booksApi.list({ page: 1, limit: 5 });
    });

    await test.step('Verify paginated list response', async () => {
      expect(response.status).toBe(200);
      expect(response.data.items.length).toBeGreaterThan(0);
      expect(response.data.total).toBeGreaterThan(0);
    });
  });

  test('@TmsLink:C5002 GET /api/books/:id returns single book', async ({ booksApi }) => {
    let response: Awaited<ReturnType<BooksController['getById']>>;

    await test.step('GET /api/books/b1', async () => {
      response = await booksApi.getById('b1');
    });

    await test.step('Verify book b1 in response', async () => {
      expect(response.status).toBe(200);
      expect(response.data).toMatchObject({ id: 'b1' });
    });
  });

  test('@TmsLink:C5003 POST /api/books creates book when authenticated', async ({ booksApi, authToken }) => {
    const payload = new BookBuilder().withTitle(`API Book ${Date.now()}`).build();
    let response: Awaited<ReturnType<BooksController['create']>>;

    await test.step('Verify auth token is present', async () => {
      expect(authToken).toBeTruthy();
    });

    await test.step('POST /api/books with valid payload', async () => {
      response = await booksApi.create(payload);
    });

    await test.step('Verify created book in response', async () => {
      expect(response.status).toBe(201);
      expect(response.data).toMatchObject({ title: payload.title });
    });
  });

  test('@TmsLink:C5004 PUT /api/books/:id updates book fields', async ({ booksApi, authToken }) => {
    const updatedPrice = 9.99;
    let bookId = '';
    let created: Awaited<ReturnType<BooksController['create']>>;
    let updated: Awaited<ReturnType<BooksController['update']>>;

    await test.step('Verify auth token is present', async () => {
      expect(authToken).toBeTruthy();
    });

    await test.step('POST /api/books to create temporary book', async () => {
      created = await booksApi.create(new BookBuilder().withTitle(`Temp ${Date.now()}`).build());
    });

    await test.step('Read created book id', async () => {
      expect(created.status).toBe(201);
      bookId = (created.data as BookDto).id;
    });

    await test.step('PUT /api/books/:id to update price', async () => {
      updated = await booksApi.update(bookId, { price: updatedPrice });
    });

    await test.step('Verify book update response', async () => {
      expect(updated.status).toBe(200);
      expect(updated.data).toMatchObject({ id: bookId, price: updatedPrice });
    });
  });

  test('@TmsLink:C5005 DELETE /api/books/:id soft-deletes book', async ({ booksApi, authToken }) => {
    let bookId = '';
    let created: Awaited<ReturnType<BooksController['create']>>;
    let deleted: Awaited<ReturnType<BooksController['delete']>>;
    let getResponse: Awaited<ReturnType<BooksController['getById']>>;

    await test.step('Verify auth token is present', async () => {
      expect(authToken).toBeTruthy();
    });

    await test.step('POST /api/books to create temporary book', async () => {
      created = await booksApi.create(new BookBuilder().withTitle(`Temp ${Date.now()}`).build());
    });

    await test.step('Read created book id', async () => {
      expect(created.status).toBe(201);
      bookId = (created.data as BookDto).id;
    });

    await test.step('DELETE /api/books/:id', async () => {
      deleted = await booksApi.delete(bookId);
    });

    await test.step('Verify book delete response', async () => {
      expect(deleted.status).toBe(204);
    });

    await test.step('GET /api/books/:id for deleted book', async () => {
      getResponse = await booksApi.getById(bookId);
    });

    await test.step('Verify deleted book is not found', async () => {
      expect(getResponse.status).toBe(404);
    });
  });

  test('@TmsLink:C5006 POST /api/books without auth returns 401', async ({ httpClient, booksApi }) => {
    let response: Awaited<ReturnType<BooksController['create']>>;

    await test.step('Clear auth token', async () => {
      httpClient.setAuthToken(null);
    });

    await test.step('POST /api/books without authentication', async () => {
      response = await booksApi.create(new BookBuilder().build());
    });

    await test.step('Verify 401 unauthorized response', async () => {
      expect(response.status).toBe(401);
    });
  });
});
