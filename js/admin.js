/**
 * admin.js — Admin authentication + product/content editor
 * Default credentials: username "lila" / password "candles2024"
 * (Static site — credentials are stored client-side; suitable for private local use only)
 */
(function () {
  'use strict';

  const ADMIN_USER = 'lila';
  const ADMIN_PASS = 'candles2024';

  /* -------------------------------------------------------
     LOGIN FORM
  ------------------------------------------------------- */
  function initLogin() {
    const form = document.getElementById('admin-login-form');
    if (!form) return;

    // If already logged in, redirect to dashboard
    if (sessionStorage.getItem('lilaAdminLoggedIn') === 'true') {
      showDashboard();
      return;
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const user = document.getElementById('admin-username').value.trim();
      const pass = document.getElementById('admin-password').value;
      const err  = document.getElementById('login-error');

      if (user === ADMIN_USER && pass === ADMIN_PASS) {
        sessionStorage.setItem('lilaAdminLoggedIn', 'true');
        err.textContent = '';
        showDashboard();
        if (typeof showToast === 'function') showToast('Welcome back, Lila! 🌿', 'success');
      } else {
        err.textContent = 'Incorrect username or password.';
        document.getElementById('admin-password').value = '';
      }
    });
  }

  /* -------------------------------------------------------
     DASHBOARD
  ------------------------------------------------------- */
  function showDashboard() {
    const loginSection = document.getElementById('login-section');
    const dashSection  = document.getElementById('dashboard-section');
    if (loginSection) loginSection.style.display = 'none';
    if (dashSection) dashSection.style.display = 'block';
    renderProductEditor();
    renderContentEditor();
  }

  /* -------------------------------------------------------
     PRODUCT EDITOR
  ------------------------------------------------------- */
  function renderProductEditor() {
    const container = document.getElementById('product-editor');
    if (!container) return;

    const products = Store.getProducts();
    container.innerHTML = '';

    products.forEach((p) => {
      const row = document.createElement('div');
      row.className = 'product-edit-row';
      row.style.cssText = 'display:grid;grid-template-columns:auto 1fr 1fr auto;gap:.75rem;align-items:center;padding:.85rem 0;border-bottom:1px solid var(--border);';
      row.innerHTML = `
        <div style="font-size:2rem;line-height:1">${p.emoji}</div>
        <div>
          <input type="text" data-field="name" data-id="${p.id}" value="${escHtml(p.name)}"
            style="width:100%;font-weight:700;margin-bottom:.35rem;"
            placeholder="Product name" class="admin-input" />
          <input type="text" data-field="tagline" data-id="${p.id}" value="${escHtml(p.tagline)}"
            style="width:100%;font-size:.8rem;"
            placeholder="Tagline" class="admin-input" />
        </div>
        <div>
          <label style="font-size:.75rem;text-transform:uppercase;letter-spacing:.06em;color:var(--brown-light);display:block;margin-bottom:.2rem;">Price ($)</label>
          <input type="number" data-field="price" data-id="${p.id}" value="${p.price}"
            min="0" step="0.01" style="width:100%;" class="admin-input" />
        </div>
        <div>
          <label style="font-size:.75rem;text-transform:uppercase;letter-spacing:.06em;color:var(--brown-light);display:block;margin-bottom:.2rem;">Badge</label>
          <input type="text" data-field="badge" data-id="${p.id}" value="${escHtml(p.badge || '')}"
            style="width:100%;font-size:.85rem;" placeholder="e.g. New"
            class="admin-input" />
        </div>
      `;

      const descRow = document.createElement('div');
      descRow.style.cssText = 'padding:.25rem 0 .85rem;border-bottom:1px solid var(--cream-200);';
      descRow.innerHTML = `
        <label style="font-size:.75rem;text-transform:uppercase;letter-spacing:.06em;color:var(--brown-light);display:block;margin-bottom:.3rem;">Description</label>
        <textarea data-field="description" data-id="${p.id}" rows="2"
          style="width:100%;font-size:.875rem;" class="admin-input">${escHtml(p.description)}</textarea>
      `;

      container.appendChild(row);
      container.appendChild(descRow);
    });

    // Live save on change
    container.querySelectorAll('.admin-input').forEach((input) => {
      input.addEventListener('change', () => {
        const id    = parseInt(input.dataset.id);
        const field = input.dataset.field;
        const val   = field === 'price' ? parseFloat(input.value) : input.value;
        Store.updateProduct(id, { [field]: val });
        if (typeof showToast === 'function') showToast('Product updated ✓', 'success');
      });
    });
  }

  /* -------------------------------------------------------
     CONTENT EDITOR (page text)
  ------------------------------------------------------- */
  function renderContentEditor() {
    const container = document.getElementById('content-editor');
    if (!container) return;

    const contentKeys = [
      { key: 'hero-title',    label: 'Homepage — Hero Title' },
      { key: 'hero-subtitle', label: 'Homepage — Hero Subtitle' },
      { key: 'about-bio',     label: 'About Page — Bio' },
    ];

    container.innerHTML = '';

    contentKeys.forEach(({ key, label }) => {
      const saved = localStorage.getItem('lila_content_' + key) || '';
      const group = document.createElement('div');
      group.className = 'form-group';
      group.style.marginBottom = '1rem';
      group.innerHTML = `
        <label style="font-size:.8rem;text-transform:uppercase;letter-spacing:.06em;color:var(--brown-light);">${label}</label>
        <textarea rows="3" data-content-key="${key}" style="font-size:.875rem;">${stripTags(saved)}</textarea>
      `;
      container.appendChild(group);
    });

    container.querySelectorAll('textarea[data-content-key]').forEach((ta) => {
      ta.addEventListener('change', () => {
        localStorage.setItem('lila_content_' + ta.dataset.contentKey, ta.value);
        if (typeof showToast === 'function') showToast('Content saved ✓', 'success');
      });
    });
  }

  /* -------------------------------------------------------
     RESET
  ------------------------------------------------------- */
  function initReset() {
    const btn = document.getElementById('reset-products-btn');
    if (!btn) return;
    btn.addEventListener('click', () => {
      if (confirm('Reset all products to defaults? This cannot be undone.')) {
        Store.resetProducts();
        renderProductEditor();
        if (typeof showToast === 'function') showToast('Products reset to defaults', 'warning');
      }
    });
  }

  function initLogout() {
    const btn = document.getElementById('dashboard-logout-btn');
    if (!btn) return;
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      sessionStorage.removeItem('lilaAdminLoggedIn');
      location.reload();
    });
  }

  /* -------------------------------------------------------
     HELPERS
  ------------------------------------------------------- */
  function escHtml(s) {
    return String(s || '').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  function stripTags(s) {
    const d = document.createElement('div');
    d.innerHTML = s;
    return d.textContent || d.innerText || '';
  }

  /* -------------------------------------------------------
     INIT
  ------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', () => {
    initLogin();
    initReset();
    initLogout();
  });
})();
