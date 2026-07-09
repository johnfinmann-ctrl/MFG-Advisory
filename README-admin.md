# MFG Advisory — Adminpanel

Denne mappe indeholder et komplet, letvægts admin-CMS oven på den statiske
MFG Advisory-hjemmeside. Det ændrer intet ved det offentlige design — det
tilføjer kun et redigeringslag ovenpå.

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

## Sådan aktiverer du Supabase (delt lagring på tværs af enheder)

1. Opret et gratis projekt på https://supabase.com
2. Gå til **SQL Editor** og kør hele indholdet af `supabase/schema.sql`
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

## Hvad kan redigeres

- **Alt tekstindhold** på alle 8 sider (overskrifter, brødtekst, knapper,
  udfordringer, løsninger, case-indhold, indsigter)
- **Billeder** — Mortens portræt (Om Morten + Kontakt-siden), med
  filupload direkte i adminpanelet
- **Kontaktoplysninger** — telefon, e-mail, CVR, LinkedIn-link (ét sted,
  bruges automatisk alle steder på siden, inkl. `tel:`/`mailto:`-links)
- **SEO-data** — titel og meta-beskrivelse for hver enkelt side, samlet
  i én oversigt
- **CTA-knapper** — teksten på alle "Book en samtale"-knapper m.fl.
- **Cases** — hver retning (Mennesker/Ledelse/Kultur/Forretning) har
  præcis én case i det nuværende design; alle felter i den case
  (titel, situation, retning, løsning, resultat, note) kan redigeres
  under den pågældende retnings-sektion i adminpanelet
- **Testimonials** — kan oprettes, redigeres og slettes i adminpanelet,
  og gemmes i samme lager som alt andet. **De vises endnu ikke på
  hjemmesiden**, fordi det nuværende design ikke har en testimonial-sektion.
  At tilføje den visuelt er en designændring, som ikke er lavet automatisk
  her — sig til, hvis du ønsker det.

## Hvordan det virker teknisk (til fremtidig CMS-udvidelse)

- Alle 8 sider har `data-edit="..."`-attributter direkte i HTML'en.
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
  designede tekst — siden går aldrig i stykker.

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
- Billeder gemt uden Supabase Storage (dvs. i ren LocalStorage-tilstand)
  gemmes som base64 direkte i den samme JSON-blob som alt andet tekst-
  indhold. Det virker fint til nogle få billeder, men er ikke en
  langsigtet løsning for mange/store billeder — actives Supabase Storage,
  hvis det bliver behov for det (sker automatisk, når Supabase er sat op).
