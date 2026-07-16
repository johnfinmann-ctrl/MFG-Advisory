# MFG Advisory — Adminpanel

Denne mappe indeholder et komplet, letvægts admin-CMS oven på den statiske
MFG Advisory-hjemmeside. Det ændrer intet ved det offentlige design — det
tilføjer kun et redigeringslag ovenpå.

## RC6 — hvad er nyt

- **The MFG Compass™ er nu det officielle billede** (`assets/images/mfg-compass-original.jpg`),
  brugt pixelkorrekt — ikke en selvbygget SVG-fortolkning længere. Fire
  usynlige, tilgængelige klikområder ligger ovenpå grafikken (Mennesker,
  Ledelse, Kultur, Forretning), med en diskret guldglød ved hover/fokus.
  Billedet skalerer responsivt og beskæres aldrig — heller ikke på mobil.
- **Forsiden er nu kort**: Navigation → Compass → Hero-tekst → én CTA →
  footer. Cases, Om Morten, Kontakt og den tidligere "fire retninger"-sektion
  er fjernet fra forsiden, da de allerede har egne sider.
- **Løsningskortene på de fire retningssider er nu levende accordions**:
  klik "Læs mere" for at folde kortet ud og se lang beskrivelse, typiske
  udfordringer, MFG's tilgang, forventede resultater, relateret case og en
  CTA. Admin kan oprette helt nye løsningskort uden kode (se nedenfor).
- **Cases åbner nu en fuld case-visning** i en modal ved klik — med billede,
  branche, kunde (hvis ikke skjult), retning(er), udfordring/løsning/resultat
  og CTA. Lukkes med luk-knap, klik udenfor, eller Escape.
- **Admin/CMS** har fået en ny sektion **løsningskort** under hver retning
  (Mennesker/Ledelse/Kultur/Forretning), hvor Morten selv kan oprette,
  redigere, skjule/vise og vælge visning (accordion eller link) for både
  de faste og nye løsningskort.
- **The MFG Compass™** i CMS-menuen er nu en ren info-side (grafikken
  redigeres ikke via tekstfelter, men ved at udskifte selve billedfilen).

## Sådan opdaterer du selve Compass-grafikken

Compass-billedet er en fast fil: `assets/images/mfg-compass-original.jpg`.
For at opdatere det:
1. Udskift filen med en ny version i samme billedformat og -forhold.
2. De fire klikområders placering er procent-baseret i `assets/css/style.css`
   under `.hotspot-mennesker`, `.hotspot-ledelse`, `.hotspot-kultur`,
   `.hotspot-forretning` — juster disse manuelt, hvis en ny grafik har andre
   tekstplaceringer.

## Løsningskort — sådan virker det

Hver af de fire retningssider har to faste løsningskort (allerede tilpasset
med alle ni felter: titel, teaser, lang beskrivelse, udfordringer, tilgang,
resultater, relateret case og CTA). Under hver retning i adminpanelet kan
Morten desuden **tilføje flere løsningskort uden kode** — de vises automatisk
nederst på siden, medmindre de sættes til "skjult" (Publiceret-fluebenet).
Hvert kort kan vises som en foldbar accordion (standard) eller som et rent
link, der sender direkte til CTA-linket.

## Sådan kommer du i gang (0 opsætning)

1. Åbn `admin.html` i browseren (lokalt eller via GitHub Pages).
2. Log ind med standardkoden: **mfg2026**
3. Skift straks koden under **Indstillinger → Skift admin-kode**.
4. Rediger, og tryk **"Gem ændringer"** i den sektion, du har rettet i.
5. Genindlæs en offentlig side (fx `index.html`) — ændringen er der.

Uden yderligere opsætning gemmes alt i browserens **LocalStorage**. Det
virker med det samme, men ændringer er kun synlige i den browser/enhed,
hvor de blev gemt — hvis du redigerer fra din bærbare, ser andre enheder
(eller en anden browser) ikke ændringen, medmindre du sætter Supabase op
(se nedenfor).

## Adminpanelets menu

**Dashboard** · **Forside** · **The MFG Compass™** · **Mennesker** ·
**Ledelse** · **Kultur** · **Forretning** · **Cases** · **Testimonials** ·
**Om Morten** · **Kontakt** · **SEO** · **Analytics** · **Cookiebanner** ·
**Indstillinger**

