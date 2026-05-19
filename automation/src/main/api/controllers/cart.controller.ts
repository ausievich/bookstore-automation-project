import { HttpClient } from '@automation/main/api/clients/http-client';
import { ApiErrorDto } from '@automation/main/api/models/api-error.models';
import { CartDto } from '@automation/main/api/models/cart.models';

export class CartController {
  constructor(private readonly http: HttpClient) {}

  get() {
    return this.http.request<CartDto>({ method: 'GET', url: '/api/cart' });
  }

  addItem(bookId: string, quantity: number) {
    return this.http.request<CartDto | ApiErrorDto>({
      method: 'POST',
      url: '/api/cart/items',
      data: { bookId, quantity },
    });
  }

  updateItem(bookId: string, quantity: number) {
    return this.http.request<CartDto | ApiErrorDto>({
      method: 'PATCH',
      url: `/api/cart/items/${bookId}`,
      data: { quantity },
    });
  }

  removeItem(bookId: string) {
    return this.http.request<CartDto>({ method: 'DELETE', url: `/api/cart/items/${bookId}` });
  }
}
