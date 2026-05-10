/* ════════════════════════════════════════
   Herrería Eduardo — main.js (Rediseño)
   ════════════════════════════════════════ */

/* ── NAVBAR: sticky shadow + mobile toggle ── */
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav-links');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 10);

  // Highlight active nav link
  const sections = ['inicio', 'trabajos', 'externos', 'nosotros', 'contacto', 'resenas'];
  let current = '';
  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el && window.scrollY >= el.offsetTop - 90) current = id;
  });
  document.querySelectorAll('.nav-link').forEach(a => {
    a.classList.remove('active');
    if (a.getAttribute('href') === '#' + current) a.classList.add('active');
  });
});

navToggle?.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// Close menu on link click
document.querySelectorAll('.nav-link').forEach(a => {
  a.addEventListener('click', () => navLinks.classList.remove('open'));
});

/* ── SLIDER AUTOMÁTICO INICIO-RIGHT ── */
const inicioSlides = document.getElementById('inicioSlides');
if (inicioSlides) {
  let inicioIndex = 0;
  const inicioTotal = inicioSlides.children.length;
  setInterval(() => {
    inicioIndex = (inicioIndex + 1) % inicioTotal;
    inicioSlides.style.transform = `translateX(-${inicioIndex * 100}%)`;
  }, 10000);
}

/* ── TRABAJOS SLIDER ── */
let trabPage = 0;
const trabTrack = document.getElementById('trabajosTrack');
const trabPages = trabTrack ? trabTrack.children.length : 0;

function updateTrabDots() {
  document.querySelectorAll('.trab-dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === trabPage);
  });
}

window.trabajosSlide = function(dir) {
  trabPage = (trabPage + dir + trabPages) % trabPages;
  trabTrack.style.transform = `translateX(-${trabPage * 100}%)`;
  updateTrabDots();
};

window.goToTrabPage = function(index) {
  trabPage = index;
  trabTrack.style.transform = `translateX(-${trabPage * 100}%)`;
  updateTrabDots();
};

/* ── UBICACIÓN SLIDER ── */
let ubiIndex = 0;
const ubiTrack = document.getElementById('ubiTrack');
const ubiTotal = ubiTrack ? ubiTrack.children.length : 0;

window.ubiSlide = function(dir) {
  ubiIndex = (ubiIndex + dir + ubiTotal) % ubiTotal;
  ubiTrack.style.transform = `translateX(-${ubiIndex * 100}%)`;
};

/* ── VIDEO HOVER EN TRABAJOS ── */
document.querySelectorAll('.trab-item--video').forEach(item => {
  const video = item.querySelector('video');
  if (!video) return;
  item.addEventListener('mouseenter', () => video.play());
  item.addEventListener('mouseleave', () => { video.pause(); video.currentTime = 0; });
});

/* ── VIDEO HOVER EN EXTERNOS ── */
document.querySelectorAll('.externo-item.trab-item--video').forEach(item => {
  const video = item.querySelector('video');
  if (!video) return;
  item.addEventListener('mouseenter', () => video.play());
  item.addEventListener('mouseleave', () => { video.pause(); video.currentTime = 0; });
});

/* ── LIGHTBOX ── */
const lightbox        = document.getElementById('lightbox');
const lightboxImg     = document.getElementById('lightboxImg');
const lightboxVideo   = document.getElementById('lightboxVideo');
const lightboxVSrc    = document.getElementById('lightboxVSrc');
const lightboxClose   = document.getElementById('lightboxClose');
const lightboxPrev    = document.getElementById('lightboxPrev');
const lightboxNext    = document.getElementById('lightboxNext');
const lightboxContent = document.querySelector('.lightbox-content');

// Estado de navegación del lightbox
let lbSlides  = [];  // array de {type, src}
let lbCurrent = 0;

function buildSlideFromEl(slideEl) {
  const img     = slideEl.querySelector('img');
  const videoEl = slideEl.querySelector('video');
  if (videoEl) {
    const src = videoEl.querySelector('source')?.getAttribute('src') || videoEl.getAttribute('src');
    return { type: 'video', src };
  } else if (img) {
    return { type: 'image', src: img.getAttribute('src') };
  }
  return null;
}

