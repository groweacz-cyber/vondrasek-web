// ===== Mobile navigation toggle =====
const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('main-nav');

if (navToggle && mainNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  // Close mobile menu after clicking a link
  mainNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// ===== Footer year =====
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ===== Contact form (placeholder — no backend yet) =====
const form = document.getElementById('contactForm');
const formNote = document.getElementById('formNote');

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // TODO: napojit na skutečné odeslání (např. e-mail service, formspree, nebo vlastní API endpoint).
    // Zatím jen potvrzení pro uživatele, ať formulář vypadá a chová se funkčně.
    formNote.textContent = 'Díky! Ozveme se vám co nejdříve na uvedený kontakt.';
    form.reset();
  });
}
