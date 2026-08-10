/* ============================================
   Simón Rodríguez — Fotografía & Cine
   ============================================ */

/* -----------------------------------------------------------
   FOTOS: agrega aquí una línea por cada foto que quieras
   mostrar en la galería. "src" es la ruta al archivo dentro
   de assets/photos/, y "caption" es opcional (texto que
   aparece al pasar el mouse por encima).

   Ejemplo:
   { src: 'assets/photos/01.jpg', caption: 'Retrato, 2025' },

   Mientras esta lista esté vacía, se muestran recuadros de
   marcador de posición para que el diseño se vea completo.
----------------------------------------------------------- */
const photos = [
  { src: 'assets/photos/01.webp', caption: '' },
  { src: 'assets/photos/02.webp', caption: '' },
  { src: 'assets/photos/03.webp', caption: '' },
  { src: 'assets/photos/04.webp', caption: '' },
  { src: 'assets/photos/05.jpg', caption: '' },
  { src: 'assets/photos/06.webp', caption: '' },
  { src: 'assets/photos/07.webp', caption: '' },
  { src: 'assets/photos/08.jpg', caption: '' },
  { src: 'assets/photos/09.webp', caption: '' },
  { src: 'assets/photos/10.webp', caption: '' },
  { src: 'assets/photos/11.webp', caption: '' },
  { src: 'assets/photos/12.webp', caption: '' },
];

/* -----------------------------------------------------------
   NÚMERO DE CONTACTO / WHATSAPP
   Reemplaza el número (formato internacional, solo dígitos,
   sin espacios ni símbolos, ej: '521234567890') para activar
   el botón de WhatsApp.
----------------------------------------------------------- */
const whatsappNumber = '573008262703'; // ej: '521234567890'
const phoneDisplayText = '+57 300 826 2703'; // ej: '+52 123 456 7890'

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initNav();
  initReveal();
  initGallery();
  initLightbox();
  initCursor();
  initFilmFallback();
  initContact();
  document.getElementById('year').textContent = new Date().getFullYear();
});

/* Header background on scroll */
function initHeader() {
  const header = document.getElementById('siteHeader');
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // subtle parallax on hero background
  const heroBg = document.querySelector('.hero-bg');
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (heroBg) heroBg.style.transform = `translateY(${y * 0.15}px)`;
  }, { passive: true });
}

/* Mobile nav toggle */
function initNav() {
  const toggle = document.getElementById('navToggle');
  const nav = document.getElementById('mainNav');
  toggle.addEventListener('click', () => {
    toggle.classList.toggle('open');
    nav.classList.toggle('open');
  });
  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      toggle.classList.remove('open');
      nav.classList.remove('open');
    });
  });
}

/* Fade/slide-up reveal on scroll */
function initReveal() {
  const items = document.querySelectorAll('[data-reveal]');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
  );
  items.forEach((el) => observer.observe(el));
}

/* Build the gallery grid from the `photos` array */
function initGallery() {
  const grid = document.getElementById('galleryGrid');
  const count = photos.length > 0 ? photos.length : 6;

  for (let i = 0; i < count; i++) {
    const item = document.createElement('div');
    item.className = 'gallery-item';

    if (photos[i]) {
      const img = document.createElement('img');
      img.src = photos[i].src;
      img.alt = photos[i].caption || 'Fotografía de Simón Rodríguez';
      img.loading = 'lazy';
      item.appendChild(img);

      if (photos[i].caption) {
        const overlay = document.createElement('div');
        overlay.className = 'overlay';
        overlay.innerHTML = `<span>${photos[i].caption}</span>`;
        item.appendChild(overlay);
      }

      item.addEventListener('click', () => openLightbox(photos[i].src, img.alt));
    } else {
      const placeholder = document.createElement('div');
      placeholder.className = 'placeholder-tile';
      placeholder.innerHTML = `
        <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1">
          <rect x="3" y="6" width="18" height="13" rx="1"></rect>
          <path d="M8 6l1.5-2.5h5L16 6"></path>
          <circle cx="12" cy="12.5" r="3.3"></circle>
        </svg>
        <span>Foto próximamente</span>`;
      item.appendChild(placeholder);
    }

    grid.appendChild(item);
  }

  // observe the newly created items for the reveal animation
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );
  grid.querySelectorAll('.gallery-item').forEach((el, idx) => {
    el.style.transitionDelay = `${(idx % 3) * 0.08}s`;
    observer.observe(el);
  });
}

/* Lightbox for full-size photo viewing */
let lightboxEl, lightboxImg;
function initLightbox() {
  lightboxEl = document.getElementById('lightbox');
  lightboxImg = document.getElementById('lightboxImg');
  document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
  lightboxEl.addEventListener('click', (e) => {
    if (e.target === lightboxEl) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });
}
function openLightbox(src, alt) {
  lightboxImg.src = src;
  lightboxImg.alt = alt || '';
  lightboxEl.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  lightboxEl.classList.remove('open');
  document.body.style.overflow = '';
}

/* Soft custom cursor dot, desktop only (progressive enhancement) */
function initCursor() {
  const dot = document.getElementById('cursorDot');
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  window.addEventListener('mousemove', (e) => {
    dot.style.left = `${e.clientX}px`;
    dot.style.top = `${e.clientY}px`;
  });
}

/* Hide the "coming soon" caption once the short film loads */
function initFilmFallback() {
  const video = document.getElementById('filmVideo');
  const fallback = document.getElementById('filmFallback');
  video.addEventListener('loadedmetadata', () => {
    fallback.style.display = 'none';
  });
  video.addEventListener('error', () => {
    fallback.style.display = 'block';
  });
}

/* Wire up the WhatsApp / phone contact link */
function initContact() {
  const link = document.getElementById('whatsappLink');
  const display = document.getElementById('phoneDisplay');
  if (whatsappNumber) {
    link.href = `https://wa.me/${whatsappNumber}`;
    display.textContent = phoneDisplayText || whatsappNumber;
  } else {
    link.removeAttribute('target');
    link.addEventListener('click', (e) => e.preventDefault());
  }
}
