# 🕯️ Lila's Candles

A static multi-page website for Lila's Candles — a small business selling handmade, vegan candles. Built with plain HTML, CSS, and vanilla JavaScript. No frameworks, no build tools, no dependencies.

---

## Pages

| Page | File | Description |
|---|---|---|
| Home | `index.html` | Hero, featured products, testimonials, newsletter |
| Shop | `shop.html` | All 5 products with filter, quick-view modal, add to cart |
| Cart | `cart.html` | Cart items, quantity controls, order summary |
| Checkout | `checkout.html` | Shipping address, payment fields, order confirmation |
| About | `about.html` | Lila's story, values, candle-making process |
| Blog | `blog.html` | Journal listing (6 posts) |
| Blog Post | `blog-post.html` | "Why I Started Making Vegan Candles" (full post) |
| Blog Post 2 | `blog-post-2.html` | "How to Get the Most Out of Your Candle" (full post) |
| FAQ | `faq.html` | Accordion FAQ — ingredients, care, orders, gifting |
| Contact | `contact.html` | Contact form + business info |
| Admin | `admin.html` | Owner login + product/content editor |

---

## File Structure

```
Testing_Website/
├── index.html
├── shop.html
├── cart.html
├── checkout.html
├── about.html
├── blog.html
├── blog-post.html
├── blog-post-2.html
├── faq.html
├── contact.html
├── admin.html
├── css/
│   └── style.css       # All styles — CSS variables control the entire palette
└── js/
    ├── store.js         # Product data, cart (localStorage)
    ├── main.js          # Nav, toasts, FAQ accordion, admin ribbon
    └── admin.js         # Admin auth + product/content editor
```

---

## Running Locally

No install required. Serve the directory with any static file server:

```bash
# Python (built-in)
python3 -m http.server 8080
```

Then open **http://localhost:8080** in your browser.

---

## Admin / Owner Access

Go to `admin.html` and sign in with:

| Field | Value |
|---|---|
| Username | `lila` |
| Password | `candles2024` |

**What you can do in admin mode:**
- Edit product names, taglines, prices, descriptions, and badges
- Edit key page copy (hero title, about bio, etc.)
- Edit any content with a green dashed outline directly on the page
- All changes persist in `localStorage`

> To change the login credentials, update `ADMIN_USER` and `ADMIN_PASS` at the top of `js/admin.js`.

---

## Products

| # | Name | Wax | Price |
|---|---|---|---|
| 1 | Sage & Lavender | Soy | £18 |
| 2 | Vanilla & Sandalwood | Coconut | £22 |
| 3 | Eucalyptus & Cedar | Soy | £20 |
| 4 | Rose & Patchouli | Coconut | £24 |
| 5 | Citrus & Lemongrass | Soy | £16 |

Shipping is free on orders over £50, otherwise £4.99 flat rate.

---

## Design

- **Palette:** Sage green with warm cream and terracotta accents
- **Typography:** Playfair Display (headings) + Lato (body) via Google Fonts
- **CSS variables** in `:root` — change the palette in one place in `css/style.css`
- Fully responsive with a mobile hamburger menu

---

## Tech

- Plain HTML5, CSS3, vanilla JavaScript (ES6+)
- No frameworks, no npm, no build step
- Data persistence via `localStorage` (cart, editable content, product edits)
- Cart state shared across all pages via `js/store.js`