- **Mennesker/Ledelse/Kultur/Forretning** indeholder nu både de faste
  tekstfelter og en fuld løsningskort-manager (se ovenfor).
- **Cases** og **Testimonials** har fuld opret/redigér/slet-funktion uden
  kode. Cases: titel, branche, kunde (kan skjules), udfordring, løsning,
  resultat, billede, PDF, galleri, primær og sekundær Compass-retning,
  CTA-tekst og -link. Testimonials: navn, titel, firma, citat, foto, logo,
  Compass-retning. Cases åbner nu i en fuld modal-visning ved klik.
- **Kontakt** indeholder både sidens egne tekster og de globale
  kontaktoplysninger (telefon, e-mail, CVR, LinkedIn, adresse).
- **Om Morten** har separate, redigerbare lister for **Kompetencer** og
  **Certificeringer**.

## Sådan aktiverer du Supabase (delt lagring på tværs af enheder)

1. Opret et gratis projekt på https://supabase.com
2. Gå til **SQL Editor** og kør hele indholdet af `supabase/schema.sql`
   (opretter tabellen `content`, alle RLS-policies, og storage-bucketten
   `mfg-media` med sine egne policies).
3. Gå til **Project Settings → API** og kopiér:
   - Project URL
   - "anon public" nøglen
4. Indsæt dem i `assets/js/supabase-config.js`:
   ```js
   window.MFG_SUPABASE_URL = 'https://dit-projekt.supabase.co';
   window.MFG_SUPABASE_ANON_KEY = 'din-anon-nøgle';
   ```
5. Upload den opdaterede fil til GitHub Pages. Adminpanelet skifter
   automatisk til Supabase — det står i den grå boks øverst i adminpanelet
   ("Supabase" / "LocalStorage").

Alt, der allerede er gemt i LocalStorage, følger ikke automatisk med til
Supabase — brug **Indstillinger → Eksportér JSON** før du skifter, og
**Importér JSON** bagefter, hvis du vil overføre det.

## Kontaktformular → rigtig mailservice (Formspree / Resend)

Formularen virker ud af boksen med en mailto-fallback (åbner en forudfyldt
mail). For at sende rigtige mails uden mailto:

1. Opret en formular på https://formspree.io (eller et Resend-endpoint).
2. Kopiér endpoint-URL'en (fx `https://formspree.io/f/xxxxabcd`).
3. Gå til **Admin → Indstillinger → Kontaktformular — mailservice-endpoint**
   og indsæt den. Tryk **"Gem endpoint"**.
4. Formularen sender nu direkte til den service — mailto bruges kun som
   fallback, hvis kaldet skulde fejle.

Feltet er tomt som standard, og der er ingen hårdkodede API-nøgler nogen
steder i koden — indtil du udfylder det, virker formularen præcis som før
(mailto).

## Analytics (Plausible eller Google Analytics)

Ingen tracking er aktiveret som standard, og der er ikke indsat noget
tracking-ID nogen steder i koden. For at slå det til:

1. Gå til **Admin → Analytics**.
2. Vælg udbyder (Plausible eller Google Analytics).
3. Indsæt dit Site-ID (Plausible, fx `mfgadvisory.dk`) eller
   Measurement-ID (Google Analytics, fx `G-XXXXXXX`).
4. Tryk **"Gem analytics-indstillinger"**.

Scriptet indlæses **kun**, hvis en besøgende aktivt har klikket
"Accepter alle" i cookiebanneret — vælger de "Kun nødvendige", indlæses
intet analytics-script overhovedet.

## Cookiebanner

Vises automatisk ved første besøg, med to valg: **"Kun nødvendige"** og
**"Accepter alle"**. Valget gemmes i browserens LocalStorage
(`mfg_cookie_consent`), så banneret ikke vises igen ved senere besøg.
Kun ved "Accepter alle" indlæses et evt. konfigureret analytics-script.
Status og en kort forklaring findes under **Admin → Cookiebanner**.

## Favicon

Udskiftes direkte fra **Admin → Indstillinger → Favicon** — upload et
billede, og det opdateres på alle sider med det samme (kræver at siden
køres over http/https, ikke ved at åbne filen direkte). Standard-faviconen
matcher det eksisterende MFG-monogram fra headeren.

## 404-side

`404.html` ligger i samme mappe som `index.html` og bruger nøjagtig samme
header/footer/typografi som resten af sitet. På GitHub Pages vises den
automatisk for alle ugyldige URL'er uden yderligere opsætning.