function renderLightboxSlide(index) {
  const slide = lbSlides[index];
  if (!slide) return;

  lightboxImg.style.display   = 'none';
  lightboxVideo.style.display = 'none';
  lightboxVideo.pause();
  lightboxVSrc.src = '';
  lightboxVideo.load();

  const prevGallery = lightboxContent.querySelector('.lightbox-gallery');
  if (prevGallery) prevGallery.remove();

  if (slide.type === 'video') {
    lightboxVideo.style.display = 'block';
    lightboxVSrc.src = slide.src;
    lightboxVideo.load();
    lightboxVideo.play().catch(() => {});
  } else {
    lightboxImg.style.display = 'block';
    lightboxImg.src = slide.src;
  }

  // Mostrar/ocultar flechas
  const multi = lbSlides.length > 1;
  lightboxPrev.classList.toggle('visible', multi);
  lightboxNext.classList.toggle('visible', multi);
}

function openLightbox(src, type, slides, startIndex) {
  if (slides && slides.length) {
    lbSlides  = slides;
    lbCurrent = startIndex || 0;
  } else {
    lbSlides  = [{ type, src }];
    lbCurrent = 0;
  }
  renderLightboxSlide(lbCurrent);
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function lbNavigate(dir) {
  lbCurrent = (lbCurrent + dir + lbSlides.length) % lbSlides.length;
  renderLightboxSlide(lbCurrent);
}

function closeLightbox() {
  lightbox.classList.remove('active');
  lightboxVideo.pause();
  lightboxVSrc.src = '';
  lightboxVideo.load();
  lightboxImg.src = '';
  lightboxPrev.classList.remove('visible');
  lightboxNext.classList.remove('visible');
  lbSlides  = [];
  lbCurrent = 0;
  document.body.style.overflow = '';
}

lightboxClose?.addEventListener('click', closeLightbox);
lightboxPrev?.addEventListener('click', e => { e.stopPropagation(); lbNavigate(-1); });
lightboxNext?.addEventListener('click', e => { e.stopPropagation(); lbNavigate(1); });
lightbox?.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('active')) return;
  if (e.key === 'Escape')       closeLightbox();
  if (e.key === 'ArrowLeft')    lbNavigate(-1);
  if (e.key === 'ArrowRight')   lbNavigate(1);
});

// Bind click en trab-items normales
document.querySelectorAll('.trab-item:not(.trab-item--slider)').forEach(item => {
  item.addEventListener('click', () => {
    const type = item.dataset.type;
    const src  = item.dataset.src;
    if (src) openLightbox(src, type);
  });
});

// btn-ver en items normales
document.querySelectorAll('.trab-item:not(.trab-item--slider) .btn-ver').forEach(btn => {
  btn.addEventListener('click', e => {
    e.stopPropagation();
    const item = btn.closest('.trab-item');
    const src  = item?.dataset.src;
    const type = item?.dataset.type;
    if (src) openLightbox(src, type);
  });
});

/* ── MINI-SLIDERS EN TRAB-ITEMS ── */
document.querySelectorAll('.trab-item--slider').forEach(item => {
  const track  = item.querySelector('.trab-slider-track');
  const slides = track ? Array.from(track.children) : [];
  const dotsEl = item.querySelector('.trab-slider-dots');
  const prev   = item.querySelector('.trab-slider-prev');
  const next   = item.querySelector('.trab-slider-next');
  const btnVer = item.querySelector('.btn-ver');
  let current  = 0;

  if (!slides.length) return;

  // Crear dots
  slides.forEach((_, i) => {
    const dot = document.createElement('span');
    dot.className = 'trab-slider-dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', e => { e.stopPropagation(); goTo(i); });
    dotsEl.appendChild(dot);
  });

  function goTo(index) {
    current = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    dotsEl.querySelectorAll('.trab-slider-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  prev?.addEventListener('click', e => { e.stopPropagation(); goTo(current - 1); });
  next?.addEventListener('click', e => { e.stopPropagation(); goTo(current + 1); });

  // Construir array de slides para el lightbox
  function getAllSlides() {
    return slides.map(s => buildSlideFromEl(s)).filter(Boolean);
  }

  // Abrir lightbox con todos los slides y posicionado en el actual
  function openCurrent(e) {
    e.stopPropagation();
    openLightbox(null, null, getAllSlides(), current);
  }

  item.querySelector('.trab-slider')?.addEventListener('click', openCurrent);
  btnVer?.addEventListener('click', openCurrent);
});


// Bind click en externos
document.querySelectorAll('.externo-item').forEach(item => {
  item.addEventListener('click', () => {
    const src  = item.dataset.src;
    const type = item.dataset.type;
    if (src) openLightbox(src, type);
  });
});
