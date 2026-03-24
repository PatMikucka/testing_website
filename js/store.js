/**
 * store.js — Product data & cart management
 */
(function () {
  'use strict';

  /* -------------------------------------------------------
     PRODUCT DATA
  ------------------------------------------------------- */
  const DEFAULT_PRODUCTS = [
    {
      id: 1,
      name: 'Sage & Lavender',
      tagline: 'Calm & Restore',
      price: 18,
      emoji: '🌿',
      gradient: 'linear-gradient(135deg,#bcd4b8 0%,#d8e9d6 50%,#c8b5d8 100%)',
      description: 'A soothing blend of wild sage and French lavender. Perfect for winding down after a long day, this candle fills your space with the gentle calm of a herb garden at dusk.',
      details: '6oz amber glass jar · 35–40 hr burn · 100% soy wax · cotton wick',
      badge: null,
    },
    {
      id: 2,
      name: 'Vanilla & Sandalwood',
      tagline: 'Warm & Grounding',
      price: 22,
      emoji: '🕯️',
      gradient: 'linear-gradient(135deg,#e8c890 0%,#f5e0c0 50%,#faf0e0 100%)',
      description: 'Rich vanilla bean warmed by creamy sandalwood. A cosy, grounding scent that wraps the room in a feeling of quiet comfort — like a cashmere blanket for your nose.',
      details: '8oz ceramic pot · 45–50 hr burn · 100% coconut wax · wood wick',
      badge: 'Best Seller',
    },
    {
      id: 3,
      name: 'Eucalyptus & Cedar',
      tagline: 'Fresh & Earthy',
      price: 20,
      emoji: '🌲',
      gradient: 'linear-gradient(135deg,#5e7a58 0%,#87a878 50%,#b8d4b0 100%)',
      description: 'Crisp eucalyptus balanced with warm cedar wood. An invigorating yet grounding scent — like a long walk through a misty forest after the rain.',
      details: '6oz amber glass jar · 35–40 hr burn · 100% soy wax · cotton wick',
      badge: null,
    },
    {
      id: 4,
      name: 'Rose & Patchouli',
      tagline: 'Romantic & Earthy',
      price: 24,
      emoji: '🌹',
      gradient: 'linear-gradient(135deg,#d4a0a0 0%,#e8c0c0 50%,#f0d8d8 100%)',
      description: 'Delicate rose petals grounded by deep patchouli. Complex, sensual, and beautifully balanced — this candle is perfect for slow evenings and meaningful moments.',
      details: '8oz ceramic pot · 45–50 hr burn · 100% coconut wax · wood wick',
      badge: 'New',
    },
    {
      id: 5,
      name: 'Citrus & Lemongrass',
      tagline: 'Bright & Uplifting',
      price: 16,
      emoji: '🍋',
      gradient: 'linear-gradient(135deg,#e8d050 0%,#f8e880 50%,#f8f0a0 100%)',
      description: 'Zesty lemon, orange peel and fresh lemongrass. A sunshine-in-a-jar scent that energises and uplifts — the perfect morning companion or home refresher.',
      details: '6oz amber glass jar · 35–40 hr burn · 100% soy wax · cotton wick',
      badge: null,
    },
  ];

  function getProducts() {
    try {
      const saved = localStorage.getItem('lila_products');
      return saved ? JSON.parse(saved) : DEFAULT_PRODUCTS;
    } catch {
      return DEFAULT_PRODUCTS;
    }
  }

  function saveProducts(products) {
    localStorage.setItem('lila_products', JSON.stringify(products));
  }

  function updateProduct(id, changes) {
    const products = getProducts();
    const idx = products.findIndex((p) => p.id === id);
    if (idx === -1) return;
    products[idx] = { ...products[idx], ...changes };
    saveProducts(products);
  }

  function resetProducts() {
    localStorage.removeItem('lila_products');
  }

  /* -------------------------------------------------------
     CART
  ------------------------------------------------------- */
  function getCart() {
    try {
      return JSON.parse(localStorage.getItem('lila_cart') || '[]');
    } catch {
      return [];
    }
  }

  function saveCart(cart) {
    localStorage.setItem('lila_cart', JSON.stringify(cart));
    updateCartBadge();
    window.dispatchEvent(new Event('cartUpdated'));
  }

  function addToCart(productId, qty = 1) {
    const cart = getCart();
    const existing = cart.find((i) => i.id === productId);
    if (existing) {
      existing.qty += qty;
    } else {
      cart.push({ id: productId, qty });
    }
    saveCart(cart);
  }

  function removeFromCart(productId) {
    const cart = getCart().filter((i) => i.id !== productId);
    saveCart(cart);
  }

  function updateQty(productId, qty) {
    if (qty <= 0) { removeFromCart(productId); return; }
    const cart = getCart();
    const item = cart.find((i) => i.id === productId);
    if (item) { item.qty = qty; saveCart(cart); }
  }

  function clearCart() {
    saveCart([]);
  }

  function getCartTotal() {
    const products = getProducts();
    return getCart().reduce((sum, item) => {
      const p = products.find((x) => x.id === item.id);
      return sum + (p ? p.price * item.qty : 0);
    }, 0);
  }

  function getCartCount() {
    return getCart().reduce((n, i) => n + i.qty, 0);
  }

  function updateCartBadge() {
    const count = getCartCount();
    document.querySelectorAll('.cart-badge').forEach((el) => {
      el.textContent = count;
      el.classList.toggle('hidden', count === 0);
    });
  }

  /* -------------------------------------------------------
     EXPORT
  ------------------------------------------------------- */
  window.Store = {
    getProducts,
    saveProducts,
    updateProduct,
    resetProducts,
    getCart,
    addToCart,
    removeFromCart,
    updateQty,
    clearCart,
    getCartTotal,
    getCartCount,
    updateCartBadge,
  };

  // Init badge on load
  document.addEventListener('DOMContentLoaded', updateCartBadge);
})();
