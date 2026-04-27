/* ════════════════════════════════════════
   Herrería Artística Eduardo — main.js
   ════════════════════════════════════════ */

// ── Contador animado de estadísticas ──
const counters = document.querySelectorAll('.stat-number[data-target]');

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    const el = entry.target;
    const target = +el.dataset.target;
    const suffix = el.querySelector('span') ? el.querySelector('span').outerHTML : '';
    let current = 0;
    const step = Math.ceil(target / 50);

    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.innerHTML = current + suffix;
      if (current >= target) clearInterval(timer);
    }, 30);

    counterObserver.unobserve(el);
  });
}, { threshold: 0.5 });

counters.forEach(c => counterObserver.observe(c));

// ── Slider de ubicación ──
let currentSlide = 0;
const totalSlides = 2;

function updateSlider() {
  const track = document.getElementById('locationTrack');
  if (!track) return;
  track.style.transform = `translateX(-${currentSlide * 50}%)`;
  document.querySelectorAll('.slider-dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === currentSlide);
  });
}

window.slideLocation = function(dir) {
  currentSlide = (currentSlide + dir + totalSlides) % totalSlides;
  updateSlider();
};

window.goToSlide = function(index) {
  currentSlide = index;
  updateSlider();
};

// ── Play/pause videos en project-cards al hover ──
document.querySelectorAll('.project-card').forEach(card => {
  const video = card.querySelector('.project-video');
  if (!video) return;
  card.addEventListener('mouseenter', () => video.play());
  card.addEventListener('mouseleave', () => { video.pause(); video.currentTime = 0; });
});
