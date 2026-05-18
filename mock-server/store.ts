export type BookCategory = 'Fiction' | 'Technology' | 'Science' | 'History';

export interface Book {
  id: string;
  title: string;
  author: string;
  category: BookCategory;
  price: number;
  stock: number;
  deleted?: boolean;
}

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
}

export interface CartItem {
  bookId: string;
  quantity: number;
}

export type OrderStatus = 'pending' | 'confirmed' | 'shipped';

export interface Order {
  id: string;
  userId: string;
  items: Array<{ bookId: string; title: string; quantity: number; unitPrice: number }>;
  shipping: { name: string; address: string; city: string; zip: string };
  payment: { cardLast4: string };
  status: OrderStatus;
  total: number;
  createdAt: string;
}

const books: Book[] = [
  { id: 'b1', title: 'Clean Code', author: 'Robert Martin', category: 'Technology', price: 42.99, stock: 10 },
  { id: 'b2', title: 'The Pragmatic Programmer', author: 'Hunt & Thomas', category: 'Technology', price: 39.5, stock: 8 },
  { id: 'b3', title: 'Dune', author: 'Frank Herbert', category: 'Fiction', price: 18.99, stock: 15 },
  { id: 'b4', title: 'Sapiens', author: 'Yuval Harari', category: 'History', price: 22.0, stock: 12 },
  { id: 'b5', title: 'A Brief History of Time', author: 'Stephen Hawking', category: 'Science', price: 15.75, stock: 6 },
  { id: 'b6', title: 'Neuromancer', author: 'William Gibson', category: 'Fiction', price: 14.25, stock: 0 },
];

const users: User[] = [
  { id: 'u1', email: 'user@bookstore.test', password: 'password123', name: 'Test User' },
];

const carts = new Map<string, CartItem[]>();
const orders: Order[] = [];
const tokens = new Map<string, string>();

let orderCounter = 1000;

