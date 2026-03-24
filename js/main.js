/**
 * main.js — Shared UI: nav, toasts, mobile menu, FAQ accordion
 */
(function () {
  'use strict';

  /* -------------------------------------------------------
     TOAST
  ------------------------------------------------------- */
  function ensureContainer() {
    let el = document.getElementById('toast-container');
    if (!el) {
      el = document.createElement('div');
      el.id = 'toast-container';
      document.body.appendChild(el);
    }
    return el;
  }

  window.showToast = function (msg, type = 'default') {
    const c = ensureContainer();
    const t = document.createElement('div');
    t.className = 'toast' + (type !== 'default' ? ' ' + type : '');
    t.textContent = msg;
    c.appendChild(t);
    requestAnimationFrame(() => requestAnimationFrame(() => t.classList.add('show')));
    setTimeout(() => {
      t.classList.remove('show');
      t.addEventListener('transitionend', () => t.remove(), { once: true });
    }, 3200);
  };

  /* -------------------------------------------------------
     ACTIVE NAV
  ------------------------------------------------------- */
  function highlightNav() {
    const page = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a, .mobile-nav a').forEach((a) => {
      a.classList.toggle('active', a.getAttribute('href') === page);
    });
  }

  /* -------------------------------------------------------
     MOBILE MENU
  ------------------------------------------------------- */
  function initMobileMenu() {
    const btn = document.querySelector('.nav-hamburger');
    const menu = document.querySelector('.mobile-nav');
    if (!btn || !menu) return;

    btn.addEventListener('click', () => {
      const open = menu.classList.toggle('open');
      btn.setAttribute('aria-expanded', open);
    });
  }

  /* -------------------------------------------------------
     FAQ ACCORDION
  ------------------------------------------------------- */
  function initFaq() {
    document.querySelectorAll('.faq-question').forEach((btn) => {
      btn.addEventListener('click', () => {
        const answer = btn.nextElementSibling;
        const isOpen = btn.classList.contains('open');

        // Close all
        document.querySelectorAll('.faq-question.open').forEach((b) => {
          b.classList.remove('open');
          b.nextElementSibling.classList.remove('open');
        });

        // Open clicked if it wasn't open
        if (!isOpen) {
          btn.classList.add('open');
          answer.classList.add('open');
        }
      });
    });
  }

  /* -------------------------------------------------------
     ADMIN RIBBON
  ------------------------------------------------------- */
  function initAdminRibbon() {
    const ribbon = document.getElementById('admin-ribbon');
    if (!ribbon) return;

    const loggedIn = sessionStorage.getItem('lilaAdminLoggedIn') === 'true';
    ribbon.classList.toggle('hidden', !loggedIn);

    const logoutBtn = document.getElementById('admin-logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        sessionStorage.removeItem('lilaAdminLoggedIn');
        showToast('Signed out of admin mode', 'success');
        ribbon.classList.add('hidden');
        document.querySelectorAll('.admin-tag').forEach((el) => el.style.display = 'none');
        disableEditMode();
      });
    }

    if (loggedIn) {
      enableEditMode();
    }
  }

  /* -------------------------------------------------------
     EDITABLE CONTENT (admin mode)
  ------------------------------------------------------- */
  function enableEditMode() {
    document.querySelectorAll('[data-editable]').forEach((el) => {
      const key = el.dataset.editable;

      // Load saved content
      const saved = localStorage.getItem('lila_content_' + key);
      if (saved) el.innerHTML = saved;

      el.classList.add('editable-highlight');
      el.setAttribute('contenteditable', 'true');
      el.setAttribute('title', 'Click to edit · changes save automatically');

      el.addEventListener('input', () => {
        localStorage.setItem('lila_content_' + key, el.innerHTML);
      });

      el.addEventListener('blur', () => {
        showToast('Content saved', 'success');
      });
    });
  }

  function disableEditMode() {
    document.querySelectorAll('[data-editable]').forEach((el) => {
      el.classList.remove('editable-highlight');
      el.removeAttribute('contenteditable');
    });
  }

  // On load, apply saved editable content even without admin mode
  function loadEditableContent() {
    document.querySelectorAll('[data-editable]').forEach((el) => {
      const saved = localStorage.getItem('lila_content_' + el.dataset.editable);
      if (saved) el.innerHTML = saved;
    });
  }

  /* -------------------------------------------------------
     NEWSLETTER FORM
  ------------------------------------------------------- */
  function initNewsletter() {
    document.querySelectorAll('.newsletter-form').forEach((form) => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = form.querySelector('input[type="email"]');
        if (input && input.value) {
          showToast('Thanks for subscribing! 🌿', 'success');
          input.value = '';
        }
      });
    });
  }

  /* -------------------------------------------------------
     CONTACT FORM
  ------------------------------------------------------- */
  function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Message sent! Lila will be in touch soon 🌿', 'success');
      form.reset();
    });
  }

  /* -------------------------------------------------------
     INIT
  ------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', () => {
    highlightNav();
    initMobileMenu();
    initFaq();
    initAdminRibbon();
    loadEditableContent();
    initNewsletter();
    initContactForm();
  });
})();
