export type BookCategory = 'Fiction' | 'Technology' | 'Science' | 'History';

export interface BookDto {
  id: string;
  title: string;
  author: string;
  category: BookCategory;
  price: number;
  stock: number;
  deleted?: boolean;
}

export interface BooksPageDto {
  items: BookDto[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateBookRequest {
  title: string;
  author: string;
  category: BookCategory;
  price: number;
  stock: number;
}
