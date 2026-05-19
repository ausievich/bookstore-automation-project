import { HttpClient } from '@automation/main/api/clients/http-client';
import { ApiErrorDto } from '@automation/main/api/models/api-error.models';
import {
  CreateOrderRequest,
  OrderDto,
  OrderStatus,
  OrdersPageDto,
  UpdateOrderStatusRequest,
} from '@automation/main/api/models/order.models';

export class OrdersController {
  constructor(private readonly http: HttpClient) {}

  create(payload: CreateOrderRequest) {
    return this.http.request<OrderDto | ApiErrorDto>({
      method: 'POST',
      url: '/api/orders',
      data: payload,
    });
  }

  getById(id: string) {
    return this.http.request<OrderDto | ApiErrorDto>({ method: 'GET', url: `/api/orders/${id}` });
  }

  list(page = 1, limit = 10) {
    return this.http.request<OrdersPageDto>({ method: 'GET', url: '/api/orders', params: { page, limit } });
  }

  updateStatus(id: string, status: OrderStatus) {
    const payload: UpdateOrderStatusRequest = { status };
    return this.http.request<OrderDto | ApiErrorDto>({
      method: 'PATCH',
      url: `/api/orders/${id}/status`,
      data: payload,
    });
  }
}
