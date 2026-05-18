import { HttpClient } from '@automation/main/api/clients/http-client';
import { CreateBookRequest, BookDto, BooksPageDto, ApiErrorDto } from '@automation/main/api/models/book.models';

export class BooksController {
  constructor(private readonly http: HttpClient) {}

  list(params?: { page?: number; search?: string; category?: string; sort?: string }) {
    return this.http.request<BooksPageDto>({
      method: 'GET',
      url: '/api/books',
      params,
    });
  }

  getById(id: string) {
    return this.http.request<BookDto | ApiErrorDto>({ method: 'GET', url: `/api/books/${id}` });
  }

  create(body: CreateBookRequest) {
    return this.http.request<BookDto | ApiErrorDto>({ method: 'POST', url: '/api/books', data: body });
  }

  update(id: string, body: Partial<CreateBookRequest>) {
    return this.http.request<BookDto | ApiErrorDto>({ method: 'PUT', url: `/api/books/${id}`, data: body });
  }

  delete(id: string) {
    return this.http.request<void | ApiErrorDto>({ method: 'DELETE', url: `/api/books/${id}` });
  }
}
