// ==========================================================
// DUSUN MRANGGEN — interactions
// ==========================================================

document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('siteHeader');
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');
  const toTopBtn = document.getElementById('toTop');
  const yearEl = document.getElementById('year');
  const heroMountains = document.getElementById('heroMountains');
  const ridges = heroMountains ? heroMountains.querySelectorAll('.ridge') : [];

  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---------- header shrink + parallax + back-to-top ----------
  const onScroll = () => {
    const y = window.scrollY;

    if (y > 40) header.classList.add('scrolled');
    else header.classList.remove('scrolled');

    if (y > 480) toTopBtn.classList.add('visible');
    else toTopBtn.classList.remove('visible');

    // parallax ridges at different speeds for depth
    ridges.forEach((ridge, i) => {
      const speed = (i + 1) * 0.06;
      ridge.style.transform = `translateY(${y * speed}px)`;
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  toTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ---------- mobile nav ----------
  navToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  mainNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // ---------- scroll reveal ----------
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach((el, i) => {
    el.style.transitionDelay = `${Math.min(i % 4, 3) * 90}ms`;
    revealObserver.observe(el);
  });

  // ---------- animated counters ----------
  const counters = document.querySelectorAll('.stat-number');
  const animateCounter = (el) => {
    const target = parseInt(el.dataset.count, 10) || 0;
    const duration = 1400;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target).toLocaleString('id-ID');
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => counterObserver.observe(el));

  // ---------- animated comparison / gender bars ----------
  const widthBars = document.querySelectorAll('.compare-bar, .gender-l, .gender-p');
  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const w = el.dataset.width || '0';
        requestAnimationFrame(() => { el.style.width = `${w}%`; });
        barObserver.unobserve(el);
      }
    });
  }, { threshold: 0.3 });

  widthBars.forEach(el => barObserver.observe(el));

  // ---------- active nav link on scroll ----------
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const id = entry.target.getAttribute('id');
      const link = document.querySelector(`.nav-link[href="#${id}"]`);
      if (!link) return;
      if (entry.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('is-active'));
        link.classList.add('is-active');
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });

  sections.forEach(section => navObserver.observe(section));

// ---------- gallery lightbox ----------
  const lightbox = document.getElementById('lightbox');
  const lightboxPanel = document.getElementById('lightboxPanel');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  const galleryItems = document.querySelectorAll('.gallery-item, .produk-thumb');

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const photo = item.querySelector('.gallery-photo, .produk-photo');
      const hasPhoto = photo && getComputedStyle(photo).display !== 'none';

      if (hasPhoto) {
        lightboxPanel.style.backgroundImage = `url("${photo.getAttribute('src')}")`;
        lightboxPanel.style.backgroundSize = 'cover';
        lightboxPanel.style.backgroundPosition = 'center';
      } else {
        lightboxPanel.style.backgroundSize = '';
        lightboxPanel.style.backgroundPosition = '';
        lightboxPanel.style.backgroundImage = getComputedStyle(item).backgroundImage !== 'none'
          ? getComputedStyle(item).backgroundImage
          : getComputedStyle(item).background;
      }

      lightboxCaption.textContent = item.dataset.caption || '';
      lightbox.classList.add('open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeLightbox = () => {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

  // ---------- contact form (demo only, no backend) ----------
  const kontakForm = document.getElementById('kontakForm');
  const formStatus = document.getElementById('formStatus');

  kontakForm.addEventListener('submit', (e) => {
    e.preventDefault();
    formStatus.textContent = 'Pesan tersimpan secara lokal (demo) — hubungkan ke email/WhatsApp asli agar berfungsi penuh.';
    kontakForm.reset();
  });
});