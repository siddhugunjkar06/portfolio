/* ═══════════════════════════════════════════════
   Portfolio — Minimal Light Theme JS
   3D Tilt · Smooth transitions · Interactions
═══════════════════════════════════════════════ */

// ─── Page Loader ──────────────────────────────
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('pageLoader');
    if (loader) loader.classList.add('hidden');
  }, 1200);
});

// ─── Custom Cursor ────────────────────────────
const cursorDot  = document.querySelector('.cursor-dot');
const cursorRing = document.querySelector('.cursor-ring');

if (cursorDot && cursorRing && window.innerWidth > 768) {
  let mx = 0, my = 0, rx = 0, ry = 0;

  window.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursorDot.style.left = mx + 'px';
    cursorDot.style.top  = my + 'px';
  });

  (function animateRing() {
    rx += (mx - rx) * 0.13;
    ry += (my - ry) * 0.13;
    cursorRing.style.left = rx + 'px';
    cursorRing.style.top  = ry + 'px';
    requestAnimationFrame(animateRing);
  })();

  document.querySelectorAll('a,button,.project-card,.service-card,.stat-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursorRing.style.width  = '52px';
      cursorRing.style.height = '52px';
      cursorRing.style.borderColor = 'rgba(196,96,42,0.6)';
      cursorDot.style.transform = 'translate(-50%,-50%) scale(0.5)';
    });
    el.addEventListener('mouseleave', () => {
      cursorRing.style.width  = '32px';
      cursorRing.style.height = '32px';
      cursorRing.style.borderColor = 'rgba(196,96,42,0.4)';
      cursorDot.style.transform = 'translate(-50%,-50%) scale(1)';
    });
  });
}

// ─── 3D Tilt on Cards ─────────────────────────
function init3DTilt() {
  document.querySelectorAll('.project-card, .service-card, .stat-card, .process-step').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect   = card.getBoundingClientRect();
      const x      = e.clientX - rect.left;
      const y      = e.clientY - rect.top;
      const cx     = rect.width  / 2;
      const cy     = rect.height / 2;
      const rotY   =  ((x - cx) / cx) * 7;
      const rotX   = -((y - cy) / cy) * 5;
      card.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(6px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.6s cubic-bezier(0.23,1,0.32,1), box-shadow 0.5s ease';
      card.style.transform  = '';
      setTimeout(() => { card.style.transition = ''; }, 600);
    });
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.15s ease, box-shadow 0.15s ease';
    });
  });
}
init3DTilt();

// ─── Navbar Scroll ────────────────────────────
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 30);
  }, { passive: true });
}

// ─── Hamburger ────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const spans = hamburger.querySelectorAll('span');
    if (navLinks.classList.contains('open')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity   = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
  });
}

// ─── Scroll Reveal ────────────────────────────
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

// ─── Skill Bars ───────────────────────────────
const skillObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.skill-fill').forEach(f => f.classList.add('animated'));
      skillObs.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });
const skillsSection = document.querySelector('.skills-wrapper');
if (skillsSection) skillObs.observe(skillsSection);

// ─── Testimonials Slider ──────────────────────
const track   = document.querySelector('.testimonials-track');
const dots    = document.querySelectorAll('.slider-dot');
const prevBtn = document.querySelector('.slider-prev');
const nextBtn = document.querySelector('.slider-next');

if (track) {
  let current = 0;
  const total = track.children.length;

  function goTo(i) {
    current = (i + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, idx) => d.classList.toggle('active', idx === current));
  }

  prevBtn?.addEventListener('click', () => goTo(current - 1));
  nextBtn?.addEventListener('click', () => goTo(current + 1));
  dots.forEach((d, i) => d.addEventListener('click', () => goTo(i)));

  let autoplay = setInterval(() => goTo(current + 1), 5500);
  const sliderEl = track.closest('.testimonials-slider');
  sliderEl?.addEventListener('mouseenter', () => clearInterval(autoplay));
  sliderEl?.addEventListener('mouseleave', () => { autoplay = setInterval(() => goTo(current + 1), 5500); });
}

// ─── Project Filter ───────────────────────────
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const cat = btn.dataset.category;
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    document.querySelectorAll('.project-card').forEach(card => {
      const show = cat === 'all' || card.dataset.category === cat;
      card.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
      card.style.opacity    = show ? '1' : '0';
      card.style.transform  = show ? '' : 'scale(0.95) translateY(10px)';
      setTimeout(() => { if (!show) card.style.display = 'none'; }, 350);
      if (show) { card.style.display = ''; }
    });
  });
});

// ─── Contact Form ─────────────────────────────
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = contactForm.querySelector('[type="submit"]');
    const orig = btn.innerHTML;
    btn.innerHTML = '<span class="spinner"></span> Sending…';
    btn.disabled  = true;

    try {
      const data   = Object.fromEntries(new FormData(contactForm));
      const res    = await fetch('/contact', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(data) });
      const result = await res.json();
      showToast(result.success ? 'success' : 'error', result.message);
      if (result.success) contactForm.reset();
    } catch {
      showToast('error', 'Something went wrong. Please try again.');
    } finally {
      btn.innerHTML = orig;
      btn.disabled  = false;
    }
  });
}

// ─── Toast ────────────────────────────────────
function showToast(type, message) {
  document.querySelector('.toast')?.remove();
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.innerHTML = `<span class="toast-icon">${type === 'success' ? '✓' : '✕'}</span><span class="toast-message">${message}</span>`;
  document.body.appendChild(t);
  requestAnimationFrame(() => requestAnimationFrame(() => t.classList.add('show')));
  setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 500); }, 4500);
}

// ─── Counter Animation ────────────────────────
const counterObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('[data-count]').forEach(el => {
        const raw    = el.dataset.count;
        const target = parseInt(raw.replace(/\D/g, ''));
        const suffix = raw.replace(/[0-9]/g, '');
        let n = 0;
        const step = target / (1800 / 16);
        const timer = setInterval(() => {
          n += step;
          if (n >= target) { el.textContent = target + suffix; clearInterval(timer); }
          else el.textContent = Math.floor(n) + suffix;
        }, 16);
      });
      counterObs.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.stats-grid, .hero-stats').forEach(el => counterObs.observe(el));

// ─── Smooth anchor scroll ─────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});

// ─── Active nav link ──────────────────────────
const path = window.location.pathname;
document.querySelectorAll('.nav-links a').forEach(a => {
  if (a.getAttribute('href') === path) a.classList.add('active');
});
