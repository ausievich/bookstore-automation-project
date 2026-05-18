import { HttpClient } from '@automation/main/api/clients/http-client';

export interface CartItemDto {
  bookId: string;
  quantity: number;
  title: string;
  price: number;
  lineTotal: number;
}

export interface CartDto {
  items: CartItemDto[];
  subtotal: number;
}

export class CartController {
  constructor(private readonly http: HttpClient) {}

  get() {
    return this.http.request<CartDto>({ method: 'GET', url: '/api/cart' });
  }

  addItem(bookId: string, quantity: number) {
    return this.http.request<CartDto | { error: string }>({
      method: 'POST',
      url: '/api/cart/items',
      data: { bookId, quantity },
    });
  }

  updateItem(bookId: string, quantity: number) {
    return this.http.request<CartDto | { error: string }>({
      method: 'PATCH',
      url: `/api/cart/items/${bookId}`,
      data: { quantity },
    });
  }

  removeItem(bookId: string) {
    return this.http.request<CartDto>({ method: 'DELETE', url: `/api/cart/items/${bookId}` });
  }
}
