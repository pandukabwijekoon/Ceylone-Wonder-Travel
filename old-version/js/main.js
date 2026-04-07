/* ============================================
   MAIN.JS — Ceylon Wonders Core Logic
   ============================================ */

// ===== LOADING SCREEN =====
window.addEventListener('load', () => {
  setTimeout(() => {
    const ls = document.getElementById('loading-screen');
    if (ls) ls.classList.add('hidden');
  }, 1900);
});

// ===== CURSOR GLOW =====
const cursorGlow = document.getElementById('cursorGlow');
if (cursorGlow) {
  document.addEventListener('mousemove', (e) => {
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top = e.clientY + 'px';
  });
}

// ===== HEADER SCROLL =====
const header = document.getElementById('mainHeader');
if (header) {
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
  });
}

// ===== HAMBURGER / MOBILE MENU =====
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('open');
  });
  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('open');
    }
  });
}

// ===== HERO BACKGROUND SLIDER =====
const heroSlides = document.querySelectorAll('#heroBgSlider .hero-slide');
const heroThumbs = document.querySelectorAll('#heroThumbs .side-thumb');
let heroIdx = 0, heroTimer = null;

function goToSlide(idx) {
  heroSlides.forEach(s => s.classList.remove('active'));
  heroThumbs.forEach(t => t.classList.remove('active'));
  heroIdx = (idx + heroSlides.length) % heroSlides.length;
  heroSlides[heroIdx] && heroSlides[heroIdx].classList.add('active');
  heroThumbs[heroIdx] && heroThumbs[heroIdx].classList.add('active');
}

function startHeroAuto() {
  heroTimer = setInterval(() => goToSlide(heroIdx + 1), 5000);
}

heroThumbs.forEach(thumb => {
  thumb.addEventListener('click', () => {
    clearInterval(heroTimer);
    goToSlide(parseInt(thumb.dataset.slide));
    startHeroAuto();
  });
});

if (heroSlides.length) startHeroAuto();

// ===== GALLERY SLIDER =====
const gSlides = document.querySelectorAll('.gslide');
const gdotsContainer = document.getElementById('gdots');
let gIdx = 0, gTimer = null;

function buildGdots() {
  if (!gdotsContainer || !gSlides.length) return;
  gdotsContainer.innerHTML = '';
  gSlides.forEach((_, i) => {
    const d = document.createElement('button');
    d.className = 'gdot' + (i === 0 ? ' active' : '');
    d.addEventListener('click', () => { clearInterval(gTimer); goGSlide(i); startGAuto(); });
    gdotsContainer.appendChild(d);
  });
}

function goGSlide(idx) {
  gSlides.forEach(s => s.classList.remove('active'));
  const dots = document.querySelectorAll('.gdot');
  gIdx = (idx + gSlides.length) % gSlides.length;
  gSlides[gIdx] && gSlides[gIdx].classList.add('active');
  dots.forEach(d => d.classList.remove('active'));
  dots[gIdx] && dots[gIdx].classList.add('active');
}

function startGAuto() {
  gTimer = setInterval(() => goGSlide(gIdx + 1), 4000);
}

document.getElementById('gprev')?.addEventListener('click', () => { clearInterval(gTimer); goGSlide(gIdx - 1); startGAuto(); });
document.getElementById('gnext')?.addEventListener('click', () => { clearInterval(gTimer); goGSlide(gIdx + 1); startGAuto(); });

buildGdots();
if (gSlides.length) startGAuto();

// ===== SCROLL REVEAL =====
const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
revealEls.forEach(el => revealObs.observe(el));

// ===== COUNTER ANIMATION =====
function animateCount(el, target) {
  let start = 0;
  const duration = 2000;
  const step = timestamp => {
    if (!step.startTime) step.startTime = timestamp;
    const progress = Math.min((timestamp - step.startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target).toLocaleString();
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target.toLocaleString() + (el.dataset.suffix || '');
  };
  requestAnimationFrame(step);
}

const counterObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const target = parseInt(e.target.dataset.target);
      animateCount(e.target, target);
      counterObs.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-num[data-target]').forEach(el => counterObs.observe(el));

// ===== PARTICLES =====
const particlesContainer = document.getElementById('heroParticles');
if (particlesContainer) {
  for (let i = 0; i < 20; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      bottom: -10px;
      width: ${Math.random() * 4 + 2}px;
      height: ${Math.random() * 4 + 2}px;
      animation-duration: ${Math.random() * 15 + 10}s;
      animation-delay: ${Math.random() * 10}s;
      opacity: ${Math.random() * 0.5 + 0.1};
    `;
    particlesContainer.appendChild(p);
  }
}

// ===== HERO MOUSE PARALLAX =====
const heroSection = document.getElementById('home');
const heroContent = document.querySelector('.hero-content');
if (heroSection && heroContent) {
  heroSection.addEventListener('mousemove', (e) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const moveX = (clientX - innerWidth / 2) / 25;
    const moveY = (clientY - innerHeight / 2) / 25;
    heroContent.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
  });
}

// ===== TOAST =====
window.showToast = function(msg, type = 'success') {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.className = `toast ${type}`;
  toast.textContent = msg;
  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => toast.classList.remove('show'), 3500);
};

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});

// ===== ACTIVE NAV =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 200) current = s.id; });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}` || link.getAttribute('href').includes(current)) link.classList.add('active');
  });
});
