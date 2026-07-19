# MFG Advisory — Adminpanel

Denne mappe indeholder et komplet, letvægts admin-CMS oven på den statiske
MFG Advisory-hjemmeside. Det ændrer intet ved det offentlige design — det
tilføjer kun et redigeringslag ovenpå.

## RC7.2 — bugfix: overlap i mobilmenuen

Skærmbilleder fra en rigtig iPhone viste, at "Book en strategisk samtale"
og telefonnummeret lå **oven på** navigationslinkene i den åbne mobilmenu
(bl.a. dækkede det "Ledelse"-linket delvist). Årsagen var, at både
navigationslisten og CTA/telefon-blokken ved en fejl begge var sat til
`position:absolute` på nøjagtig samme sted i CSS'en, så de blev lagt oven
i hinanden i stedet for at stå i forlængelse af hinanden.

Rettet ved at lade begge blokke indgå i headerens almindelige (men stadig
fastgjorte) layout-flow i stedet for at blive taget ud af flowet med
`position:absolute` — nu stakker de korrekt: navigationslinks først,
CTA-knap og telefonnummer nederst, uden nogen overlap. Verificeret med
automatiske positions-tjek (ingen link overlapper CTA/telefon-boksen) samt
fuld regressionstest på 375/390/430/820/1440px.

## RC7.1 (Final Polish) — changelog

1. **Mobilmenu**: Vurderede den skjulte vandrette navigation — hamburger-
   løsningen er bevaret, men strammet op: alle 8 menupunkter ligger i
   menuen, aktiv side markeres, menuen lukker automatisk ved valg af
   menupunkt *og* ved klik udenfor, baggrundens scroll låses, mens menuen
   er åben, og der er ingen horisontal scroll. CTA-knappen hedder nu
   **"Book en strategisk samtale"** og er redigerbar i CMS'et
   (Admin → Kontakt). Derudover er der tilføjet en lille, altid synlig
   **"Book"**-genvej ved siden af hamburger-ikonet på mobil.
2. **Header/topafstand**: Luften under headeren er øget og samlet i
   præcis to CSS-variabler (`--header-clearance` for desktop/tablet,
   `--header-clearance-mobile` for mobil) — én fælles kilde for alle sider.
3. **Portræt**: Om Morten-siden og kontaktsidens mini-visitkort peger nu
   på **samme** CMS-nøgle (`om-portrait-img`) — én upload opdaterer begge
   steder. Portrættet er desuden gjort lidt større på mobil (max-bredde
   340px mod 300px på desktop).
4. **Kontakt**: Den tekniske sætning om "backend/mailservice" er fjernet
   og erstattet med en professionel kundetekst.
5. **Footer**: "CVR: tilføjes ved registrering" er fjernet. CVR-feltet er
   nu skjult som standard og vises kun automatisk, hvis et rigtigt CVR-
   nummer indtastes via CMS'et. "Bygget af Nordic Operations" er nu et
   rigtigt klikbart link (åbner i ny fane).
6. **Visuel finish**: Bekræftet at kontaktkortene allerede deler samme
   klasse (ens radius/skygge/padding), og at ingen elementer ligger under
   headeren på nogen side.
7. **Kvalitetssikring**: Fuld regressionstest kørt på desktop (1440px),
   tablet (820px) og mobil (375/390/430px) — ingen horisontal scroll,
   intet overlap, ingen beskæring, alle links, kontaktformular, navigation,
   compass og CMS bekræftet fungerende uændret.

## RC7.1 — det rigtige portræt er nu indsat

- **Mortens officielle portræt er nu på plads** (`assets/images/morten-portrait.jpg`)
  og har erstattet den navy/guld-pladsholder, RC7 brugte midlertidigt.
  Bruges konsekvent på Om Morten-siden, kontaktsidens mini-visitkort og som
  standardbillede i CMS'et (Admin → Om Morten / Admin → Kontakt).
- **Ingen beskæring af hoved eller skuldre.** Portrættets container på
  Om Morten-siden er justeret til at matche billedets egne proportioner
  præcist (i stedet for et fast 4:5-forhold), så hele billedet altid vises
  — testet på både mobil og desktop uden beskæring eller forvrængning.
- Den lille runde kontaktside-avatar (76×76 px) beskærer kun tomt
  baggrundsrum foroven/forneden — hoved og skuldre er fuldt synlige, hvilket
  er verificeret ved simulering af det faktiske beskæringsområde før levering.
- **Genbekræftet fra RC7** (uændret, men verificeret igen i denne runde):
  header-afstand på alle sider (ingen overlap ved 375/390/430px), og
  telefonnummer-format (`+45 60 52 89 00` / `tel:+4560528900`) alle steder.

