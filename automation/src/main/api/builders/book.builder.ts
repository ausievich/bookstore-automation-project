import { BookCategory, CreateBookRequest } from '@automation/main/api/models/book.models';

export class BookBuilder {
  private data: CreateBookRequest = {
    title: 'Test Book',
    author: 'Test Author',
    category: 'Fiction',
    price: 19.99,
    stock: 5,
  };

  withTitle(title: string): this {
    this.data.title = title;
    return this;
  }

  withAuthor(author: string): this {
    this.data.author = author;
    return this;
  }

  withCategory(category: BookCategory): this {
    this.data.category = category;
    return this;
  }

  withPrice(price: number): this {
    this.data.price = price;
    return this;
  }

  withStock(stock: number): this {
    this.data.stock = stock;
    return this;
  }

  build(): CreateBookRequest {
    return { ...this.data };
  }
}
