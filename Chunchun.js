/* Chunchun.js — hybrid: works for multi-page or single-page setups */

(function () {
  // -------- Utilities --------
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const $  = (sel, root = document) => root.querySelector(sel);

  function smoothTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function setActiveNavByPath() {
    // Highlight active nav item using current path (multi-page)
    const current = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    $$('.nav-menu a[href]').forEach(a => {
      const target = (a.getAttribute('href') || '').split('/').pop().toLowerCase();
      const isActive = (current === '' && target === 'index.html') || current === target;
      a.classList.toggle('active', isActive);
      if (isActive) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
  }

  // -------- Single-Page Router (only if there are 2+ .page sections) --------
  function isSinglePageApp() {
    return $$('.page').length > 1;
  }

  function showPage(pageId) {
    // Hide all pages
    $$('.page').forEach(p => p.classList.remove('active'));

    // Show selected page (only if it exists)
    const el = document.getElementById(pageId);
    if (!el) {
      console.warn('No page with id:', pageId);
      return;
    }
    el.classList.add('active');

    // Update active nav styling + aria-current for SPA links
    $$('.nav-menu a[data-page]').forEach(a => {
      const isActive = a.getAttribute('data-page') === pageId;
      a.classList.toggle('active', isActive);
      if (isActive) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });

    // Scroll to top
    smoothTop();
  }

  function initSPA() {
    // Intercept only SPA nav links (those with data-page or hash-only hrefs)
    $$('.nav-menu a').forEach(link => {
      const dataPage = link.getAttribute('data-page');
      const href = link.getAttribute('href') || '';

      const isHashOnly = href.startsWith('#') && href.length > 1;
      if (dataPage || isHashOnly) {
        link.addEventListener('click', e => {
          e.preventDefault();
          const id = dataPage || href.slice(1);
          if (!id) return;
          if (location.hash !== '#' + id) {
            history.pushState({ page: id }, '', '#' + id);
          }
          showPage(id);
        });
      }
    });

    // Handle back/forward
    window.addEventListener('popstate', () => {
      const id = (location.hash || '#' + getDefaultSPAId()).slice(1);
      showPage(id);
    });

    // Initial page: from hash → default
    const initialId = (location.hash && location.hash.slice(1)) || getDefaultSPAId();
    showPage(initialId);
  }

  function getDefaultSPAId() {
    // Prefer #home if present; else first .page
    return document.getElementById('home')?.id || $('.page')?.id || '';
  }

  // -------- Multi-Page Enhancements --------
  function initMultiPage() {
    // Ensure a single .page wrapper becomes visible even if CSS uses .page{display:none}
    const pages = $$('.page');
    if (pages.length === 1 && !pages[0].classList.contains('active')) {
      pages[0].classList.add('active');
    }

    // Highlight current nav item by path
    setActiveNavByPath();
  }

  // -------- Common: Back-to-top --------
  function initBackToTop() {
    document.addEventListener('click', e => {
      if (e.target.classList.contains('back-to-top')) {
        smoothTop();
      }
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Enter' && document.activeElement?.classList.contains('back-to-top')) {
        smoothTop();
      }
    });
  }

  // -------- Init --------
  document.addEventListener('DOMContentLoaded', () => {
    if (isSinglePageApp()) {
      initSPA();
    } else {
      initMultiPage();
    }
    initBackToTop();
  });
})();
