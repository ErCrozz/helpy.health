# Helpy — Sito web

Landing page one-page per la startup **Helpy** — la piattaforma on-demand per
l'assistenza infermieristica a domicilio (Start Cup Lazio 2026).

## Contenuti

Il sito racconta:

- **Il problema** — invecchiamento, spesa privata in crescita, anziani esclusi
  dall'ADI pubblica, pronto soccorso saturi e rientri evitabili.
- **La soluzione** — la piattaforma B2B2C on-demand in 3 passaggi.
- **I servizi** — i 9 interventi infermieristici reali dell'app (con icone,
  colori e durate presi dal catalogo dell'app).
- **L'app** — semplicità, logistica di microzona, filtri, notifiche, tracciabilità.
- **Sicurezza & pagamenti** — pagamento in app protetto da Stripe.
- **Perché ora** — dimensione di mercato (TAM/SAM/SOM).
- **Team** e **call to action** per investitori/partner.

## Stack

Sito **statico**, zero build step:

- `index.html` — struttura e contenuti
- `styles.css` — design system (palette del logo + app, dark hero, bento grid, animazioni)
- `script.js` — scroll progress, reveal allo scroll, contatori animati, menu mobile, nav attiva
- `assets/` — logo e favicon (presi dall'app)

Dipendenze caricate da CDN: **Google Fonts** (Anton + Space Grotesk) e
**Ionicons** (stesse icone dell'app). Serve quindi connessione internet
al primo caricamento.

## Come avviarlo in locale

Basta aprire `index.html` nel browser. Per evitare problemi con i path
relativi, meglio servirlo con un piccolo web server:

```bash
# con Python
python -m http.server 5500

# oppure con Node
npx serve .
```

Poi visita `http://localhost:5500`.

## Deploy

È un sito statico: si pubblica ovunque trascinando la cartella.

- **Netlify / Vercel** — drag & drop della cartella `SitoHelpy`, oppure collega il repo.
- **GitHub Pages** — push su un repo e attiva Pages sulla root.

## Personalizzazione rapida

- **Colori**: tutte le variabili sono in cima a `styles.css` (`:root`).
  - `--blue` blu elettrico del logo · `--indigo`/`--violet` accenti del pitch · `--teal` primario dell'app.
- **Contenuti**: testi direttamente in `index.html`.
- **Servizi**: la griglia nella sezione `#servizi` rispecchia
  `lib/constants.ts` dell'app Helpy. Se aggiorni il catalogo nell'app,
  allinea qui icone/colori/durate.
- **Contatti**: email `helpyteam.info@gmail.com` (cerca `mailto:` nell'HTML).
