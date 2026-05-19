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

export interface AddCartItemRequest {
  bookId: string;
  quantity: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}