## RC7 — hvad er nyt (Final Polish)

- **Portræt fjernet og erstattet.** Det tidligere "portræt" var faktisk et
  skærmbillede af en bærbar med hjemmesiden åben — ikke et foto af Morten.
  Det er fjernet fuldstændigt og erstattet med en ren, neutral navy/guld-
  pladsholder (intet falsk/kunstigt foto af en navngiven person). CMS'et
  er 100% klar til, at det rigtige portræt uploades — én upload opdaterer
  det automatisk på Om Morten og Kontakt.
- **Mobilheader** (<768px): logo + hamburger-menu, desktop-menuen skjules,
  "Book en samtale" ligger i mobilmenuen. Headerhøjde er nu konsekvent
  ~67px kollapset — testet under 90px-grænsen. Desktop er 100% uændret.
- **Kompas-/sektionsplacering** er samlet i ét fælles CSS-mekanisme
  (`--header-clearance` / `--header-clearance-mobile` i `:root`) i stedet
  for individuelle per-side margins — inkl. en rettelse af en tilbageværende
  inline-padding på 404-siden, der brød med dette princip.
- **Telefonnummer**: viser nu konsekvent `+45 60 52 89 00` alle steder,
  med `tel:+4560528900`-links.
- **LinkedIn**: verificeret at pege på Mortens rigtige profil alle steder
  (Om Morten, Kontakt, CMS-standarddata).
- **The MFG Compass™ er nu levende**: klik på en retning navigerer ikke
  længere væk fra forsiden — det folder i stedet et elegant panel ud
  direkte under kompasset (kort introduktion, MFG's tilgang, typiske
  udfordringer, forventede resultater og en CTA), med et "Læs mere"-link,
  der fører videre til den fulde retningsside. Kun ét panel ad gangen er
  åbent. Alt indhold i panelerne redigeres via **Admin → The MFG Compass™**.
- **Kodeoprydning**: fjernet dødt CSS fra tidligere sprints (bl.a. en
  gammel accordion-implementering erstattet af case-modalen i RC6).
  Tilføjet `loading="lazy"` på alle billeder uden for første skærmbillede,
  samt WebP med JPEG-fallback (`<picture>`) for selve Compass-grafikken.
  Portrætbilleder er bevidst **ikke** WebP-pakket, da det ville forhindre
  CMS-uploadede portrætter i at slå igennem for de fleste browsere.

## Sådan opdaterer du Morten's portræt

Gå til **Admin → Om Morten → Profilbillede**, upload det rigtige foto, og
tryk gem. Samme fremgangsmåde findes under **Admin → Kontakt** for
kontaktsidens portræt-thumbnail.

## Sådan virker kompassets "Læs mere"-paneler

Hver af de fire retninger i kompasset har sit eget skjulte panel med fem
felter: kort introduktion, MFG's tilgang, typiske udfordringer, forventede
resultater og CTA-tekst. De redigeres under **Admin → The MFG Compass™**
og vises automatisk, når en besøgende klikker på den pågældende retning i
selve kompas-billedet. Selve kompas-*billedet* ændres ikke herfra — kun
teksten, der folder ud.

## Sådan opdaterer du selve Compass-grafikken

Compass-billedet er en fast fil: `assets/images/mfg-compass-original.jpg`
(+ en `.webp`-udgave af samme billede, brugt automatisk af browsere, der
understøtter det). For at opdatere det:
1. Udskift begge filer med en ny version i samme format og forhold.
2. De fire klikområders placering er procent-baseret i `assets/css/style.css`
   under `.hotspot-mennesker`, `.hotspot-ledelse`, `.hotspot-kultur`,
   `.hotspot-forretning` — juster disse manuelt, hvis en ny grafik har andre
   tekstplaceringer.

## Løsningskort — sådan virker det

Hver af de fire retningssider har to faste løsningskort (titel, teaser,
lang beskrivelse, udfordringer, tilgang, resultater, relateret case, CTA).
Under hver retning i adminpanelet kan Morten desuden **tilføje flere
løsningskort uden kode** — de vises automatisk nederst på siden, medmindre
de sættes til "skjult". Hvert kort kan vises som en foldbar accordion
(standard) eller som et rent link, der sender direkte til CTA-linket.

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

- **Mennesker/Ledelse/Kultur/Forretning** indeholder både de faste
  tekstfelter og en fuld løsningskort-manager.