export const store = {
  reset(): void {
    carts.clear();
    orders.length = 0;
    tokens.clear();
    orderCounter = 1000;
    books.forEach((b) => {
      delete b.deleted;
      if (b.id === 'b6') b.stock = 0;
      else if (b.stock === 0) b.stock = 10;
    });
  },

  findUserByEmail(email: string): User | undefined {
    return users.find((u) => u.email === email);
  },

  issueToken(userId: string): string {
    const token = `tok_${userId}_${Date.now()}`;
    tokens.set(token, userId);
    return token;
  },

  getUserIdByToken(token: string | undefined): string | null {
    if (!token) return null;
    return tokens.get(token) ?? null;
  },

  listBooks(params: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    sort?: 'price_asc' | 'price_desc';
  }): { items: Book[]; total: number; page: number; limit: number } {
    const page = params.page ?? 1;
    const limit = params.limit ?? 20;
    let items = books.filter((b) => !b.deleted);

    if (params.search) {
      const q = params.search.toLowerCase();
      items = items.filter((b) => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q));
    }
    if (params.category) {
      items = items.filter((b) => b.category === params.category);
    }
    if (params.sort === 'price_asc') items = [...items].sort((a, b) => a.price - b.price);
    if (params.sort === 'price_desc') items = [...items].sort((a, b) => b.price - a.price);

    const total = items.length;
    const start = (page - 1) * limit;
    items = items.slice(start, start + limit);
    return { items, total, page, limit };
  },

  getBook(id: string): Book | undefined {
    const book = books.find((b) => b.id === id && !b.deleted);
    return book;
  },

  createBook(data: Omit<Book, 'id' | 'deleted'>): Book {
    const book: Book = { ...data, id: `b${books.length + 1}` };
    books.push(book);
    return book;
  },

  updateBook(id: string, patch: Partial<Omit<Book, 'id'>>): Book | undefined {
    const book = books.find((b) => b.id === id && !b.deleted);
    if (!book) return undefined;
    Object.assign(book, patch);
    return book;
  },

  deleteBook(id: string): boolean {
    const book = books.find((b) => b.id === id && !b.deleted);
    if (!book) return false;
    book.deleted = true;
    return true;
  },

  getCart(userId: string): CartItem[] {
    return carts.get(userId) ?? [];
  },

  setCart(userId: string, items: CartItem[]): CartItem[] {
    carts.set(userId, items);
    return items;
  },

  addToCart(userId: string, bookId: string, quantity: number): { ok: true; cart: CartItem[] } | { ok: false; error: string } {
    const book = this.getBook(bookId);
    if (!book) return { ok: false, error: 'Book not found' };
    if (book.stock < quantity) return { ok: false, error: 'Insufficient stock' };

    const cart = [...this.getCart(userId)];
    const existing = cart.find((i) => i.bookId === bookId);
    const newQty = (existing?.quantity ?? 0) + quantity;
    if (book.stock < newQty) return { ok: false, error: 'Insufficient stock' };

    if (existing) existing.quantity = newQty;
    else cart.push({ bookId, quantity });
    return { ok: true, cart: this.setCart(userId, cart) };
  },

  updateCartItem(userId: string, bookId: string, quantity: number): { ok: true; cart: CartItem[] } | { ok: false; error: string } {
    const book = this.getBook(bookId);
    if (!book) return { ok: false, error: 'Book not found' };
    if (quantity > book.stock) return { ok: false, error: 'Insufficient stock' };

    const cart = this.getCart(userId).map((i) =>
      i.bookId === bookId ? { ...i, quantity } : i,
    ).filter((i) => i.quantity > 0);
    return { ok: true, cart: this.setCart(userId, cart) };
  },

  removeCartItem(userId: string, bookId: string): CartItem[] {
    const cart = this.getCart(userId).filter((i) => i.bookId !== bookId);
    return this.setCart(userId, cart);
  },

  cartDetails(userId: string): Array<CartItem & { title: string; price: number; lineTotal: number }> {
    return this.getCart(userId).map((item) => {
      const book = this.getBook(item.bookId)!;
      return {
        ...item,
        title: book.title,
        price: book.price,
        lineTotal: book.price * item.quantity,
      };
    });
  },

  cartSubtotal(userId: string): number {
    return this.cartDetails(userId).reduce((sum, i) => sum + i.lineTotal, 0);
  },

  createOrder(
    userId: string,
    shipping: Order['shipping'],
    payment: Order['payment'],
  ): { ok: true; order: Order } | { ok: false; error: string } {
    const items = this.cartDetails(userId);
    if (items.length === 0) return { ok: false, error: 'Cart is empty' };

    for (const item of items) {
      const book = this.getBook(item.bookId);
      if (!book || book.stock < item.quantity) {
        return { ok: false, error: 'Insufficient stock' };
      }
    }

    items.forEach((item) => {
      const book = books.find((b) => b.id === item.bookId)!;
      book.stock -= item.quantity;
    });

    const order: Order = {
      id: `ORD-${++orderCounter}`,
      userId,
      items: items.map((i) => ({
        bookId: i.bookId,
        title: i.title,
        quantity: i.quantity,
        unitPrice: i.price,
      })),
      shipping,
      payment,
      status: 'confirmed',
      total: this.cartSubtotal(userId),
      createdAt: new Date().toISOString(),
    };
    orders.push(order);
    this.setCart(userId, []);
    return { ok: true, order };
  },

  getOrder(id: string, userId?: string): Order | undefined {
    const order = orders.find((o) => o.id === id);
    if (!order) return undefined;
    if (userId && order.userId !== userId) return undefined;
    return order;
  },

  listOrders(userId: string, page = 1, limit = 10): { items: Order[]; total: number; page: number; limit: number } {
    const userOrders = orders.filter((o) => o.userId === userId).sort(
      (a, b) => b.createdAt.localeCompare(a.createdAt),
    );
    const total = userOrders.length;
    const start = (page - 1) * limit;
    return { items: userOrders.slice(start, start + limit), total, page, limit };
  },
};
