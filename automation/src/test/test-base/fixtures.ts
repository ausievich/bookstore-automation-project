import { test as base } from '@playwright/test';
import { HttpClient } from '@automation/main/api/clients/http-client';
import { AuthFlow } from '@automation/main/api/flows/auth.flow';
import { BooksController } from '@automation/main/api/controllers/books.controller';
import { CartController } from '@automation/main/api/controllers/cart.controller';
import { OrdersController } from '@automation/main/api/controllers/orders.controller';
import { AuthController } from '@automation/main/api/controllers/auth.controller';

type ApiFixtures = {
  httpClient: HttpClient;
  apiReset: void;
  authApi: AuthController;
  booksApi: BooksController;
  cartApi: CartController;
  ordersApi: OrdersController;
  authToken: string;
};

export const test = base.extend<ApiFixtures>({
  page: async ({ page }, use) => {
    await page.request.post('/api/test/reset');
    await page.goto('/login.html', { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => localStorage.clear());
    await use(page);
  },
  httpClient: async ({}, use) => {
    const client = new HttpClient();
    await use(client);
  },

  apiReset: [
    async ({ httpClient }, use) => {
      await httpClient.request({ method: 'POST', url: '/api/test/reset' });
      await use();
    },
    { auto: true },
  ],

  authApi: async ({ httpClient }, use) => {
    await use(new AuthController(httpClient));
  },

  booksApi: async ({ httpClient }, use) => {
    await use(new BooksController(httpClient));
  },

  cartApi: async ({ httpClient }, use) => {
    await use(new CartController(httpClient));
  },

  ordersApi: async ({ httpClient }, use) => {
    await use(new OrdersController(httpClient));
  },

  authToken: async ({ httpClient, apiReset }, use) => {
    void apiReset;
    const token = await new AuthFlow(httpClient).loginAsDefaultUser();
    httpClient.setAuthToken(token);
    await use(token);
    httpClient.setAuthToken(null);
  },
});

export { expect } from '@playwright/test';
