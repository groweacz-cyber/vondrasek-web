// ===== Základ: preference uživatele + signál pro pojistku v index.html =====
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
window.__ready = true;

// ===== Hlavička: po odscrollování zesílí sklo =====
const siteHeader = document.getElementById('header');
if (siteHeader) {
  const updateHeader = () => siteHeader.classList.toggle('is-scrolled', window.scrollY > 24);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });
}

// ===== Mobile navigation toggle =====
const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('main-nav');

function closeNav(returnFocus) {
  mainNav.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
  navToggle.setAttribute('aria-label', 'Otevřít menu');
  if (returnFocus) navToggle.focus();
}

if (navToggle && mainNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    navToggle.setAttribute('aria-label', isOpen ? 'Zavřít menu' : 'Otevřít menu');
  });

  // Close mobile menu after clicking a link
  mainNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => closeNav(false));
  });

  // Escape menu zavře (a vrátí fokus na tlačítko), klik mimo menu také
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mainNav.classList.contains('open')) closeNav(true);
  });
  document.addEventListener('click', (e) => {
    if (mainNav.classList.contains('open') && !mainNav.contains(e.target) && !navToggle.contains(e.target)) closeNav(false);
  });
  // Při přechodu na širokou obrazovku se menu vrátí do výchozího stavu
  window.matchMedia('(min-width: 981px)').addEventListener('change', (e) => { if (e.matches) closeNav(false); });
}

// ===== Zvýraznění aktuální sekce v navigaci =====
if (mainNav && 'IntersectionObserver' in window) {
  const navLinks = Array.from(mainNav.querySelectorAll('a[href^="#"]'));
  const setActive = (id) => {
    navLinks.forEach(link => {
      if (link.getAttribute('href') === '#' + id) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  };
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const hasLink = navLinks.some(link => link.getAttribute('href') === '#' + entry.target.id && !link.hidden);
      if (entry.isIntersecting && hasLink) setActive(entry.target.id);
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  document.querySelectorAll('main section[id]').forEach(section => navObserver.observe(section));
}

// ===== Indikátor průchodu stránkou (záloha pro prohlížeče bez CSS scroll-driven animací) =====
const progressBar = document.querySelector('.scroll-progress span');
if (progressBar && !(window.CSS && CSS.supports && CSS.supports('animation-timeline: scroll()'))) {
  const updateProgress = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.setProperty('--p', max > 0 ? (window.scrollY / max).toFixed(4) : '0');
  };
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress);
  updateProgress();
}

// ===== Odhalení prvků při scrollu =====
const revealEls = document.querySelectorAll('.reveal');
if (reducedMotion || !('IntersectionObserver' in window)) {
  revealEls.forEach(el => el.classList.add('is-in'));
} else {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-in');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  revealEls.forEach(el => revealObserver.observe(el));
}

// ===== Čísla flotily: dopočítání od nuly při zobrazení =====
// Bez JS zůstane v HTML konečná hodnota (30+, 8), takže nic nechybí ani při selhání skriptu.
document.querySelectorAll('.count').forEach(el => {
  const target = parseInt(el.dataset.count, 10);
  const suffix = el.dataset.suffix || '';
  if (isNaN(target) || reducedMotion || !('IntersectionObserver' in window)) return;

  el.textContent = '0' + suffix;
  const countObserver = new IntersectionObserver((entries, observer) => {
    if (!entries[0].isIntersecting) return;
    observer.disconnect();
    const duration = 1600;
    const startTime = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - startTime) / duration);
      el.textContent = Math.round(target * (1 - Math.pow(1 - t, 4))) + suffix;
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, { threshold: 0.6 });
  countObserver.observe(el);
});

// ===== Záře sledující kurzor na kartách (jen myš/trackpad) =====
if (finePointer) {
  document.addEventListener('pointermove', (e) => {
    const card = e.target.closest ? e.target.closest('[data-spotlight]') : null;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mx', (e.clientX - rect.left) + 'px');
    card.style.setProperty('--my', (e.clientY - rect.top) + 'px');
  }, { passive: true });
}

// ===== Jemný náklon fotky v heru (jen myš/trackpad) =====
const tiltEl = document.querySelector('[data-tilt]');
if (tiltEl && finePointer && !reducedMotion) {
  const MAX_TILT = 5; // stupňů
  const host = tiltEl.parentElement;
  host.addEventListener('pointermove', (e) => {
    const rect = tiltEl.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    tiltEl.style.setProperty('--ry', (px * MAX_TILT * 2).toFixed(2) + 'deg');
    tiltEl.style.setProperty('--rx', (-py * MAX_TILT * 2).toFixed(2) + 'deg');
  });
  host.addEventListener('pointerleave', () => {
    tiltEl.style.setProperty('--rx', '0deg');
    tiltEl.style.setProperty('--ry', '0deg');
  });
}