## Hvad kan redigeres

- **Alt tekstindhold** på alle sider (overskrifter, brødtekst, knapper,
  udfordringer, løsninger, case-indhold)
- **Løsningskort** — alle ni felter pr. kort, plus opret/skjul/vis-som
- **Billeder** — Mortens portræt (bruges konsekvent på Om Morten og
  Kontakt), med filupload direkte i adminpanelet
- **Kontaktoplysninger** — telefon, e-mail, CVR, adresse, LinkedIn-link
  (ét sted, bruges automatisk alle steder på siden, inkl. `tel:`/`mailto:`)
- **SEO-data** — titel og meta-beskrivelse for hver enkelt side
- **CTA-knapper** — teksten på alle "Book en samtale"-knapper m.fl.
- **Cases og Testimonials** — fuld opret/redigér/slet uden kode (se ovenfor)
- **Kompetencer og Certificeringer** — frie, redigerbare lister på Om Morten
- **Favicon** — direkte upload

## Hvordan det virker teknisk (til fremtidig CMS-udvidelse)

- Alle sider har `data-edit="..."`-attributter direkte i HTML'en.
  Disse er bevaret 1:1 og er selve fundamentet — adminpanelet **læser
  dem dynamisk** fra de rigtige sidefiler i stedet for at have en
  hårdkodet, dobbelt liste et andet sted. Tilføjer du et nyt
  `data-edit`-felt i en side, dukker det automatisk op i adminpanelet.
- `assets/js/content-store.js` er det eneste sted, der taler med
  Supabase/LocalStorage. Skal I engang skifte til et rigtigt CMS eller en
  anden backend, er det denne ene fil, der skal udskiftes — resten af
  koden (både de offentlige sider og adminpanelet) er uafhængig af,
  hvor data faktisk gemmes.
- `assets/js/content-loader.js` kører på de offentlige sider og
  overskriver kun de elementer, hvor der findes en gemt ændring. Uden
  gemte ændringer (eller hvis JavaScript fejler) vises den originale,
  designede tekst — siden går aldrig i stykker. Den samme fil renderer nu
  også løsningskort, cases (inkl. galleri/PDF/kunde-visning og fuld
  modal-visning), Testimonials (inkl. logo) og Om Mortens
  kompetence-/certificeringslister dynamisk, når data findes.

## Vigtige begrænsninger (vær ærlig om dette)

- **Adminkoden er klient-side beskyttelse, ikke rigtig autentifikation.**
  Der er ingen server, der kan håndhæve adgang — koden forhindrer
  tilfældige besøgende i at åbne redigeringspanelet, men er ikke
  bank-niveau-sikkerhed. Brug ikke følsomme oplysninger i indholdet.
- Hvis Supabase er sat op, er `anon`-nøglen synlig i browserens kildekode
  (det er sådan Supabase's klient-side-model virker uden en selvstændig
  backend). Databasepolitikkerne i `supabase/schema.sql` tillader derfor
  læsning/skrivning med den nøgle. Har I brug for skarpere adgangskontrol
  senere, er næste skridt Supabase Auth (rigtigt login) — det er ikke
  bygget her, men arkitekturen er klar til at blive udvidet med det.
- Billeder, PDF'er og galleri-filer gemt uden Supabase Storage (dvs. i
  ren LocalStorage-tilstand) gemmes som base64 direkte i den samme
  JSON-blob som alt andet tekstindhold. Det virker fint til nogle få
  filer, men er ikke en langsigtet løsning for mange/store filer —
  aktiveres Supabase Storage automatisk, når Supabase er sat op.


1. Åbn `admin.html` i browseren (lokalt eller via GitHub Pages).
2. Log ind med standardkoden: **mfg2026**
3. Skift straks koden under **Indstillinger → Skift admin-kode**.
4. Rediger, og tryk **"Gem ændringer"** i den sektion, du har rettet i.
5. Genindlæs en offentlig side (fx `index.html`) — ændringen er der.

Uden yderligere opsætning gemmes alt i browserens **LocalStorage**. Det
virker med det samme, men ændringer er kun synlige i den browser/enhed,
hvor de blev gemt — hvis du redigerer fra din bærbare, ser andre enheder
(eller en anden browser) ikke ændringen, medmindre du sætter Supabase op
(se nedenfor).

## Adminpanelets menu

