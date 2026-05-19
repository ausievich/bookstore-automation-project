export type OrderStatus = 'pending' | 'confirmed' | 'shipped';

export interface OrderItemDto {
  bookId: string;
  title: string;
  quantity: number;
  unitPrice: number;
}

export interface ShippingDetailsDto {
  name: string;
  address: string;
  city: string;
  zip: string;
}

export interface PaymentDetailsDto {
  cardLast4: string;
}

export interface CreateOrderRequest {
  shipping: ShippingDetailsDto;
  payment: PaymentDetailsDto;
}

export interface OrderDto {
  id: string;
  userId: string;
  status: OrderStatus;
  total: number;
  items: OrderItemDto[];
  shipping?: ShippingDetailsDto;
  payment?: PaymentDetailsDto;
  createdAt?: string;
}

export interface OrdersPageDto {
  items: OrderDto[];
  total: number;
  page: number;
  limit: number;
}
