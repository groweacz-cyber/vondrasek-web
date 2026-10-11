# Vondrášek s.r.o. — web

Statický web (čisté HTML/CSS/JS, bez frameworku a bez buildu). Nasazeno na Vercel
(automaticky po push na `main`), kód na GitHubu, doména **autodoprava-vondrasek.eu**.

## Struktura projektu

```
/
├── index.html      → obsah stránky (hero, služby, vozový park, reference, nábor, kontakt)
├── styles.css      → veškerý styl (tmavé „liquid glass" téma, bento mřížka, animace) + @font-face
├── script.js       → menu, odhalování při scrollu, počítadla, galerie, formulář
├── vercel.json     → konfigurace nasazení (čisté URL, dlouhá cache fontů)
├── fonts/          → lokálně hostované fonty (Bricolage Grotesque + Geist, woff2)
└── images/         → fotky vozového parku (AVIF/WebP/JPEG), logo (tmavé i světlé), favicony
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
- [x] **Formulář — Web3Forms access key** — vložen v `script.js`
- [ ] **Formulář — příjemce poptávek** — poptávky zatím chodí na e-mail, na který byl
      formulář ve Web3Forms založen. Pro přepnutí na `favondrasek@email.cz` je nutné
      ho ve Web3Forms nejdřív ověřit (viz „Příjemce poptávek" níže).
- [ ] **Reference** — sekce je teď schovaná (`hidden`) → viz „Jak zapnout sekci
      Reference" níže, až budou k dispozici skutečné firmy.

## Jak zapnout sekci Reference

Sekce „Důvěřují nám" je teď schovaná (atribut `hidden`), protože obsahuje jen
neutrální placeholdery. Až budou k dispozici reálné firmy:

1. V `index.html` najdi `<section class="trust-strip" id="reference" hidden>` a smaž `hidden`.
2. O pár řádků výš (v hlavní navigaci) a v patičce (`footer-col` „Rychlé odkazy") najdi
   `<a href="#reference" hidden>Reference</a>` (jsou tam dva) a smaž `hidden` i u nich.
3. V sekci nahraď `.ref-chip` placeholdery (`Výrobní firma · Brno` apod.) skutečnými
   názvy firem a smaž poznámku `.ref-note` („Reference budou doplněny…").

## Kontaktní formulář (Web3Forms)

Formulář v `#kontakt` je napojený na [Web3Forms](https://web3forms.com) — zdarma, bez
vlastního backendu. Access Key je vložený v `script.js` (konstanta
`WEB3FORMS_ACCESS_KEY`); je určený pro veřejný klientský kód, takže ho v repozitáři
být může.

### Příjemce poptávek

Poptávky chodí na e-mail, který je ve Web3Forms u tohoto formuláře nastavený. Změna:

1. Na https://app.web3forms.com otevři nastavení formuláře.
2. Přidej e-mail **favondrasek@email.cz** — Web3Forms na něj pošle ověřovací zprávu,
   kterou je potřeba potvrdit (schránka je na Seznamu: email.cz).
3. Po ověření ho v nastavení formuláře vyber jako příjemce.
4. Pošli z webu zkušební poptávku a ověř, že dorazila.

Formulář má i skryté pole `botcheck` (honeypot proti spamu) — nic s ním dělat nemusíš,
funguje automaticky.

## Design a technické poznámky

**Vzhled.** Tmavé téma s „liquid glass" prvky (průsvitné karty a plovoucí navigace),
bento mřížka služeb, horizontální galerie vozového parku (scroll-snap), jemné animace
(aurora v pozadí, odhalování při scrollu, počítadla, náklon fotky v heru).

**Fonty.** Nadpisy Bricolage Grotesque, text Geist — oba pod licencí SIL OFL, uložené
lokálně ve `fonts/` (latin + latin-ext, kvůli české diakritice jsou potřeba oba soubory).
Web tak nevolá žádné cizí servery (rychlejší načtení, žádné starosti s GDPR u Google Fonts).

**Barvy** jsou CSS proměnné na začátku `styles.css` (`:root { --violet; --blue; --cyan;
--red; --bg-0 … }`), zapsané v `oklch()`. Změna identity je otázka pár řádků. Červená
`--red` vychází z loga a používá se jen střídmě (oddělovače ve „stuze" služeb, štítek Nábor).

**Logo.** `images/logo.png` je původní (tmavě modré písmo) a `images/logo-light.png` je jeho
„reverzní" varianta pro tmavé pozadí (modrá → téměř bílá, červená zachovaná). Na webu se
používá `logo-light.png`.

**Obrázky.** Každá fotka existuje v AVIF, WebP a JPEG a ve dvou šířkách
(hero `-800` / `-1280`, galerie `-700` / `-1200`); prohlížeč si vybere nejlepší formát
přes `<picture>`. Při výměně fotky je potřeba vyměnit všechny varianty se stejnými názvy,
jinak by prohlížeče dál ukazovaly starou fotku z AVIF/WebP (např. přes squoosh.app: AVIF
kvalita ≈ 50, WebP ≈ 75, JPEG jako záloha).

**Nová fotka do galerie.** V `index.html` zkopíruj jeden blok
`<figure class="rail-card">…</figure>` v sekci `#flotila`, změň názvy souborů, `alt`
a popisek; číslo v `.idx` je jen pořadí.

**Přístupnost a preference.** Web respektuje `prefers-reduced-motion` (animace se
vypnou, vše je hned vidět), funguje i bez JavaScriptu (obsah se neschovává) a má
odkaz „Přeskočit na obsah", správné ARIA role a kontrasty splňující WCAG AA.

**Prohlížeče.** Využívá moderní CSS (oklch, container queries, scroll-driven animace,
`@property`). Novější funkce jsou řešené jako vylepšení navíc — ve starších prohlížečích
se jen nezobrazí efekty, obsah a ovládání zůstávají funkční.

## Poznámky k údržbě

- Web je čistě statický — žádná databáze, žádný CMS. Úpravy textu se dělají přímo
  v `index.html`.
- Pokud by do budoucna bylo potřeba web spravovat bez zásahu do kódu (Jarda by si
  chtěl sám měnit texty), lze zvážit napojení na headless CMS nebo přechod na
  jednoduchý framework — to je ale nad rámec základní verze.

---
Web & marketing: **Growea** · growea.eu