**Dashboard** · **Forside** · **The MFG Compass™** · **Mennesker** ·
**Ledelse** · **Kultur** · **Forretning** · **Cases** · **Testimonials** ·
**Om Morten** · **Kontakt** · **SEO** · **Analytics** · **Cookiebanner** ·
**Indstillinger**

- **The MFG Compass™** samler Compass-titel/intro og de fire retningers
  korte forsidetekster ét sted (adskilt fra Forsidens hero-tekst).
- **Cases** og **Testimonials** har fuld opret/redigér/slet-funktion uden
  kode. Cases: titel, branche, kunde (kan skjules), udfordring, løsning,
  resultat, billede, PDF, galleri, primær og sekundær Compass-retning.
  Testimonials: navn, titel, firma, citat, foto, logo, Compass-retning.
  Begge vises automatisk nederst på Cases-siden, så snart mindst én er
  oprettet.
- **Kontakt** indeholder nu både sidens egne tekster OG de globale
  kontaktoplysninger (telefon, e-mail, CVR, LinkedIn, adresse), som
  automatisk bruges alle steder på hjemmesiden.
- **Om Morten** har separate, redigerbare lister for **Kompetencer** og
  **Certificeringer** (tilføj/fjern linjer frit).

## Sådan aktiverer du Supabase (delt lagring på tværs af enheder)

1. Opret et gratis projekt på https://supabase.com
2. Gå til **SQL Editor** og kør hele indholdet af `supabase/schema.sql`
   (opretter tabellen `content`, alle RLS-policies, og storage-bucketten
   `mfg-media` med sine egne policies).
3. Gå til **Project Settings → API** og kopiér:
   - Project URL
   - "anon public" nøglen
4. Indsæt dem i `assets/js/supabase-config.js`:
   ```js
   window.MFG_SUPABASE_URL = 'https://dit-projekt.supabase.co';
   window.MFG_SUPABASE_ANON_KEY = 'din-anon-nøgle';
   ```
5. Upload den opdaterede fil til GitHub Pages. Adminpanelet skifter
   automatisk til Supabase — det står i den grå boks øverst i adminpanelet
   ("Supabase" / "LocalStorage").

Alt, der allerede er gemt i LocalStorage, følger ikke automatisk med til
Supabase — brug **Indstillinger → Eksportér JSON** før du skifter, og
**Importér JSON** bagefter, hvis du vil overføre det.

## Kontaktformular → rigtig mailservice (Formspree / Resend)

Formularen virker ud af boksen med en mailto-fallback (åbner en forudfyldt
mail). For at sende rigtige mails uden mailto:

1. Opret en formular på https://formspree.io (eller et Resend-endpoint).
2. Kopiér endpoint-URL'en (fx `https://formspree.io/f/xxxxabcd`).
3. Gå til **Admin → Indstillinger → Kontaktformular — mailservice-endpoint**
   og indsæt den. Tryk **"Gem endpoint"**.
4. Formularen sender nu direkte til den service — mailto bruges kun som
   fallback, hvis kaldet skulde fejle.

Feltet er tomt som standard, og der er ingen hårdkodede API-nøgler nogen
steder i koden — indtil du udfylder det, virker formularen præcis som før
(mailto).

## Analytics (Plausible eller Google Analytics)

Ingen tracking er aktiveret som standard, og der er ikke indsat noget
tracking-ID nogen steder i koden. For at slå det til:

1. Gå til **Admin → Analytics**.
2. Vælg udbyder (Plausible eller Google Analytics).
3. Indsæt dit Site-ID (Plausible, fx `mfgadvisory.dk`) eller
   Measurement-ID (Google Analytics, fx `G-XXXXXXX`).
4. Tryk **"Gem analytics-indstillinger"**.

Scriptet indlæses **kun**, hvis en besøgende aktivt har klikket
"Accepter alle" i cookiebanneret — vælger de "Kun nødvendige", indlæses
intet analytics-script overhovedet.

## Cookiebanner

Vises automatisk ved første besøg, med to valg: **"Kun nødvendige"** og
**"Accepter alle"**. Valget gemmes i browserens LocalStorage
(`mfg_cookie_consent`), så banneret ikke vises igen ved senere besøg.
Kun ved "Accepter alle" indlæses et evt. konfigureret analytics-script.
Status og en kort forklaring findes under **Admin → Cookiebanner**.

## Favicon

