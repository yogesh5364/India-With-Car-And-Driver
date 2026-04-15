// Navbar scroll
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  document.getElementById('back-top').classList.toggle('visible', window.scrollY > 400);
});
document.getElementById('back-top').addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// Mobile nav
document.getElementById('nav-toggle').addEventListener('click', function() {
  const drawer = document.getElementById('nav-drawer');
  drawer.classList.toggle('open');
  this.setAttribute('aria-expanded', drawer.classList.contains('open'));
});

// Hero Slider
const slides = document.querySelectorAll('.hero-slide');
const dots = document.querySelectorAll('.hero-dot');
const slider = document.getElementById('hero-slider');
let current = 0;
let autoTimer;

function goTo(idx) {
  slides[current].classList.remove('active');
  dots[current].classList.remove('active');
  current = (idx + slides.length) % slides.length;
  slides[current].classList.add('active');
  dots[current].classList.add('active');
  slider.style.transform = `translateX(-${current * 100}%)`;
}

function startAuto() {
  autoTimer = setInterval(() => goTo(current + 1), 4500);
}
function stopAuto() { clearInterval(autoTimer); }

document.getElementById('hero-prev').addEventListener('click', () => { stopAuto(); goTo(current - 1); startAuto(); });
document.getElementById('hero-next').addEventListener('click', () => { stopAuto(); goTo(current + 1); startAuto(); });
dots.forEach(dot => {
  dot.addEventListener('click', () => { stopAuto(); goTo(+dot.dataset.index); startAuto(); });
});
startAuto();

// Reveal on scroll
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
}, { threshold: 0.1 });
reveals.forEach(el => observer.observe(el));