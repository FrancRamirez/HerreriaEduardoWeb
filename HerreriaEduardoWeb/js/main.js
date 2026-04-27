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