Udskiftes direkte fra **Admin → Indstillinger → Favicon** — upload et
billede, og det opdateres på alle sider med det samme (kræver at siden
køres over http/https, ikke ved at åbne filen direkte). Standard-faviconen
matcher det eksisterende MFG-monogram fra headeren.

## 404-side

`404.html` ligger i samme mappe som `index.html` og bruger nøjagtig samme
header/footer/typografi som resten af sitet. På GitHub Pages vises den
automatisk for alle ugyldige URL'er uden yderligere opsætning.

## Hvad kan redigeres

- **Alt tekstindhold** på alle sider (overskrifter, brødtekst, knapper,
  udfordringer, løsninger, case-indhold, indsigter)
- **Billeder** — Mortens portræt (bruges konsekvent på Forside, Om Morten
  og Kontakt), med filupload direkte i adminpanelet
- **Kontaktoplysninger** — telefon, e-mail, CVR, adresse, LinkedIn-link
  (ét sted, bruges automatisk alle steder på siden, inkl. `tel:`/`mailto:`)
- **SEO-data** — titel og meta-beskrivelse for hver enkelt side
- **CTA-knapper** — teksten på alle "Book en samtale"-knapper m.fl.
- **Cases og Testimonials** — fuld opret/redigér/slet uden kode (se ovenfor)
- **Kompetencer og Certificeringer** — frie, redigerbare lister på Om Morten
- **Favicon** — direkte upload, se ovenfor

## Hvordan det virker teknisk (til fremtidig CMS-udvidelse)

- Alle sider har `data-edit="..."`-attributter direkte i HTML'en.
  Disse er bevaret 1:1 og er selve fundamentet — adminpanelet **læser
  dem dynamisk** fra de rigtige sidefiler i stedet for at have en
  hårdkodet, dobbelt liste et andet sted. Tilføjer du et nyt
  `data-edit`-felt i en side, dukker det automatisk op i adminpanelet.
- `assets/js/content-store.js` er det eneste sted, der taler med
  Supabase/LocalStorage. Skal I engang skifte til et rigtigt CMS eller en
  anden backend, er det denne ene fil, der skal udskiftes — resten af
  koden (både de offentlige sider og adminpanelet) er uafhængig af,
  hvor data faktisk gemmes.
- `assets/js/content-loader.js` kører på de offentlige sider og
  overskriver kun de elementer, hvor der findes en gemt ændring. Uden
  gemte ændringer (eller hvis JavaScript fejler) vises den originale,
  designede tekst — siden går aldrig i stykker. Den samme fil renderer nu
  også Cases (inkl. galleri/PDF/kunde-visning), Testimonials (inkl. logo)
  og Om Mortens kompetence-/certificeringslister dynamisk, når data findes.

## Vigtige begrænsninger (vær ærlig om dette)

- **Adminkoden er klient-side beskyttelse, ikke rigtig autentifikation.**
  Der er ingen server, der kan håndhæve adgang — koden forhindrer
  tilfældige besøgende i at åbne redigeringspanelet, men er ikke
  bank-niveau-sikkerhed. Brug ikke følsomme oplysninger i indholdet.
- Hvis Supabase er sat op, er `anon`-nøglen synlig i browserens kildekode
  (det er sådan Supabase's klient-side-model virker uden en selvstændig
  backend). Databasepolitikkerne i `supabase/schema.sql` tillader derfor
  læsning/skrivning med den nøgle. Har I brug for skarpere adgangskontrol
  senere, er næste skridt Supabase Auth (rigtigt login) — det er ikke
  bygget her, men arkitekturen er klar til at blive udvidet med det.
- Billeder, PDF'er og galleri-filer gemt uden Supabase Storage (dvs. i
  ren LocalStorage-tilstand) gemmes som base64 direkte i den samme
  JSON-blob som alt andet tekstindhold. Det virker fint til nogle få
  filer, men er ikke en langsigtet løsning for mange/store filer —
  aktiveres Supabase Storage automatisk, når Supabase er sat op.
- **Kompasset og MFG Icon Library**: der var ikke vedhæftet et
  referencebillede (Compass-plakaten) eller en officiel ikonfil til denne
  sprint. Kompasset er derfor videreudviklet på den eksisterende,
  selvbyggede navy/guld/creme-kompasrose (nu med fremhævede "arme" ved
  hover og en bundtekst-caption), og ikonerne er fortsat det tidligere
  byggede, konsistente SVG-linjeikonsæt. Send referencematerialet, så
  tilpasses begge dele pixelnært.


