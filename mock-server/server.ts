import cors from 'cors';
import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { store } from './store';

const app = express();
const PORT = Number(process.env.PORT ?? 3000);

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'demo')));

function paramId(req: Request): string {
  const id = req.params.id;
  return Array.isArray(id) ? id[0] : id;
}

function getToken(req: Request): string | undefined {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return undefined;
  return header.slice(7);
}

function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const userId = store.getUserIdByToken(getToken(req));
  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  (req as Request & { userId: string }).userId = userId;
  next();
}

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/test/reset', (_req, res) => {
  store.reset();
  res.status(204).send();
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body as { email?: string; password?: string };
  const user = store.findUserByEmail(email ?? '');
  if (!user || user.password !== password) {
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }
  res.json({ token: store.issueToken(user.id), user: { id: user.id, email: user.email, name: user.name } });
});

app.get('/api/books', (req, res) => {
  const page = Number(req.query.page ?? 1);
  const limit = Number(req.query.limit ?? 20);
  const search = req.query.search as string | undefined;
  const category = req.query.category as string | undefined;
  const sort = req.query.sort as 'price_asc' | 'price_desc' | undefined;
  res.json(store.listBooks({ page, limit, search, category, sort }));
});

app.get('/api/books/:id', (req, res) => {
  const book = store.getBook(paramId(req));
  if (!book) {
    res.status(404).json({ error: 'Book not found' });
    return;
  }
  res.json(book);
});

app.post('/api/books', requireAuth, (req, res) => {
  const { title, author, category, price, stock } = req.body as {
    title?: string;
    author?: string;
    category?: string;
    price?: number;
    stock?: number;
  };
  if (!title || !author || !category || price == null || stock == null) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }
  const book = store.createBook({
    title,
    author,
    category: category as 'Fiction',
    price: Number(price),
    stock: Number(stock),
  });
  res.status(201).json(book);
});

app.put('/api/books/:id', requireAuth, (req, res) => {
  const book = store.updateBook(paramId(req), req.body);
  if (!book) {
    res.status(404).json({ error: 'Book not found' });
    return;
  }
  res.json(book);
});

app.delete('/api/books/:id', requireAuth, (req, res) => {
  const ok = store.deleteBook(paramId(req));
  if (!ok) {
    res.status(404).json({ error: 'Book not found' });
    return;
  }
  res.status(204).send();
});

app.get('/api/cart', requireAuth, (req, res) => {
  const userId = (req as Request & { userId: string }).userId;
  const items = store.cartDetails(userId);
  res.json({ items, subtotal: store.cartSubtotal(userId) });
});

app.post('/api/cart/items', requireAuth, (req, res) => {
  const userId = (req as Request & { userId: string }).userId;
  const { bookId, quantity } = req.body as { bookId?: string; quantity?: number };
  if (!bookId || !quantity) {
    res.status(400).json({ error: 'bookId and quantity required' });
    return;
  }
  const result = store.addToCart(userId, bookId, Number(quantity));
  if (!result.ok) {
    res.status(400).json({ error: result.error });
    return;
  }
  res.status(201).json({ items: store.cartDetails(userId), subtotal: store.cartSubtotal(userId) });
});

app.patch('/api/cart/items/:bookId', requireAuth, (req, res) => {
  const userId = (req as Request & { userId: string }).userId;
  const { quantity } = req.body as { quantity?: number };
  if (quantity == null) {
    res.status(400).json({ error: 'quantity required' });
    return;
  }
  const bookId = Array.isArray(req.params.bookId) ? req.params.bookId[0] : req.params.bookId;
  const result = store.updateCartItem(userId, bookId, Number(quantity));
  if (!result.ok) {
    res.status(400).json({ error: result.error });
    return;
  }
  res.json({ items: store.cartDetails(userId), subtotal: store.cartSubtotal(userId) });
});

app.delete('/api/cart/items/:bookId', requireAuth, (req, res) => {
  const userId = (req as Request & { userId: string }).userId;
  const removeId = Array.isArray(req.params.bookId) ? req.params.bookId[0] : req.params.bookId;
  store.removeCartItem(userId, removeId);
  res.json({ items: store.cartDetails(userId), subtotal: store.cartSubtotal(userId) });
});

app.post('/api/orders', requireAuth, (req, res) => {
  const userId = (req as Request & { userId: string }).userId;
  const { shipping, payment } = req.body as {
    shipping?: { name: string; address: string; city: string; zip: string };
    payment?: { cardLast4: string };
  };
  if (!shipping || !payment) {
    res.status(400).json({ error: 'shipping and payment required' });
    return;
  }
  const result = store.createOrder(userId, shipping, payment);
  if (!result.ok) {
    res.status(400).json({ error: result.error });
    return;
  }
  res.status(201).json(result.order);
});

app.get('/api/orders', requireAuth, (req, res) => {
  const userId = (req as Request & { userId: string }).userId;
  const page = Number(req.query.page ?? 1);
  const limit = Number(req.query.limit ?? 10);
  res.json(store.listOrders(userId, page, limit));
});

app.get('/api/orders/:id', requireAuth, (req, res) => {
  const userId = (req as Request & { userId: string }).userId;
  const order = store.getOrder(paramId(req), userId);
  if (!order) {
    res.status(404).json({ error: 'Order not found' });
    return;
  }
  res.json(order);
});

if (require.main === module) {
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Online Bookstore demo: http://localhost:${PORT}`);
  });
}

export default app;
