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
  const sections = ['inicio', 'trabajos', 'nosotros', 'contacto'];
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

/* ── LIGHTBOX ── */
const lightbox      = document.getElementById('lightbox');
const lightboxImg   = document.getElementById('lightboxImg');
const lightboxVideo = document.getElementById('lightboxVideo');
const lightboxVSrc  = document.getElementById('lightboxVSrc');
const lightboxClose = document.getElementById('lightboxClose');

function openLightbox(src, type) {
  lightboxImg.style.display   = 'none';
  lightboxVideo.style.display = 'none';
  lightboxVideo.pause();
  lightboxVSrc.src = '';
  lightboxVideo.load();

  if (type === 'video') {
    lightboxVideo.style.display = 'block';
    lightboxVSrc.src = src;
    lightboxVideo.load();
    lightboxVideo.play().catch(() => {});
  } else {
    lightboxImg.style.display = 'block';
    lightboxImg.src = src;
  }
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('active');
  lightboxVideo.pause();
  lightboxVSrc.src = '';
  lightboxVideo.load();
  lightboxImg.src = '';
  document.body.style.overflow = '';
}

lightboxClose?.addEventListener('click', closeLightbox);
lightbox?.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

// Bind click on each trab-item
document.querySelectorAll('.trab-item').forEach(item => {
  item.addEventListener('click', () => {
    const src  = item.dataset.src;
    const type = item.dataset.type;
    if (src) openLightbox(src, type);
  });
});
// Also bind btn-ver
document.querySelectorAll('.btn-ver').forEach(btn => {
  btn.addEventListener('click', e => {
    e.stopPropagation();
    const item = btn.closest('.trab-item');
    const src  = item?.dataset.src;
    const type = item?.dataset.type;
    if (src) openLightbox(src, type);
  });
});
