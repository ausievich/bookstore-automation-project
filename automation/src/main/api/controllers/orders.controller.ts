import { HttpClient } from '@automation/main/api/clients/http-client';

export interface OrderDto {
  id: string;
  userId: string;
  status: string;
  total: number;
  items: Array<{ bookId: string; title: string; quantity: number; unitPrice: number }>;
}

export interface OrdersPageDto {
  items: OrderDto[];
  total: number;
  page: number;
  limit: number;
}

export class OrdersController {
  constructor(private readonly http: HttpClient) {}

  create(payload: {
    shipping: { name: string; address: string; city: string; zip: string };
    payment: { cardLast4: string };
  }) {
    return this.http.request<OrderDto | { error: string }>({
      method: 'POST',
      url: '/api/orders',
      data: payload,
    });
  }

  getById(id: string) {
    return this.http.request<OrderDto | { error: string }>({ method: 'GET', url: `/api/orders/${id}` });
  }

  list(page = 1, limit = 10) {
    return this.http.request<OrdersPageDto>({ method: 'GET', url: '/api/orders', params: { page, limit } });
  }
}
