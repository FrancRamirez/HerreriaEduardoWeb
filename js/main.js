/* ════════════════════════════════════════
   Herrería Eduardo — main.js (Rediseño)
   ════════════════════════════════════════ */

/* ── SLIDER HERO (header) ── */
let heroIndex = 0;
const heroSlides = document.getElementById('heroSlides');
const heroTotal  = heroSlides ? heroSlides.children.length : 0;

window.heroSlide = function(dir) {
  heroIndex = (heroIndex + dir + heroTotal) % heroTotal;
  heroSlides.style.transform = `translateX(-${heroIndex * 100}%)`;
};

// Auto-play hero slider cada 4s
if (heroTotal > 0) {
  setInterval(() => heroSlide(1), 4000);
}

/* ── SLIDER OWNER (acerca de mí) ── */
let ownerIndex = 0;
const ownerSlides = document.getElementById('ownerSlides');
const ownerTotal  = ownerSlides ? ownerSlides.children.length : 0;

window.ownerSlide = function(dir) {
  ownerIndex = (ownerIndex + dir + ownerTotal) % ownerTotal;
  ownerSlides.style.transform = `translateX(-${ownerIndex * 100}%)`;
};

/* ── SLIDER PROYECTOS (paginado) ── */
let projectPage = 0;
const projectsTrack = document.getElementById('projectsTrack');
const projPages = projectsTrack ? projectsTrack.children.length : 0;

function updateProjectDots() {
  document.querySelectorAll('.proj-dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === projectPage);
  });
}

window.projectsSlide = function(dir) {
  projectPage = (projectPage + dir + projPages) % projPages;
  projectsTrack.style.transform = `translateX(-${projectPage * 100}%)`;
  updateProjectDots();
};

window.goToProjectPage = function(index) {
  projectPage = index;
  projectsTrack.style.transform = `translateX(-${projectPage * 100}%)`;
  updateProjectDots();
};

/* ── SLIDER CONTACTO ── */
let contactIndex = 0;
const contactTrack = document.getElementById('contactTrack');
const contactTotal = contactTrack ? contactTrack.children.length : 0;

window.contactSlide = function(dir) {
  contactIndex = (contactIndex + dir + contactTotal) % contactTotal;
  contactTrack.style.transform = `translateX(-${contactIndex * 100}%)`;
};

/* ── CONTADOR ESTADÍSTICAS ── */
const counters = document.querySelectorAll('.stat-number[data-target]');

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el     = entry.target;
    const target = +el.dataset.target;
    const suffix = el.querySelector('span') ? el.querySelector('span').outerHTML : '';
    let current  = 0;
    const step   = Math.ceil(target / 50);
    const timer  = setInterval(() => {
      current = Math.min(current + step, target);
      el.innerHTML = current + suffix;
      if (current >= target) clearInterval(timer);
    }, 30);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.5 });

counters.forEach(c => counterObserver.observe(c));

/* ── PLAY/PAUSE VIDEOS EN PROYECTO (hover) ── */
document.querySelectorAll('.proj-item--video').forEach(item => {
  const video = item.querySelector('video');
  if (!video) return;
  item.addEventListener('mouseenter', () => video.play());
  item.addEventListener('mouseleave', () => { video.pause(); video.currentTime = 0; });
});

/* ── NAV STICKY: sombra al hacer scroll ── */
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  document.querySelector('.nav').style.boxShadow =
    window.scrollY > 10 ? '0 2px 12px rgba(0,0,0,0.4)' : 'none';
});

/* ── LIGHTBOX ── */
const lightbox      = document.getElementById('lightbox');
const lightboxImg   = document.getElementById('lightboxImg');
const lightboxVideo = document.getElementById('lightboxVideo');
const lightboxVSrc  = document.getElementById('lightboxVideoSrc');

function openLightbox(src, type) {
  // Resetear ambos primero
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

window.closeLightbox = function(e) {
  if (e && e.target !== lightbox && !e.target.classList.contains('lightbox-close')) return;
  lightbox.classList.remove('active');
  lightboxVideo.pause();
  lightboxVSrc.src = '';
  lightboxVideo.load();
  lightboxImg.src = '';
  document.body.style.overflow = '';
};

// Cerrar con Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeLightbox({ target: lightbox });
});

// Asignar click a cada proj-item
document.querySelectorAll('.proj-item').forEach(item => {
  item.style.cursor = 'pointer';
  item.addEventListener('click', () => {
    const videoEl = item.querySelector('video');
    const img     = item.querySelector('img');
    if (videoEl) {
      const source = videoEl.querySelector('source');
      const src = source ? source.getAttribute('src') : videoEl.getAttribute('src');
      openLightbox(src, 'video');
    } else if (img) {
      openLightbox(img.getAttribute('src'), 'image');
    }
  });
});
