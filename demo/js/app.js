const API = '';

function getToken() {
  return localStorage.getItem('bookstore_token');
}

function setToken(token) {
  localStorage.setItem('bookstore_token', token);
}

function clearSession() {
  localStorage.removeItem('bookstore_token');
}

async function api(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${API}${path}`, { ...options, headers });
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) throw new Error(data?.error || res.statusText);
  return data;
}

function requireAuth() {
  if (!getToken() && !window.location.pathname.endsWith('login.html')) {
    window.location.href = 'login.html';
  }
}

function updateCartCounter(count) {
  const el = document.querySelector('[data-testid="cart-counter"]');
  if (el) el.textContent = String(count ?? 0);
}

async function refreshCartCounter() {
  if (!getToken()) {
    updateCartCounter(0);
    return;
  }
  try {
    const cart = await api('/api/cart');
    const count = cart.items.reduce((s, i) => s + i.quantity, 0);
    updateCartCounter(count);
  } catch {
    updateCartCounter(0);
  }
}

window.BookstoreApp = {
  api,
  getToken,
  setToken,
  clearSession,
  requireAuth,
  updateCartCounter,
  refreshCartCounter,
};