- **Cases** og **Testimonials** har fuld opret/redigér/slet-funktion uden
  kode. Cases: titel, branche, kunde (kan skjules), udfordring, løsning,
  resultat, billede, PDF, galleri, primær og sekundær Compass-retning,
  CTA-tekst og -link. Testimonials: navn, titel, firma, citat, foto, logo,
  Compass-retning. Cases åbner i en fuld modal-visning ved klik.
- **Kontakt** indeholder både sidens egne tekster og de globale
  kontaktoplysninger (telefon, e-mail, CVR, LinkedIn, adresse).
- **Om Morten** har separate, redigerbare lister for **Kompetencer** og
  **Certificeringer**.

## Sådan aktiverer du Supabase (delt lagring på tværs af enheder)

1. Opret et gratis projekt på https://supabase.com
2. Gå til **SQL Editor** og kør hele indholdet af `supabase/schema.sql`
   (opretter tabellen `content`, alle RLS-policies, og storage-bucketten
   `mfg-media` med sine egne policies).
3. Gå til **Project Settings → API** og kopiér Project URL og "anon public"-nøglen.
4. Indsæt dem i `assets/js/supabase-config.js`:
   ```js
   window.MFG_SUPABASE_URL = 'https://dit-projekt.supabase.co';
   window.MFG_SUPABASE_ANON_KEY = 'din-anon-nøgle';
   ```
5. Upload den opdaterede fil til GitHub Pages. Adminpanelet skifter
   automatisk til Supabase — det står i den grå boks øverst i adminpanelet.

Alt, der allerede er gemt i LocalStorage, følger ikke automatisk med til
Supabase — brug **Indstillinger → Eksportér JSON** før du skifter, og
**Importér JSON** bagefter.

## Kontaktformular → rigtig mailservice (Formspree / Resend)

Formularen virker ud af boksen med en mailto-fallback. For rigtige mails:
1. Opret en formular på https://formspree.io (eller et Resend-endpoint).
2. Kopiér endpoint-URL'en.
3. Gå til **Admin → Indstillinger → Kontaktformular — mailservice-endpoint**,
   indsæt den, og tryk "Gem endpoint".

Feltet er tomt som standard, og der er ingen hårdkodede API-nøgler nogen
steder i koden.

## Analytics (Plausible eller Google Analytics)

Intet tracking-ID er indsat som standard. Gå til **Admin → Analytics**,
vælg udbyder og indsæt Site-ID/Measurement-ID. Scriptet indlæses kun,
hvis en besøgende har accepteret analytics-cookies.

## Cookiebanner

Vises automatisk ved første besøg ("Kun nødvendige" / "Accepter alle").
Valget gemmes i `mfg_cookie_consent` i LocalStorage. Status findes under
**Admin → Cookiebanner**.

## Favicon

Udskiftes direkte fra **Admin → Indstillinger → Favicon**.

## 404-side

`404.html` bruger samme header/footer/typografi som resten af sitet, og
vises automatisk af GitHub Pages for alle ugyldige URL'er.

## Hvad kan redigeres

- Alt tekstindhold på alle sider, inkl. kompassets "Læs mere"-paneler
- Løsningskort — alle ni felter pr. kort, plus opret/skjul/vis-som
- Billeder — Mortens portræt, med filupload direkte i adminpanelet
- Kontaktoplysninger — telefon, e-mail, CVR, adresse, LinkedIn
- SEO-data, CTA-knapper, Cases, Testimonials
- Kompetencer og Certificeringer på Om Morten
- Favicon

## Vigtige begrænsninger (vær ærlig om dette)

- **Adminkoden er klient-side beskyttelse, ikke rigtig autentifikation.**
  Brug ikke følsomme oplysninger i indholdet.
- Hvis Supabase er sat op, er `anon`-nøglen synlig i browserens kildekode.
  Databasepolitikkerne tillader derfor læsning/skrivning med den nøgle —
  det er en accepteret afvejning for en løsning uden selvstændig backend.
  Næste skridt for skarpere adgangskontrol er Supabase Auth.
- Billeder/PDF'er/galleri-filer uden Supabase Storage gemmes som base64 i
  LocalStorage. Fint til få filer, men ikke en langsigtet løsning for
  mange/store filer — Supabase Storage aktiveres automatisk, når Supabase
  er sat op.
- Denne sandkasse kan ikke teste mod et rigtigt Supabase-projekt (intet
  live projekt er konfigureret her) — Supabase-integrationen er testet ved
  at bekræfte korrekt fallback-adfærd og at koden følger Supabase's
  officielle REST/Storage-API'er. Test selv et rigtigt gem/hent-forløb,
  når `assets/js/supabase-config.js` er udfyldt med jeres eget projekt.
