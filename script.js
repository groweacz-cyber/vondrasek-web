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

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn ? submitBtn.textContent : '';
    if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Odesílám…'; }
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
      if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = originalBtnText; }
    }
  });
}
