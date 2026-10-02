# Vondrášek s.r.o. — web

Statický web (čisté HTML/CSS/JS, bez frameworku a bez buildu). Nasazeno na Vercel
(automaticky po push na `main`), kód na GitHubu, doména **autodoprava-vondrasek.eu**.

## Struktura projektu

```
/
├── index.html      → obsah stránky (hero, služby, vozový park, reference, nábor, kontakt)
├── styles.css      → veškerý styl (dark + purple/blue gradient, Growea identita)
├── script.js       → mobilní menu, formulář, drobné interakce
├── vercel.json     → konfigurace nasazení (čisté URL)
└── images/         → reálné fotky vozového parku, logo, favicon
```

## 1. Nahrání na GitHub

```bash
cd vondrasek-web
git init
git add .
git commit -m "Základní web Vondrášek s.r.o."
git branch -M main
git remote add origin https://github.com/<tvuj-ucet>/vondrasek-web.git
git push -u origin main
```

Pokud repozitář na GitHubu ještě neexistuje, založ ho nejdřív na github.com/new
(stačí prázdný, bez README).

## 2. Nasazení na Vercel

1. Přihlas se na vercel.com (jde i přes GitHub účet).
2. „Add New… → Project" → vyber repozitář `vondrasek-web`.
3. Framework Preset nech na **Other** (je to čistý statický web, žádný build krok není potřeba).
4. Klikni **Deploy**. Za pár vteřin dostaneš dočasnou adresu typu `vondrasek-web.vercel.app`.

Každý další `git push` na `main` automaticky přenasadí novou verzi.

## 3. Napojení domény z Forpsi

**Ve Vercelu:**
1. V projektu jdi do **Settings → Domains**.
2. Zadej doménu `autodoprava-vondrasek.eu` a potvrď.
3. Vercel ti ukáže, jaké DNS záznamy potřebuješ nastavit (typicky A záznam pro
   holou doménu a CNAME pro `www`).

**Ve Forpsi (správa domény):**
1. Přihlas se do administrace Forpsi → sekce **DNS správa** dané domény.
2. Nastav záznamy přesně podle toho, co ukázal Vercel. Obvykle:
   - `A` záznam: `@` → `76.76.21.21` (IP adresu vždy ověř v aktuálním zobrazení Vercelu, může se lišit)
   - `CNAME` záznam: `www` → `cname.vercel-dns.com`
3. Ulož, DNS změny se projeví od pár minut do 24 hodin.
4. Vercel doménu automaticky ověří a vydá SSL certifikát (https) zdarma.

## Co je potřeba doplnit (placeholder obsah)

- [x] **Telefon a e-mail** — `+420 731 484 581` / `favondrasek@email.cz`
- [x] **Firemní údaje** — Autodoprava Vondrášek, s.r.o. · Jakubská 189, 377 01 Jindřichův Hradec · IČ 28112776
- [x] **Fotky** — logo, kamion v hero a 4 vozidla v galerii „Náš vozový park" (`images/`)
- [x] **Doména** — `autodoprava-vondrasek.eu`
- [ ] **Reference** — teď neutrální placeholdery ("Výrobní firma · Brno") → doplnit
      skutečné firmy, se kterými Jarda smí být spojován
- [ ] **Formulář** — teď jen simuluje odeslání (viz `script.js`). Potřebuje napojit
      na skutečné odeslání e-mailu — nejjednodušší je služba jako Formspree, Web3Forms,
      nebo vlastní jednoduchý endpoint (např. Vercel Serverless Function).

## Poznámky k údržbě

- Web je čistě statický — žádná databáze, žádný CMS. Úpravy textu se dělají přímo
  v `index.html`.
- Pokud by do budoucna bylo potřeba web spravovat bez zásahu do kódu (Jarda by si
  chtěl sám měnit texty), lze zvážit napojení na headless CMS nebo přechod na
  jednoduchý framework — to je ale nad rámec základní verze.
- Barvy a styl jsou definované jako CSS proměnné na začátku `styles.css`
  (`:root { --purple: ...; --blue: ...; }`) — změna identity je otázka pár řádků.

---
Web & marketing: **Growea** · growea.eu
