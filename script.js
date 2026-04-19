const header = document.getElementById('site-header');
const menuToggle = document.getElementById('menu-toggle');
const mobileNav = document.getElementById('mobile-nav');
const navLinks = [...document.querySelectorAll('.desktop-nav a, .mobile-nav a')];
const heroBg = document.getElementById('hero-bg');

function onScroll() {
  const scrolled = window.scrollY > 60;
  header.classList.toggle('scrolled', scrolled);
  heroBg.style.transform = `translateY(${Math.min(window.scrollY * 0.18, 120)}px)`;
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

menuToggle?.addEventListener('click', () => {
  mobileNav.classList.toggle('open');
  menuToggle.textContent = mobileNav.classList.contains('open') ? '✕' : '☰';
});

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    mobileNav.classList.remove('open');
    menuToggle.textContent = '☰';
  });
});

const sections = ['why-this-matters', 'nspgd', 'story', 'access', 'china', 'closing']
  .map(id => document.getElementById(id))
  .filter(Boolean);

const navMap = new Map(navLinks.map(link => [link.getAttribute('href')?.replace('#', ''), link]));

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { threshold: 0.3 });
sections.forEach(section => sectionObserver.observe(section));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('in-view');
  });
}, { threshold: 0.16 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

const track = document.getElementById('carousel-track');
const dotsWrap = document.getElementById('dots');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const totalSlides = 6;
let index = 0;
let timer;
let isAnimating = false;

for (let i = 0; i < totalSlides; i++) {
  const dot = document.createElement('button');
  dot.className = `dot ${i === 0 ? 'active' : ''}`;
  dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
  dot.addEventListener('click', () => jumpTo(i));
  dotsWrap.appendChild(dot);
}
const dots = [...dotsWrap.querySelectorAll('.dot')];

function updateDots(active) {
  dots.forEach((dot, i) => dot.classList.toggle('active', i === active));
}

function setTranslate() {
  track.style.transform = `translateX(-${index * 100}%)`;
}

function startAuto() {
  stopAuto();
  timer = setInterval(() => moveTo((index + 1) % totalSlides, true), 3200);
}

function stopAuto() {
  if (timer) clearInterval(timer);
}

function moveTo(nextIndex, wrapping = false) {
  if (isAnimating) return;
  isAnimating = true;

  if (wrapping && index === totalSlides - 1 && nextIndex === 0) {
    index = totalSlides;
    setTranslate();
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        index = 0;
        setTranslate();
        updateDots(0);
        setTimeout(() => { isAnimating = false; }, 680);
      });
    });
  } else {
    index = nextIndex;
    setTranslate();
    updateDots(nextIndex);
    setTimeout(() => { isAnimating = false; }, 680);
  }
}

function jumpTo(nextIndex) {
  stopAuto();
  index = nextIndex;
  setTranslate();
  updateDots(nextIndex);
  startAuto();
}

prevBtn.addEventListener('click', () => {
  stopAuto();
  jumpTo((index - 1 + totalSlides) % totalSlides);
});
nextBtn.addEventListener('click', () => {
  stopAuto();
  jumpTo((index + 1) % totalSlides);
});

startAuto();
