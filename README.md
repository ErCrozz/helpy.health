# Helpy — Sito web

Sito multipagina della startup **Helpy** — la piattaforma on-demand per
l'assistenza infermieristica a domicilio (Start Cup Lazio 2026).

## Pagine

| URL | File | Contenuto |
|---|---|---|
| `/` | `index.html` | Landing minimale: hero, marquee, i 3 passaggi, tre porte verso le altre pagine, CTA |
| `/chi-siamo` | `chi-siamo.html` | La storia, il problema, missione e visione, i 3 principi, chi c'è dietro, i traguardi, la roadmap delle microzone |
| `/app` | `app.html` | Le 9 prestazioni, per i pazienti, per gli infermieri, sicurezza e pagamenti, disponibilità |
| `/contatti` | `contatti.html` | Contatti diretti via email, blocchi infermieri/strutture, FAQ |

Netlify serve `nome.html` anche su `/nome`: i link interni usano quindi la
forma senza estensione.

## Stack

Sito **statico**, zero build step:

- `index.html`, `chi-siamo.html`, `app.html`, `contatti.html`, `privacy.html`
- `styles.css` — design system condiviso (palette del logo, dark hero, bento
  grid, animazioni) + blocco finale con i componenti delle pagine interne
- `script.js` — condiviso da tutte le pagine: scroll progress, reveal allo
  scroll, contatori animati, menu mobile, link di nav attivo, FAQ, invio del
  form via AJAX
- `assets/` — icone del brand generate da `nuovologo.jpg`

Dipendenze da CDN: **Google Fonts** (Anton + Space Grotesk) e **Ionicons**
(le stesse icone dell'app). Serve connessione internet al primo caricamento.

### Transizioni tra pagine

Le pagine sono file HTML separati, ma il passaggio è animato dalla
**View Transitions API** (`@view-transition { navigation: auto }` in
`styles.css`). Chrome, Edge e Safari animano; Firefox naviga normalmente
senza errori. Nav e footer restano fermi grazie a `view-transition-name`.

### Form contatti — rimosso fino al lancio

Il sito **non raccoglie dati**: la pagina contatti offre solo l'indirizzo
email. La scelta è deliberata e va insieme all'assenza della pagina privacy:
un form che raccoglie nome, email e telefono obbliga a pubblicare
un'informativa ai sensi dell'art. 13 GDPR, e quella si scrive al lancio,
insieme all'informativa dell'app (che tratta dati sanitari ed è la più
delicata). Finché non si raccoglie nulla, non c'è nulla da dichiarare.

**Per rimetterlo al lancio** servono tre cose:

1. il markup del form in `contatti.html`, con `id="contactForm"`,
   `name="contatti"`, `data-netlify="true"` e `netlify-honeypot="bot-field"`
   — si recupera dalla cronologia git di questo file;
2. la pagina `privacy.html` e il link nella checkbox di consenso — anch'essa
   nella cronologia git, con i riquadri `.todo` da compilare;
3. niente lato JS: il blocco che invia il form via `fetch` è rimasto in
   `script.js` ed è dormiente, si riattiva da solo appena trova l'elemento.

Netlify registra il form al deploy leggendo l'HTML; gli invii arrivano nel
pannello e via email (da configurare in *Site settings → Forms → Form
notifications*). Il piano Free include 100 invii al mese.

## Come avviarlo in locale

I link interni sono assoluti (`/chi-siamo`, `/styles.css`), quindi aprire i
file con doppio clic **non funziona**: serve un web server.

```bash
# Node — gestisce i clean URL come Netlify
npx serve .

# Python — funziona, ma le URL vanno scritte con .html
python -m http.server 5500
```

## Deploy

Sito statico: si pubblica ovunque trascinando la cartella.

- **Netlify** — drag & drop della cartella `SitoHelpy`, oppure collega il repo.
- **Vercel / GitHub Pages** — vanno bene finché non c'è il form; al lancio,
  su quelle piattaforme, servirebbe Formspree o un servizio equivalente.

## Personalizzazione rapida

- **Colori**: tutte le variabili sono in cima a `styles.css` (`:root`).
  - `--blue` blu del logo · `--indigo`/`--violet` accenti · `--teal` alias legacy = `--blue`.
- **Contenuti**: testi direttamente nei file HTML.
- **Servizi**: la griglia in `/app#servizi` rispecchia `lib/constants.ts`
  dell'app Helpy. Se aggiorni il catalogo nell'app, allinea qui
  icone/colori/durate.
- **Niente ripetizioni**: ogni contenuto sta su una pagina sola, e la home
  rimanda alle altre senza riassumerle. Prima di aggiungere un blocco alla
  home, controlla che non esista già altrove.
- **Nav e footer**: sono duplicati in ogni pagina. Se ne modifichi uno,
  allinea gli altri quattro.
- **Contatti**: email `helpyteam.info@gmail.com` (cerca `mailto:` nei file).
- **Logo/asset**: `netlify.toml` mette `max-age=31536000` su `/assets/*`. Se
  sostituisci un'immagine mantenendo lo stesso nome file, incrementa il `?v=`
  nei riferimenti, altrimenti i browser servono la versione in cache.

## Testi da rivedere

Non ci sono più riquadri `.todo` nelle pagine: il sito è pubblicabile così.
Restano però due cose scritte a tavolino, da correggere quando si hanno
dati veri:

- **Le sei FAQ in `/contatti`** sono dedotte dal business plan, non dalle
  domande che arrivano davvero. Quando iniziano ad arrivare messaggi,
  sostituire le domande immaginate con quelle reali.
- **Telefono, WhatsApp e social** non sono pubblicati: l'unico canale è
  l'email. Se si aprono profili della startup, vanno aggiunti fra le card
  della pagina contatti.

La regola `.todo` resta in fondo a `styles.css`: serve per marcare in modo
visibile i buchi durante le prossime revisioni.