// ===== Galerie vozového parku: tlačítka předchozí/další =====
const rail = document.querySelector('.rail');
const railButtons = document.querySelectorAll('[data-rail]');
if (rail && railButtons.length) {
  const stepSize = () => {
    const card = rail.querySelector('.rail-card');
    const gap = parseFloat(getComputedStyle(rail).columnGap) || 0;
    return card ? card.getBoundingClientRect().width + gap : rail.clientWidth * 0.8;
  };
  const updateRailButtons = () => {
    const maxScroll = rail.scrollWidth - rail.clientWidth - 2;
    railButtons.forEach(btn => {
      btn.disabled = btn.dataset.rail === 'prev' ? rail.scrollLeft <= 2 : rail.scrollLeft >= maxScroll;
    });
  };
  railButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      rail.scrollBy({ left: (btn.dataset.rail === 'next' ? 1 : -1) * stepSize(), behavior: reducedMotion ? 'auto' : 'smooth' });
    });
  });
  rail.addEventListener('scroll', () => requestAnimationFrame(updateRailButtons), { passive: true });
  window.addEventListener('resize', updateRailButtons);
  updateRailButtons();
}

// ===== Při omezeném pohybu zastavit i SVG animace (SMIL) =====
if (reducedMotion) {
  document.querySelectorAll('.net svg').forEach(svg => { if (svg.pauseAnimations) svg.pauseAnimations(); });
}

// ===== Footer year =====
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ===== Kontaktní formulář — odeslání přes Web3Forms (zdarma, bez vlastního backendu) =====
// 1. Založ si zdarma účet na https://web3forms.com s e-mailem favondrasek@email.cz jako příjemcem.
// 2. Zkopíruj přidělený Access Key a vlož ho sem místo placeholderu níže.
const WEB3FORMS_ACCESS_KEY = 'b302f35d-0b02-4080-abcc-4dfae7d0fb61';

const form = document.getElementById('contactForm');
const formNote = document.getElementById('formNote');

// E-mail: obsahuje @ a tečku za ním
function vypadaJakoEmail(value) {
  const zavinac = value.indexOf('@');
  if (zavinac === -1) return false;
  return value.indexOf('.', zavinac) > zavinac;
}

// Telefon: aspoň 9 číslic po odstranění mezer, +, závorek a pomlček
function vypadaJakoTelefon(value) {
  const cislice = value.replace(/[\s+()-]/g, '').match(/\d/g) || [];
  return cislice.length >= 9;
}

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Honeypot — pokud je vyplněný/zaškrtnutý, jde o bota, tiše ukonči (žádná odpověď botovi)
    const honeypot = form.querySelector('[name="botcheck"]');
    if (honeypot && honeypot.checked) return;

    const nameField = form.querySelector('#f-name');
    const contactField = form.querySelector('#f-contact');
    const nameValue = nameField.value.trim();
    const contactValue = contactField.value.trim();
    const routeValue = form.querySelector('#f-route').value.trim();
    const messageValue = form.querySelector('#f-message').value.trim();

    nameField.removeAttribute('aria-invalid');
    contactField.removeAttribute('aria-invalid');
    formNote.classList.remove('success', 'error');

    let invalidField = null;
    let invalidMessage = '';
    if (!nameValue) {
      invalidField = nameField;
      invalidMessage = 'Vyplňte prosím jméno.';
    } else if (!contactValue) {
      invalidField = contactField;
      invalidMessage = 'Vyplňte prosím telefon nebo e-mail.';
    } else if (!vypadaJakoEmail(contactValue) && !vypadaJakoTelefon(contactValue)) {
      invalidField = contactField;
      invalidMessage = 'Zadejte platný telefon nebo e-mail.';
    }

    if (invalidField) {
      invalidField.setAttribute('aria-invalid', 'true');
      formNote.classList.add('error');
      formNote.textContent = invalidMessage;
      invalidField.focus();
      return;
    }

    // Text tlačítka se mění jen v elementu .btn-label, aby zůstala zachovaná ikona šipky
    const submitBtn = form.querySelector('button[type="submit"]');
    const submitLabel = submitBtn ? (submitBtn.querySelector('.btn-label') || submitBtn) : null;
    const originalBtnText = submitLabel ? submitLabel.textContent : '';
    if (submitBtn) { submitBtn.disabled = true; submitBtn.classList.add('is-loading'); submitLabel.textContent = 'Odesílám…'; }
    formNote.textContent = 'Odesílám…';

    const payload = {
      access_key: WEB3FORMS_ACCESS_KEY,
      subject: 'Nová poptávka z webu Autodoprava Vondrášek',
      from_name: 'Web Autodoprava Vondrášek, s.r.o.',
      'Jméno a příjmení': nameValue,
      'Telefon nebo e-mail': contactValue,
      'Trasa': routeValue,
      'Zpráva': messageValue
    };

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || 'Odeslání selhalo.');

      formNote.classList.add('success');
      formNote.textContent = 'Díky! Ozveme se vám co nejdříve na uvedený kontakt.';
      form.reset();
    } catch (err) {
      formNote.classList.add('error');
      formNote.textContent = 'Nepodařilo se odeslat poptávku. Zkuste to prosím znovu, nebo nám zavolejte na +420 731 484 581.';
    } finally {
      if (submitBtn) { submitBtn.disabled = false; submitBtn.classList.remove('is-loading'); submitLabel.textContent = originalBtnText; }
    }
  });
}
