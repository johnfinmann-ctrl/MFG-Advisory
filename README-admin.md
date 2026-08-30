# MFG Advisory — Adminpanel

Denne mappe indeholder et komplet, letvægts admin-CMS oven på den statiske
MFG Advisory-hjemmeside. Det ændrer intet ved det offentlige design — det
tilføjer kun et redigeringslag ovenpå.

## RC40 — Navigationen forenklet: fra 10 til 4 hovedpunkter

Ny desktop-navigation: **MFG leverancer | Analyser & HR-værktøjer |
Cases | Om MFG**, plus telefonnummer og "Book en strategisk samtale" —
implementeret på alle 12 offentlige sider.

### 1. "Forside" fjernet

Logoet linker fortsat til `index.html`, uændret. Menupunktet "Forside"
findes ikke længere.

### 2. "MFG leverancer" — ny dropdown

Mennesker, Ledelse, Kultur, Forretning og Foredrag er samlet under ét
klik-baseret dropdown-punkt. Fungerer identisk med mus-klik og
touch-tap (ren klik-toggle i JavaScript, ikke afhængig af `:hover`).
Lukker ved klik udenfor, ved Escape, og ved valg af et link. Alle 5
oprindelige URL'er (`mennesker.html` osv.) er 100 % uændrede.

**En reel fejl fundet og rettet undervejs:** Dropdown-panelet var
usynligt ved første implementering — `elementFromPoint` viste, at
forsidens kompas-sektion modtog klik/hover i stedet for menuen.
Årsagen var `.main-nav{overflow-x:auto}`: ifølge CSS-specifikationen
tvinger en eksplicit `overflow-x`-værdi browseren til også at sætte
`overflow-y` til `auto`, hvilket usynligt beskar den absolut
positionerede dropdown-menu, der stikker ud under navigationslinjen.
Rettet ved at fjerne `overflow-x:auto` — ikke længere nødvendigt som
sikkerhedsnet, nu hvor der kun er 4 hovedpunkter i stedet for 10.
Fanget ved at teste faktisk klikbarhed (`elementFromPoint`), ikke kun
`display`/`opacity`.

**Mobil:** Ingen ekstra klik nødvendigt. Når burgermenuen åbnes, vises
alle fem punkter direkte under overskriften "MFG LEVERANCER" — bekræftet
ved skærmbillede.

### 3. "Analyser" → "Analyser & HR-værktøjer"

Kun navnet ændret. Selve IPA Analyser-siden er urørt. Ingen nye
integrationer, ingen HR RealityCheck-kode tilføjet, som eksplicit
instrueret.

### 4. Cases bevaret som selvstændigt hovedpunkt

Ikke flyttet ind under noget andet menupunkt. `cases.html` er
fuldstændig uændret — bekræftet: fortsat 11 cases, billederne fortsat
korrekte, modal fungerer.

### 5. "Om Morten" → "Om MFG"

Kun navigations-label ændret. Selve siden (`om-morten.html`, URL og alt
biografisk indhold) er urørt, som instrueret.

### 6. "Kontakt" fjernet fra hovedmenuen

`kontakt.html` findes fortsat uændret og er fortsat linket fra footeren
(var allerede der). Telefonnummer og "Book en strategisk samtale" er
fortsat synlige i headeren på alle sider, uændret.

### Test — alle 7 krævede bredder

375px, 390px, 768px, 1024px, 1280px, 1440px og 1920px: ingen
menupunkter klippes, ingen horisontal scroll. Dropdown testet med
faktisk klik (ikke kun hover) og bekræftet klikbar/ikke skjult bagved
andet indhold. Burgermenu testet. Logo bekræftet linker til forsiden.
Alle 5 sider under "MFG leverancer" åbnet og korrekt aktiv-tilstand
verificeret (både på dropdown-knappen og det specifikke link). Cases
og Analyser bekræftet fuldstændig uændrede.

Screenshots af desktop-dropdown (åben tilstand) og mobilmenu vedhæftet.

**Ændrede filer:** `assets/css/style.css` (dropdown-styling + fjernet
`overflow-x:auto`), `assets/js/main.js` (dropdown-toggle-logik), samt
navigationsblokken på alle 12 offentlige sider (nyt markup, korrekt
aktiv-tilstand pr. side). Ingen ændring af sideindhold, Cases-data,
Foredrag-data, Compass eller Analyser-siden.

## RC39 — De 3 fremhævede cases på forsiden rettet

**Undersøgelsen bekræftede præcis det, du mistænkte:** Forsiden bruger
en **helt separat komponent** til de 3 fremhævede cases —
`[data-featured-cases-list]` — adskilt fra selve Cases-sidens
`[data-cases-list]`. RC38's rettelse var scopet strengt til
`[data-cases-list]` og påvirkede derfor aldrig forsidens kort, som
stadig brugte den oprindelige `.case-teaser img{height:140px;object-fit:cover}`
og dermed beskar toppen af billedet — nøjagtig de eksempler, du nævnte.

**Løsningen:** Tilføjet den samme, allerede afprøvede regel
(`aspect-ratio:16/9;object-fit:contain`) som en ny, lokal regel scopet
specifikt til `[data-featured-cases-list] .talk-card img` — én blok
kode, ingen ændring af den globale `.case-teaser`-regel eller af
Cases-siden.

**Bekræftet urørt:**
- `cases.html` — bekræftet ved diff: kun cache-busting
  versionsnummer ændret, intet indhold. Fortsat 11 cases, billeder
  fortsat korrekte, modal fungerer.
- De samme 3 cases vises fortsat (Case 01, Case 04, Case 07).
- Case-data, tekster, nøgletal, CTA'er, modal — alt uændret.
- Foredrag-siden — fortsat `cover`/140px, uændret.
- Mobilvisningen på forsiden — allerede korrekt, fortsat uændret.

### Test — alle 4 krævede bredder

1024px, 1280px, 1440px og 1920px: alle 3 fremhævede billeder bekræftet
`object-fit:contain`, korrekt indlæst, gengivet forhold matcher 16:9
præcist. Skærmbillede af hele sektionen "Cases og dokumenterede
resultater" med alle 3 kort vedhæftet ved 1280px — alle tre
billedoverskrifter ("Fra høj personaleomsætning...", "Én
ledelsesrytme på tværs af 32 butikker", "Kundeløftet blev gjort til
adfærd — ikke en plakat") er nu fuldt synlige fra begyndelsen.

**Ændret fil:** `assets/css/style.css` (én ny, lokal regel tilføjet).
`cases.html` er ikke rørt.

## RC38 — Case-billeder rettet på desktop/tablet

**Årsagen fundet præcist:** `.case-teaser img{height:140px;object-fit:cover}`
tvang billedet ind i en fast 140px-højde og beskar dermed toppen af de
16:9-formaterede billeder — herunder titlen indbygget i selve
billedfilen (fx "Ledelse gennem indflydelse" og "Kundeløftet blev gjort
til adfærd"). En tilsvarende rettelse var allerede lavet, men kun for
mobil (`@media(max-width:767px)`), og gjaldt derfor ikke desktop og
tablet.

**Løsningen:** Fjernet mobil-afgrænsningen fra den eksisterende,
allerede godkendte fix, så den nu gælder ved alle bredder — men kun for
selve Cases-siden. Billedet bruger `aspect-ratio:16/9` (matcher
billedernes faktiske format præcist) og `object-fit:contain` i stedet
for `cover`, så hele billedet, inklusive al tekst i selve filen, altid
er synligt uden beskæring eller forvrængning.

**Strengt scopet, rører intet andet:**
- Reglen gælder kun `[data-cases-list] .talk-card img` — et attribut,
  der udelukkende findes på selve Cases-oversigten.
- Foredrag-siden og forsidens fremhævede cases-teaser bruger begge
  fortsat den oprindelige `height:140px;object-fit:cover`-regel
  uændret — verificeret eksplicit.
- Ingen ændring af billedfilerne selv, case-tekst, nøgletal, CTA-knapper,
  kortbredde eller modal-funktion — alt det, RC36/RC37 allerede rettede,
  er urørt og genverificeret.
- Mobil er bekræftet 100 % uændret (samme regel som allerede var
  godkendt der).

### Test — alle 4 krævede bredder, alle tjek bestået

1024px, 1280px, 1440px og 1920px: alle billeder bekræftet
`object-fit:contain`, korrekt indlæst, og det gengivne billedes
højde/bredde-forhold matcher 16:9 præcist (ingen strækning/forvrængning).
Screenshots af Case 05 og Case 07 vedhæftet ved 1280px — begge viser nu
hele overskriften inde i billedet ("CASE 05 · LEDELSE" / "Ledelse
gennem indflydelse — ikke organisationsdiagram" og "CASE 07 · KULTUR" /
"Kundeløftet blev gjort til adfærd — ikke en plakat") fuldt synlig.

Fuld regressionstest: ingen tekstklipning, modal fungerer, 11 cases,
mobilbillede uændret, Foredrag-billeder uændret (fortsat `cover`),
forsidens fremhævede cases uændret (fortsat `cover`).

**Eneste ændrede fil:** `assets/css/style.css` (én CSS-regel udvidet
fra mobil-kun til alle bredder).

## RC37 — udtømmende gennemgang af tjeklisten; ingen yderligere fejl fundet

**Vigtigt at være ærlig om:** De to vedhæftede billeder i denne besked
viste begge mobilvisningen (som allerede er godkendt og bekræftet
korrekt) — ikke desktop. Der er derfor stadig ikke set et konkret
billede af selve desktop-fejlen.

**Kodeændringer i denne runde: ingen.** Jeg gennemgik hele den
specificerede tjekliste systematisk mod den nuværende kode:

| Tjekpunkt | Fundet i CSS? |
|---|---|
| fast height på tekstområdet | Nej — eksplicit `height:auto` |
| min-height/max-height | Nej — kun `min-height:0` (fjerner en flex-standard, øger ikke risiko) og `max-height:none` |
| overflow:hidden | Nej — ingen overordnet container omkring case-kortene har det |
| line-clamp | Findes slet ikke i hele stylesheetet |
| grid-auto-rows | Findes slet ikke i hele stylesheetet |
| align-items:stretch på Cases | Nej — sat til `start` specifikt for Cases-gridet |
| flex-basis | Ikke brugt på case-kortene |
| desktop-only media queries med højde | Ingen fundet, der rammer case-kort |

Kortet er allerede en ægte flex-kolonne uden nogen højdebegrænsning —
den mest robuste struktur, jeg kan konstruere uden at se den faktiske
fejl.

**Verificeret på ny:** 1024, 1100, 1280, 1440, 1920px — nul målt
klipning af overskrift, teaser eller nøgletal; begge CTA-knapper
("Læs hele casen", "Book en samtale") synlige på alle kort ved alle
fem bredder. Screenshots ved 1280px og 1440px af de første 4 kort
vedhæftet, som krævet — al tekst og begge knapper er synlige.
Mobil/tablet under 1024px bekræftet fuldstændig uændret.

**Hvis fejlen stadig består:** Jeg har nu tre gange lavet stadigt
kraftigere, strukturelle rettelser uden at kunne gengive problemet i
mit testmiljø (Chromium, inkl. simuleret Windows-skalering). Uden et
faktisk desktop-screenshot af selve fejlen — gerne med
browser-zoomniveau og evt. Windows-skærmskalering (100/125/150 %) —
er jeg nu ved grænsen for, hvad jeg kan finde ved kodegennemgang alene.
En kort skærmoptagelse eller endnu et screenshot, denne gang af PC-
visningen, vil gøre en afgørende forskel.

## RC36 — Cases-kort gjort markant mere robuste mod klipning

**Vigtigt at vide:** Der var ikke vedhæftet noget screenshot i denne
besked. Jeg har derfor ikke selv kunnet se det konkrete udseende, du
oplever på Windows/Opera/Edge. Jeg har til gengæld gravet betydeligt
dybere end sidste gang og lavet en markant stærkere rettelse — men jeg
kan ærligt talt ikke 100% garantere, at den løser præcis det, du ser,
uden selv at have set billedet.

### Hvad jeg gjorde denne gang

Sidste rettelse (RC35) tilføjede defensive regler mod faste højder, men
kortene brugte stadig almindelig blok-visning inde i et CSS Grid, som
som udgangspunkt strækker naboer til samme højde (`align-items:stretch`
er Grids standard). Det burde ikke i sig selv klippe tekst, og jeg kunne
heller ikke måle nogen klipning — men for at fjerne enhver tvivl har jeg
nu lavet en væsentligt kraftigere, mere garanterende løsning:

- **Case-kortet er nu en ægte flex-kolonne** (`display:flex;flex-direction:column`),
  ikke almindelig blokvisning. Det er samme, afprøvede metode, jeg
  tidligere brugte til at løse et tilsvarende problem på
  Foredrag-siden.
- **`align-items:start` på selve grid'et**, så Grids indbyggede
  strækning af naboer til samme højde er slået helt fra på Cases-siden.
  (Præcist scopet, så Foredrag-siden — som bevidst ØNSKER ensartet
  korthøjde — beholder sin egen indstilling uændret.)
- Hvert element i kortet (billede, kategori-tag, overskrift, teaser,
  nøgletal, knapper) er eksplicit sat til `flex:none`, så intet
  krymper eller vokser ud over sit eget indhold.
- De tidligere defensive regler (`height:auto;max-height:none;overflow:visible`
  på overskrift og brødtekst) er bevaret.

### Test udført

- 33 automatiserede tjek ved præcis de 6 bredder, du bad om (960, 1024,
  1100, 1280, 1440, 1920px): nul målte tilfælde af klippet tekst
  (`scrollHeight > clientHeight`) på nogen overskrift eller brødtekst.
- Testet desuden med simuleret Windows-skærmskalering (125 %), som er
  almindelig på bærbare — stadig nul klipning målt.
- Høj-opløsnings nærbilleder af enkeltkort gennemgået visuelt af mig —
  fuld overskrift, fuld brødtekst, alle nøgletal og begge knapper
  synlige på hvert kort, jeg tjekkede.
- Jeg forsøgte at teste i WebKit (Safari-motoren) og Firefox for at
  udelukke en motor-specifik gengivelsesforskel, men kunne ikke
  installere dem i dette miljø (ingen netværksadgang til browser-
  download'et). Jeg kan derfor ikke 100 % udelukke en Chromium-specifik
  Windows-gengivelsesforskel, jeg ikke selv kan se.
- Nul regression: Cases (11), Foredrag (13), filtre, begge modaller
  (Cases og Analyser), navigation ved alle 6 bredder, kompas-fixet og
  Analyser-knappernes guldfarve alle bekræftet uændrede/fungerende.

### Hvis fejlen stadig består

Send det faktiske screenshot med denne besked — det blev ikke
vedhæftet denne gang, og uden at se det konkrete udseende, kan jeg kun
gøre koden defensivt stærkere, ikke ramme en specifik, usynlig fejl
præcist. Gerne også hvilken skærmopløsning og evt. Windows-skalering
(100 %/125 %/150 %) du bruger.

**Eneste ændrede fil:** `assets/css/style.css`.

## RC35 — Responsive QA: 4 reelle fejl fundet og rettet

Ren teknisk CSS/layout-rettelse, intet redesign. Eneste ændrede fil:
`assets/css/style.css`.

### 1. Cases — tekst kunne i princippet klippes

Fandt ingen faktisk klipning i mine test (Chromium, alle bredder
1024-1920px), men da rapporten specifikt nævnte Opera og Edge — begge
Windows-almindelige browsere — er den mest sandsynlige årsag, at disse
viser en fast, pladskrævende lodret scrollbar (i modsætning til
Mac/Linux' overlay-scrollbar). Det kan forskyde sidens reelle bredde
med 15-17px og få tekst til at ombryde anderledes, end mit testmiljø
viser.

**Rettet på to måder:**
- Tilføjet `scrollbar-gutter:stable` på `html`, så scrollbarens
  bredde altid er reserveret konsekvent — forhindrer den klassiske
  "indhold hopper i bredde, når en scrollbar dukker op"-fejl.
- Tilføjet eksplicitte, defensive regler på case-kortenes
  overskrift/brødtekst (`height:auto;max-height:none;overflow:visible`),
  så de garanteret kan vokse med indholdet, uanset browser.

### 2. Header/navigation — "Kontakt" reelt klippet ved 960-1100px

**Bekræftet og målt direkte:** Ved 960px, 1024px og 1100px krævede
navigationen vandret scroll, og "Kontakt" var ikke fuldt synligt uden at
scrolle i selve menu-linjen — en reel, målbar fejl, forværret af at
"Analyser" nu er blevet det 10. menupunkt.

**Rettet:** Justeret navigationens skriftstørrelse og mellemrum
(samt bookingknappens og telefonnummerets størrelse) til én samlet,
testet indstilling, der giver reel plads i hele intervallet 960px og
opefter. Verificeret ved direkte måling af hvert menupunkts position
mod viewportets kanter — ikke kun beregnet bredde — ved 14 forskellige
bredder fra 768px til 1920px.

### 3. Mobil — indhold skjult bag sticky header

Selve sidens indlæsning havde tilstrækkelig afstand til headeren
overalt. Den reelle fejl var et andet sted: **interne anker-links**
("Se foredragene" på Foredrag-siden, "Se relateret case →" på
Mennesker/Ledelse/Kultur/Forretning) manglede `scroll-margin-top`.
Ved klik hoppede siden til sektionen med toppen helt op til y=0,
hvilket placerede overskriften bag den 67px høje faste header —
bekræftet direkte ved at udføre det faktiske klik og måle positionen
bagefter.

**Rettet:** Tilføjet `scroll-margin-top:100px` til alle 5 berørte
ankermål (`#foredrag-oversigt`, `#case-mennesker`, `#case-ledelse`,
`#case-kultur`, `#case-forretning`), scopet præcist til disse ID'er.

### 4. Analyser — "Læs mere →" i navy på navy

Bekræftet: knapperne brugte den globale `.btn-ghost`-klasse, som er
navy tekst/kant — designet til lyse baggrunde. På den mørke
IPA-sektion blev teksten næsten usynlig. Rettet med en scopet
override (`.ipa-area-card .btn-ghost.ipa-readmore-btn`) til MFG-guld
(`--copper-light`), med omvendt (navy-på-guld) hover-tilstand.
Modal-funktionen er urørt og fortsat fuldt fungerende.

### Test — alle 8 krævede bredder, alle nævnte sider

Testet ved 375/390/430/768/1024/1280/1440/1920px på forsiden, Cases
(både oversigt og hele siden), Analyser, header/navigation. Ingen
klippet tekst, ingen elementer uden for viewport, ingen horisontal
scroll, intet indhold skjult bag header, ingen navigation der
forsvinder. Bekræftet ved direkte, målte tjek — ikke kun beregnede
værdier — for hvert punkt. Nul regression: Cases (11), Foredrag (13),
kompas-fixet, alle modaler (Cases og Analyser) bekræftet fortsat
fungerende.

**Eneste ændrede fil:** `assets/css/style.css`.

## RC34 — ny side: IPA Analyser

Ny, selvstændig side tilføjet oven på den nuværende version. Ingen
database, ingen Supabase, ingen Vercel, ingen betalte tjenester —
fortsat 0 kr. i ekstra faste driftsomkostninger, som krævet.

### Kildegrundlag

Al tekst er hentet og omskrevet tæt op ad "Beskrivelser af IPA
Analyser.docx" — intet er opfundet. Specifikt bekræftet medtaget, som
krævet:
- GRIT Profiles fire områder (Struktur, Handling, Samarbejde, Forandring)
- Leadership Mindsets fire perspektiver (Struktur, Resultat, Relation,
  Forandring) samt integratorrollen
- Den eksplicitte præcisering af, at Meta Profile ikke er en selvstændig
  analyse, men bygger på en gennemført Core Personality Profile
- Den eksplicitte præcisering af, at Leadership Mindset ikke er en test
  af, om man er en god eller dårlig leder
- Kun anvendelser, dokumentet faktisk nævner (lederudvikling,
  rekruttering, onboarding, karriereafklaring, coaching,
  medarbejderudvikling, teamsamarbejde, udvikling af ledergrupper)

### Navigation

Testet empirisk: "IPA Analyser" gav horisontal overflow på navigationen
ved alle testede desktopbredder (960-1440px). "Analyser" passer ved de
normale desktopbredder (1180px+). Brugt "Analyser", præcis som
instrueret ved pladsmangel. Tilføjet til alle 11 eksisterende sider —
kun tilføjet, intet i den eksisterende navigation er ændret eller
flyttet.

### Design

Mørk navy, MFG-guld, samme skrifttyper og komponentmønstre
(kort/knapper/modal-stil) som resten af sitet — ingen ny visuel stil
opfundet. Ingen HR-software-look; store billeder, kort tekst, luft.

### En fejl fundet og rettet undervejs

Sektionen "Hvad kan analyserne bruges til?" genbrugte den eksisterende
`.cases-head`-klasse for dens pæne, centrerede layout — men den klasse
sætter overskriftens farve til hvid, fordi den normalt kun bruges i
mørke sektioner (Cases-siden). Da min sektion er lys, blev overskriften
næsten usynlig. Fundet ved at se det faktiske skærmbillede, ikke kun
automatiske tjek, og rettet med en scopet override
(`.ipa-usecases .cases-head h2`), der ikke påvirker `.cases-head` andre
steder på sitet.

### Billeder

De tre leverede illustrationer er indsat uændret (samme
pixel-dimensioner før/efter, ingen beskæring, ingen tekst/farver
ændret). Alle bruger `object-fit:contain`, så hele infografikken —
inklusive al tekst — altid er synlig, uanset skærmbredde, som krævet.

### Ikke implementeret (som instrueret)

- HR RealityCheck — ingen kode, ingen scripts, ingen plads reserveret
- Intet badge/logo for Strategisk HR — kun tekstbaseret partnerblok,
  da intet officielt materiale er leveret
- Ingen nye tracking-, marketing- eller tredjepartscookies

### Test — 51 automatiserede tjek, alle bestået

Alle tre illustrationer indlæses korrekt og ubeskåret; alle tre
"Læs mere"-modaller åbner med korrekt, kildebaseret indhold og lukker
korrekt via kryds, baggrundsklik og Escape; begge eksterne links
(IPA Nordic, Strategisk HR) peger korrekt og åbner i ny fane; CTA'en
fører til den eksisterende kontaktside; ingen horisontal scroll på
1180-1920px desktop, iPhone 375/390px eller iPad. Nul regression:
Cases (fortsat 11), Foredrag (fortsat 13), kompas-fixet, kontaktoplysninger
og alle øvrige sider bekræftet uændrede. Ingen konsolfejl.

**Nye filer:** `ipa-analyser.html`, `assets/images/ipa/` (3 illustrationer).
**Ændrede filer:** `assets/css/style.css` (ny, selvstændig IPA-sektion
tilføjet nederst i filen), samt ét tilføjet navigationslink + CSS-versionsbump
på de 11 eksisterende offentlige sider. Intet andet er ændret.

## RC33 — casebilleder ikke længere beskåret på mobil

### Årsagen

`.case-teaser img` (bruges til casekortenes billede) havde en **fast
højde på 140px** kombineret med `object-fit:cover`. På smalle
mobilskærme er kortet meget smallere end det er højt i forhold til
billedets 16:9-format, så `cover` beskar kraftigt i toppen og bunden for
at fylde den faste højde ud — det var her "CASE 01 · MENNESKER"
forsvandt.

### Løsningen — strengt scopet til Cases på mobil

Tilføjet én ny regel inden i en `@media(max-width:767px)`-blok, scopet
specifikt til `[data-cases-list] .talk-card img` (attributten
`data-cases-list` findes **udelukkende** på selve Cases-oversigten, ikke
på Foredrag eller forsidens fremhævede cases-teaser):

- `height:auto` (fjerner den faste 140px)
- `aspect-ratio:16/9` (matcher billedernes faktiske, native format
  præcist — 2048×1152)
- `object-fit:contain` (viser hele billedet, ingen beskæring)

Fordi `aspect-ratio` matcher billedernes ægte format 1:1, udfyldes
rammen helt uden synlige bjælker i top eller bund — verificeret ved at
sammenligne det tomme rum: 0px.

### Bevidst IKKE ændret

- **Desktop og tablet** (>767px): stadig `height:140px` og
  `object-fit:cover`, helt uændret — verificeret ved computed style på
  1440px, 1024px, 834px og 768px.
- **Foredrag-siden på mobil**: uændret, stadig `cover`/140px — reglen er
  scopet til `[data-cases-list]`, som Foredrag ikke bruger.
- **Forsidens fremhævede cases-teaser**: uændret (bruger
  `data-featured-cases-list`, ikke `data-cases-list`) — uden for den
  eksplicitte opgave.
- Ingen ændringer i selve billedfilerne, case-tekster, rækkefølge,
  filtre eller modal-funktion.

### Test — 30 automatiserede tjek, alle bestået

Testet ved 375px, 390px, 414px og 430px: `object-fit:contain` bekræftet,
og det gengivne billedes højde/bredde-forhold matcher 16:9 præcist på
alle fire bredder. Alle 11 billeder til stede og indlæses korrekt (også
verificeret efter scroll, da billederne bruger lazy-loading — allerede
eksisterende, upåvirket adfærd). Case-rækkefølge og -indhold uændret.
Modal bekræftet stadig fungerende på mobil. Desktop, tablet (768/834/1024px)
og Foredrag-siden bekræftet fuldstændig uændrede. Ingen regression på
øvrige sider.

**Visuelt bekræftet:** Skærmbillede af Case 01 på 390px viser nu hele
billedet, inklusive "CASE 01 · MENNESKER" tydeligt øverst, titlen,
nøgletalsboksen og bundlinjen "THE MFG COMPASS™ · FRA POTENTIALE TIL
VARIGE RESULTATER" — intet er beskåret.

**Eneste ændrede fil:** `assets/css/style.css` (én ny, scopet
mobil-regel). Øvrige filer har udelukkende cache-busting
versionsnummer opdateret.

## RC32 — de 11 rigtige casebilleder indsat + Kultur-foredrag flyttet

### 1. Cases — de 11 leverede billeder indsat

Alle 11 billeder blev modtaget og **verificeret enkeltvis ved at læse
CASE-nummeret trykt direkte på hvert billede**, ikke ud fra filnavn eller
uploadrækkefølge — præcis som krævet. Alle 11 var allerede korrekt
fortløbende nummereret (IMG_4172 = Case 01 … IMG_4182 = Case 11), men
blev alligevel tjekket ét ad gangen for at udelukke fejl.

Billederne er indsat direkte under de eksisterende, forventede filnavne
(`case-01-onboarding-tilknytning.jpg` osv.) og erstatter de tidligere
generiske MFG-placeholders fuldstændigt. Ingen AI-generering, ingen
beskæring, ingen ændring af tekst/farver i billederne — kun
formatkonvertering fra PNG til JPEG (kvalitet 92) for at matche sitets
eksisterende billedformat. Verificeret programmatisk, at
pixel-dimensionerne (2048×1152) er identiske før og efter — ingen
strækning fandt sted.

Case-tekster, tal, kategorier, filtre og rækkefølge er 100 % uændrede —
bekræftet ved diff af `default-cases.js`.

### 2. Foredrag — Kultur-foredraget flyttet

"Når løftet møder hverdagen" (Kultur) lå sidst i rækkefølgen (nr. 13),
adskilt fra de to andre Kultur-foredrag (nr. 7-8). Flyttet til nr. 9, så
alle tre Kultur-foredrag nu står samlet (7, 8, 9), og
Forretningsudvikling-foredragene rykker tilsvarende til 10-13. Kun
`sort_order`-feltet er ændret — titel, beskrivelse, billede, kategori og
link er 100 % uændrede for alle 13 foredrag.

### 3. Den mørke firkant på mobil

Jeg har undersøgt grundigt (alle `position:fixed`-elementer, alle
højre-ankrede elementer, al JavaScript for scroll-relateret kode — der
findes ingen —, kompas-elementernes hviletilstand, og
`color-scheme`-indstillinger), men **kunne ikke reproducere den
beskrevne mørke firkant** i mit testmiljø, hverken på forsiden, Foredrag
eller Cases, før/efter cookie-accept eller før/efter scroll. Da
kompasset allerede fik fjernet to andre mørke bokse i tidligere runder
(den store baggrundsboks og den lille tekstboks bag "SKAB RETNING"), er
det muligt, at det du ser, stammer fra en cachet, ældre version af
siden. Jeg har bevidst **ikke** rørt noget for at "gætte" mig til en
løsning, da det ville risikere at bryde en reel funktion uden grund.
Send gerne et skærmbillede, hvis firkanten stadig ses efter en
hård genindlæsning (ctrl/cmd+shift+R) af den nye version, så retter jeg
det præcist.

### Test — 33 automatiserede tjek, alle bestået

Alle 11 cases viser korrekt, ægte billede i korrekt rækkefølge (verificeret
pixel-dimensioner 2048×1152 på hvert eneste); ingen placeholders tilbage;
Case 01-03 = Mennesker, 04-06 = Ledelse, 07-08 = Kultur, 09-11 =
Forretning; Case 07/08 bekræftet stadig nabo-placeret, ikke flyttet;
billeder bekræftet ikke strakt (`object-fit:cover`, ensartet højde på
mobil og tablet); alle case-filtre virker; "Læs hele casen" åbner
korrekt case med korrekt billede; "Book en samtale" intakt. Foredrag:
fortsat 13 foredrag, alle 3 Kultur-foredrag nu bekræftet grupperet,
Kultur-filteret viser præcis 3. Nul regression på forsiden,
kompas-fixet, øvrige sider.

**cases_data_version:** `v6-11cases-company-names` → `v7-11cases-real-images`
**talks_data_version:** `v3-13talks-kultur-loftet` → `v4-13talks-kultur-grouped`

**Ændrede/nye filer:** 11 billedfiler i `assets/images/cases/` (udskiftet),
`assets/js/default-talks.js` (kun sort_order-felter),
`assets/js/content-loader.js`, `assets/js/admin.js` (versionsbump),
cache-busting på alle 12 sider. `default-cases.js` (case-teksterne) er
100 % uændret — kun de tilhørende billedfiler er skiftet ud.

## RC31 — den lille mørke firkant bag "SKAB RETNING" fjernet

### Opgave 1 — Forside / The MFG Compass

Årsagen: `.compass-center__label` (teksten "SKAB RETNING") havde sin
egen halvgennemsigtige, mørke baggrund (`rgba(15,25,50,.38)` på
desktop, `rgba(10,20,40,.55)` på mobil) med padding og afrundede
hjørner — en lille, selvstændig boks oven på selve kompasbilledet
(adskilt fra den store boks bag hele kompasset, som blev fjernet i en
tidligere runde).

**Løsning:** Fjernet `background`, `padding` og `border-radius` fra
`.compass-center__label` — både i desktop- og mobil-reglen. Alt andet
er bevaret uændret: skriftstørrelse, skriftvægt (800), bogstavafstand,
linjehøjde, hvid farve og tekstskyggen, der giver kontrast mod guldet.

**Verificeret:**
- Teksten er stadig ordret "SKAB RETNING", uændret typografi.
- Klikområdet (`.compass-center`) er urørt — samme størrelse, samme
  runde form, samme hover/fokus-ring.
- Linket sender fortsat til `mfg-compass.html`, testet eksplicit.
- Alle fire øvrige kompaslinks (Mennesker, Ledelse, Kultur, Forretning)
  testet enkeltvis og bekræftet uændrede.
- Den store, blå Compass-sektion er urørt.
- Testet og bekræftet visuelt på både desktop og mobil.

### Opgave 2 — Cases / billeder

Ingen ændringer foretaget. De eksisterende MFG-placeholder-billeder er
urørt (bekræftet — Cases-siden bruger fortsat de samme 11 billedfiler
som i RC30).

### Test — 24 automatiserede tjek, alle bestået

Ingen baggrund bag label (desktop og mobil), tekst og typografi
uændret, klik til `mfg-compass.html` bekræftet, alle fire øvrige
kompaslinks bekræftet, Cases bekræftet fortsat 11 med samme billeder,
Foredrag fortsat 13, navigation og Book-knap uændret, nul horisontal
scroll på alle sider.

**Ændrede filer:** `assets/css/style.css` (kun de to
`.compass-center__label`-regler). Ingen andre filer ændret ud over
cache-busting version på de 11 offentlige sider (admin.html bruger sin
egen `admin.css` og er upåvirket).

## RC30 — kun virksomhedsreferencerne rettet tilbage

Én afgrænset rettelse oven på RC29, som blev godkendt på alt andet.

### Hvad blev ændret

For 10 af de 11 cases er `org_type`-linjen udvidet med det relevante
virksomhedsnavn som præfiks — nøjagtig samme stil som i den seneste
godkendte version før RC29 (fx "SENG · Landsdækkende retailkæde · 32
butikker · 100+ medarbejdere"). Intet andet i de 11 cases er rørt:
titel, teaser, Udfordringen, Mit ansvar, Sådan greb jeg det an, nøgletal,
Resultatet og "Sådan kan MFG Advisory hjælpe" er alle bekræftet
identiske med RC29 (verificeret ved diff af datafilen).

**Case 08 er eksplicit ladet fuldstændig urørt**, som krævet — ingen
virksomhedsnavn er tilføjet der, org-linjen er stadig "Performancekultur
· Transparens · Ordentlig opfølgning".

### Sådan blev virksomhedstilknytningen bestemt

RC29's 11 cases og de tidligere 8 SENG/Bang & Olufsen-cases er ikke
identiske sæt, så tilknytningen er udledt af de faktuelle kendetegn i
hver enkelt case (samme fakta går igen på tværs af begge dokumenter):

- **SENG** (7 cases): kendetegnet ved "32 butikker", dansk/svensk
  retailkæde, P&L ca. 250 mio. kr. — case 1, 2, 3, 4, 6, 7, 9.
- **Bang & Olufsen** (3 cases): kendetegnet ved "internationalt
  premiumbrand", "140 partnere", franchise, nordisk netværk — case 5,
  10, 11.
- **Case 8**: ingen tydeligt kendetegn og eksplicit undtaget — urørt.

### Disclaimer

Opdateret til den præcise, angivne ordlyd: *"Cases beskriver erfaring og
resultater fra Mortens tidligere lederroller. De nævnte virksomheder er
tidligere arbejdsgivere/organisationer og er ikke nødvendigvis kunder
hos MFG Advisory."* — verificeret ordret ved tegn-for-tegn-sammenligning.

### cases_data_version

Bumpet fra `v5-11cases-master-doc` til `v6-11cases-company-names`, så
browsere med den anonymiserede RC29-udgave i LocalStorage automatisk
opgraderes til udgaven med virksomhedsnavne.

### Test — 39 automatiserede tjek, alle bestået

- Fortsat 11 cases, fortsat 3/3/2/3-fordeling.
- Kultur viser præcis Case 07 og Case 08 — ikke flere, ikke færre.
- SENG bekræftet til stede i alle 7 relevante cases' modaler; Bang &
  Olufsen bekræftet til stede i alle 3 relevante cases' modaler —
  tjekket enkeltvis, ikke kun stikprøve.
- Case 08 bekræftet uden virksomhedsnavn og med uændret indhold.
- Disclaimer-tekst bekræftet ordret.
- Placeholder-billeder bekræftet fuldstændig uændrede (byte-for-byte
  samme filliste som RC29).
- Stale RC29-data (v5) bekræftet automatisk opgraderet til v6 med
  virksomhedsnavne.
- Nul regression: Foredrag (13), kompas-fix, layout, filtre, modal,
  navigation og alle øvrige sider uændrede.

Skærmbilleder af "Alle", Kultur-filteret, samt de fulde modaler for
Case 01 (SENG), Case 05 (Bang & Olufsen) og Case 08 (urørt).

**Ændrede filer:** `assets/js/default-cases.js` (kun 10 org_type-linjer),
`assets/js/content-loader.js`, `assets/js/admin.js` (versionsbump),
`cases.html` (kun disclaimer-teksten), cache-busting på alle 12 sider.
Billeder, layout, Foredrag, forsiden, The MFG Compass, navigation og
øvrige sider er 100 % uændrede.

## RC29 — Cases erstattet med det verificerede 11-case mastergrundlag

**Bemærkning om vedhæftet fil:** Beskeden nævnte
"MFG_Advisory_Websitecases_11_cases_v1(2).docx", men denne fil var ikke
vedhæftet. Jeg har derfor brugt den eksisterende
"MFG_Advisory_Websitecases_11_cases_v1.docx", som allerede lå i
systemet under matchende navn, og læst den linje for linje igen for at
sikre 100 % ordret præcision.

### Opgave 1 — Case 08 | Kultur

Bekræftet til stede og verificeret ordret mod dokumentet: kategori
Kultur, org-linje "Performancekultur · Transparens · Ordentlig
opfølgning", titel "Fra lokale sandheder til en åben
performancekultur", samt hele teksten (Udfordringen, Mit ansvar, Sådan
greb jeg det an, nøgletal, Resultatet, Sådan kan MFG Advisory hjælpe).
Fungerer identisk med de øvrige cases: webkort, "Læs hele casen", fuld
modal, korrekt filtrering under Kultur.

### Opgave 2 — Alle 11 cases kontrolleret

Sammenholdt hele Cases-siden med dokumentets oversigt. Det tidligere
8-case-datasæt (SENG/Bang & Olufsen) matchede ikke dokumentet og er
erstattet fuldstændigt med de 11 cases fra mastergrundlaget — verificeret
felt for felt (titel, org-linje, webkort-teaser, udfordring, ansvar, alle
fire greb, nøgletal, resultat, MFG Advisory-hjælp).

**Fordeling bekræftet:** 3 Mennesker, 3 Ledelse, 2 Kultur, 3 Forretning
= 11 i alt.

**Om virksomhedsnavne:** Dokumentets 11 cases bruger ikke konkrete
virksomhedsnavne (de er skrevet med anonymiserede organisationstyper,
fx "Landsdækkende retailkæde") — det er ikke en beslutning, jeg har
truffet i denne omgang, men selve indholdet i mastergrundlaget, brugt
ordret som instrueret. Filterknappen "Forretningsudvikling" er
tilsvarende ført tilbage til "Forretning", da det er den betegnelse,
dokumentet selv bruger for denne kategori. Introteksten og disclaimeren
på Cases-siden er opdateret fra "8 eksempler / primært hos SENG og Bang
& Olufsen" til "11 eksempler / anonymiserede organisationer" — en
direkte, nødvendig konsekvens af selve case-udskiftningen, for at siden
ikke skulle modsige sig selv.

### Billeder

Som instrueret er der ikke genereret eller indsat nye billeder. De 8
midlertidige SENG/B&O-placeholder-billeder er erstattet af 11 nye
placeholder-filer under de oprindelige case-slugs — samme neutrale
navy/guld-grafik som hidtil, ingen ægte fotos eller logoer.

### cases_data_version

Bumpet fra `v4-8cases-seng-bo` til `v5-11cases-master-doc` i både
`content-loader.js` og `admin.js`, så browsere med det gamle 8-case-datasæt
i LocalStorage automatisk opgraderes til de 11 cases ved næste besøg —
verificeret med en simuleret browser med gammel v4-data.

### Test — 44 automatiserede tjek, alle bestået

Alle 11 cases til stede med korrekt titel; alle 8 gamle SENG/B&O-cases
bekræftet væk; alle fire filtre viser præcis den rigtige optælling
(tjekket via reel CSS-synlighed); Case 08 specifikt verificeret ordret i
både kort og modal; stale-data-opgradering bekræftet; forsidens 3
fremhævede cases; mobiltest af Kultur-filteret; nul regression på
Foredrag (13), kompas-fixet fra forrige runde, og øvrige sider.
Skærmbilleder taget af "Alle", Kultur-filteret og Case 08's fulde modal.

**Ændrede filer:** `assets/js/default-cases.js` (fuldt genskrevet med de
verificerede 11 cases), `assets/js/content-loader.js`, `assets/js/admin.js`
(kategori tilbageført til "forretning" + versionsbump), `cases.html`
(introtekst, disclaimer, filterknap), 11 nye billedfiler i
`assets/images/cases/` (de 8 gamle slettet), samt cache-busting
versionsbump på alle 12 sider. Ingen ændringer uden for Cases.

## RC28.1 — grundig genverifikation af kompas-fixet

Den vedhæftede prompt beskrev samme opgave som RC28 (fjern den mørke
firkant bag kompasset på forsiden). Fixet var allerede implementeret og
leveret — ingen ny kodeændring var nødvendig denne gang. I stedet
gennemførte jeg en langt grundigere verifikation efter den mere
detaljerede tjekliste, som blev vedhæftet:

**43 automatiserede tjek, alle bestået**, herunder specifikt:
- Ingen `box-shadow` på kompas-wrapperen; det transparente billede
  bekræftet i brug.
- Al tekst bevaret ordret: MENNESKER, LEDELSE, KULTUR, FORRETNING samt
  alle fire undertekster og "SKAB RETNING".
- **Alle 4 retningsklik testet individuelt** — hver fører nu bekræftet
  til den rigtige side (mennesker.html, ledelse.html, kultur.html,
  forretning.html) — samt center-linket til mfg-compass.html.
- **6 forskellige skærmbredder testet** (375px, 390px, 768px tablet,
  1024px, 1440px, 1920px): ingen horisontal scroll, alle fire
  retningselementer korrekt gengivet og proportionale på hver
  breddegrad.
- Klik-test gennemført separat på både mobil- og tabletbredde (ikke kun
  desktop).
- Header, navigation og CTA-knap bekræftet uændret.
- Nul regression på øvrige sider, Cases (fortsat 8) og Foredrag
  (fortsat 13).

Nyt tablet-skærmbillede (768px) taget som supplement til de tidligere
desktop- og mobilbilleder fra RC28.

**Ingen filer ændret i denne runde** — ren genverifikation af det
allerede leverede fix.

## RC28 — forsidens kompas-boks fjernet + bekræftelse af Cases-data

### 1. Forside — den mørke boks bag kompasset

Årsagen: selve kompasbilledet (`mfg-compass-original.jpg/webp`) havde sin
egen, let mørkere navy-baggrund end sidens `--navy`-farve, og
billedwrapperen havde desuden en kraftig `box-shadow`. Sammen skabte det
den synlige, afrundede "boks" bag kompasset.

**Løsning:** Kompasgrafikken (guldstjernen, de tynde cirkler og
gradinddelinger) er udtrukket til en ny transparent PNG/WebP-fil
(`mfg-compass-transparent.png/webp`), hvor selve baggrunden er gjort
100 % gennemsigtig — adskilt fra kompasgrafikken ud fra farvetone (varme
guld-nuancer bevaret, den ensfarvede navy-baggrund fjernet). Boxshadow og
border-radius er fjernet fra `.compass-original-wrap`/`.compass-original-img`,
så kompasset nu sidder direkte på sektionens egen navy-baggrund uden nogen
synlig kant, boks eller skygge — verificeret visuelt på både desktop og
mobil, og det matcher "EFTER"-referencen præcist.

Navigation, kompasrose, de fire overskrifter/undertekster, sektionen
nedenunder, farver, skrifttyper og afstand er alt sammen bevaret uændret.
De oprindelige `mfg-compass-original.jpg/webp`-filer er bevaret i
projektet (ubrugte, men ikke slettet), da ingen anden side refererer til
dem.

### 2. Cases — bekræftelse

Den vedhæftede prompt beskrev samme opgave, som allerede blev
gennemført og leveret i RC27 (erstatning af hele case-datasættet med de
8 nye, godkendte cases fra "CASES til WEB (2) erstat", kategorien
"Forretningsudvikling", `cases_data_version` bumpet, cache-busting
opdateret, testet i frisk og forældet browser).

**Vigtig bemærkning:** Eksempel-indholdet i den vedhæftede
prompt-grafiks "Cases – nyt indhold"-sektion (fx "Bang & Olufsen: Fra
produktsalg til livsstilssalg" under Kultur, "SENG Randers: 286 % vækst
på fire år" under Forretningsudvikling) stemmer **ikke** overens med
den faktiske tekst i den originale, uploadede docx-fil, som jeg
tidligere har gennemgået linje for linje. Jeg har bevidst **ikke**
ændret Cases-indholdet efter grafikkens eksempeltekster, da de ikke er
den bekræftede kilde. Cases-siden viser fortsat de 8 cases, som er
verificeret ordret mod den rigtige fil i RC27 — genbekræftet i denne
runde: stadig 8 cases, stadig præcis 2 pr. kategori, ingen ændringer
foretaget. Sig til, hvis der findes en nyere version af case-filen med
andet indhold, så retter jeg det.

**Ændrede filer:** `index.html` (kompas-billedreference),
`assets/css/style.css` (fjernet box-shadow/border-radius), to nye
billedfiler (`mfg-compass-transparent.png`, `.webp`). Cases er
uændrede i denne runde.

## RC27 — Cases fuldstændigt erstattet med de 8 nye, godkendte cases

**Skriftlig godkendelse:** Morten har bekræftet, at "CASES til WEB (2)
erstat" er den nye, eneste offentlige kilde til Cases, og at
virksomhedsnavnene SENG og Bang & Olufsen må vises åbent på
hjemmesiden.

### Den faktiske fejl

Det tidligere 11-case-datasæt var stadig aktivt i `default-cases.js`.
"Alle"-visningen så ud til at virke, fordi den nye kode teknisk set
kunne rendere data — men da intet nyt datasæt var indsat endnu, var der
reelt ingen fejl i selve filterlogikken at finde; opgaven var at
**erstatte datakilden**, hvilket nu er gjort fuldstændigt.

### Ændringer

- **`assets/js/default-cases.js`:** Fuldstændigt genskrevet. Alle 11
  gamle cases er fjernet permanent — titler, tekster, id'er og billeder.
  Kun de 8 nye cases fra erstatningsfilen findes nu, ordret fra kilden
  (situation → Udfordringen, retning → Mit ansvar, handling → Sådan
  greb jeg det an, resultat → Resultatet, begge indsigter pr. case).
- **Kategori "Forretningsudvikling":** Tilføjet som ny nøgle
  (`forretningsudvikling`) i `content-loader.js`'s kategorivisning,
  brugt konsekvent i data, filterknap (`cases.html`) og visning. Den
  tidligere `forretning`-nøgle er bevaret uændret ved siden af (bruges
  stadig af testimonials' retningsfelt et andet sted i koden — fjernet
  ikke for ikke at risikere at ødelægge noget urelateret).
- **`cases_data_version`:** Bumpet fra `v3-11cases-full` til
  `v4-8cases-seng-bo` i både `content-loader.js` og `admin.js`, så
  browsere med det gamle 11-case-datasæt i LocalStorage automatisk
  opgraderes ved næste besøg.
- **Introtekst og disclaimer på `cases.html`:** Rettet "11 eksempler" →
  "8 eksempler", og disclaimeren er opdateret fra "anonymiserede
  organisationer" til korrekt at nævne SENG og Bang & Olufsen ved navn
  — det ville ellers have modsagt sig selv på siden.
- **Billeder:** De 11 gamle placeholder-billeder er slettet permanent.
  8 nye placeholder-filer under de nye slugs er oprettet (samme
  midlertidige navy/guld-grafik som hidtil, jf. instruks — endelige
  billeder kommer i næste release).
- **Cache-busting:** `?v=rc27` på `default-cases.js`, `content-loader.js`
  og `admin.js` på alle 12 sider.

**Bemærket, men ikke rettet (uden for denne opgaves omfang):** Admin
panelets case-editor (`renderCaseRows` i `admin.js`) bruger stadig et
ældre feltskema (`industry`, `customer`, `direction`/`direction2`,
`gallery`) fra før case-omlægningen i RC23 og er ikke i sync med det
nuværende, rigere datamodel. Det påvirker ikke den offentlige side, som
udelukkende bruger `content-loader.js`, men bør rettes i en senere
runde, hvis Morten ønsker at redigere cases i adminpanelet.

### Test — verificeret automatisk og visuelt

41 automatiserede tjek: præcis 8 cases under "Alle", alle 11 gamle
titler bekræftet væk, alle 4 filtre viser præcis 2 cases hver (tjekket
via reel CSS-synlighed, ikke kun klassenavn), "Forretningsudvikling"
bekræftet som både filterværdi og visningstekst, forsidens 3
fremhævede cases fra det nye datasæt, en simuleret browser med gammel
v3-data opgraderes automatisk til de 8 nye, mobiltest af Kultur- og
Forretningsudviklings-filtre, og nul regression på Foredrag (fortsat 13
foredrag), Compass, Kontakt og øvrige sider.

Verificeret visuelt med skærmbilleder af "Alle" og alle fire filtre.

**Ændrede/nye filer:** `assets/js/default-cases.js` (fuldt genskrevet),
`assets/js/content-loader.js`, `assets/js/admin.js`, `cases.html`
(introtekst, disclaimer, filterknap), ny mappe med 8 billedfiler i
`assets/images/cases/` (11 gamle slettet), samt cache-busting
versionsbump på alle 12 sider.

## RC26 — officiel review-version

Dette er den officielle review-version, klar til levering. Bygget på
RC25 (som allerede indeholdt det ægte, PowerPoint-udtrukne billede til
det 13. foredrag "Når løftet møder hverdagen" — bevaret uændret her, da
det er en bekræftet forbedring, ikke noget der skulle rulles tilbage).
Ingen kodeændringer i denne runde — kun denne changelog-opdatering.

### Kendte udeståender

- Cases anvender midlertidige placeholder-billeder.
- Endelige premium-billeder indsættes i næste release.
- Ingen øvrige funktionelle mangler.

## RC25 — det rigtige billede indsat, Foredrag-siden 100 % færdig

Ren finpudsning af RC24, som eksplicit bedt om. Kun Foredrag-siden er
rørt, og kun de filer, der var nødvendige.

### 1. Det rigtige billede

Udtrukket direkte fra den vedhæftede PowerPoint-fil
("MFGAdvisory - Hjemmesideforside - Når løftet møder hverdagen.pptx").
Slidet indeholdt to billeder — et 256×256 MFG-logo (samme mønster som de
øvrige 12 foredrags-slides) og selve forsidebilledet i fuld opløsning
(1672×929). Sidstnævnte er udtrukket og gemt under samme filnavn og
kvalitetsindstilling (JPEG, kvalitet 88) som de øvrige 12 foredragsbilleder
— ingen placeholder, intet logo, ingen midlertidig grafik.

Verificeret direkte: kortets billede har `naturalWidth: 1672,
naturalHeight: 929` — den faktiske PowerPoint-eksport, ikke den tidligere
900×560 genererede placeholder. Samme beskæring (`object-fit:cover`,
140px kort-højde) og samme visning i både kort og modal som de øvrige 12.

### 2-3. Korthøjde og knapper

Allerede løst og verificeret i RC24 (flex-column-layout, knap-række med
`margin-top:auto`, samt CSS-specificitetsrettelsen, der fik filtrering
til at fungere korrekt sammen med højde-fixet). Genverificeret i denne
runde med det rigtige billede indsat: alle 13 korts billeder har
identisk 140px højde, og knapperne er pixel-præcist justeret på tværs af
alle rækker, inklusive rækken med det nye foredrag.

### 4. Kultur-filter

Bekræftet ved faktisk synlighedstest: filteret viser præcis disse tre,
ikke flere, ikke færre:
- Kultur – det vi gør, accepterer og gentager
- Kundeoplevelsen er ikke kundeservices ansvar
- Når løftet møder hverdagen

### 5. Modal

Identisk opbygget med de øvrige 12: billede, kategori, titel, teaser,
"Foredraget sætter fokus på" (4 punkter), "Deltagerne får med sig",
CTA-knap. Ingen layoutforskelle — samme kode, samme CSS-klasser.

### 6. Ikke ændret

Cases, Forsiden, Mennesker, Ledelse, Kultur (siden), Forretning, Om
Morten, Kontakt — bekræftet ved diff mod RC24: **kun** billedfilen
`assets/images/foredrag/naar-loftet-moder-hverdagen.jpg` er ændret.
Ingen anden fil i hele projektet er rørt i denne runde.

### 7. Test — verificeret både automatisk og visuelt

30 automatiserede tjek, herunder eksplicit kontrol af, at billedets
faktiske pixel-dimensioner matcher den ægte PowerPoint-eksport (ikke
placeholderen). Derudover verificeret **visuelt** ved at se de faktiske
skærmbilleder (ikke kun stole på automatiske tjek) — herunder fandt jeg
undervejs to fejl i min egen testscript (ikke i selve sitet: en
element-reference, der var blevet forældet efter en sidegenindlæsning,
og en cookiebanner, der blokerede et klik) og rettede dem, før jeg
konkluderede noget.

Testet på desktop (1400px), tablet (768px) og mobil (375px): ingen
horisontal scroll, alle 13 foredrag til stede, ingen konsolfejl, ingen
JavaScript-fejl.

**Eneste ændrede fil:** `assets/images/foredrag/naar-loftet-moder-hverdagen.jpg`

## RC24 — kort-højdejustering + 13. foredrag under Kultur

### Vigtigt forbehold om billedet

Filen "MFGAdvisory - Hjemmesideforside - Når løftet møder hverdagen.pptx"
var **ikke** vedhæftet i beskeden, jeg modtog. Jeg har derfor brugt et
placeholder-billede (samme navy/guld-stil som de øvrige 12 foredrag,
`assets/images/foredrag/naar-loftet-moder-hverdagen.jpg`), så resten af
arbejdet ikke blev blokeret. Send den rigtige PowerPoint-fil, så
udskifter jeg billedet — filstien og alt kode omkring det er allerede på
plads, så det kun kræver at erstatte selve billedfilen.

### 1. Kort-højdejustering

Løst med `display:flex;flex-direction:column` på kortet og
`margin-top:auto` på knap-rækken, scopet **udelukkende** til
`#foredrag-oversigt` (Foredrag-siden), så Cases-siden — som deler samme
CSS-klasse til sine kort — ikke påvirkes.

**En reel fejl fundet og rettet undervejs:** Den nye, ID-scopede regel
havde højere CSS-specificitet end den eksisterende
`.talk-card.is-hidden-by-filter{display:none}`-regel, som filtrene
bruger til at skjule kort. Det betød, at filtreringen holdt op med at
virke **visuelt**, selvom mit første automatiske tjek (fejlagtigt) bestod,
fordi det kun tjekkede CSS-klassen og ikke den faktiske synlighed. Fanget
ved at faktisk se på et skærmbillede af det filtrerede resultat — rettet
ved at gøre skjule-reglen til `!important`, og mine tests er efterfølgende
skærpet til at tjekke `getComputedStyle().display` i stedet for kun
klassen, så denne fejltype ikke kan glide igennem stille igen.

Verificeret med præcise pixel-målinger: kort i samme række har nu
identisk højde (fx 443px/443px/443px), og knapperne flugter vandret på
pixel (samme `top`-position på tværs af alle kort i rækken). På mobil
har kort naturlig højde, men knap-rækken ligger stadig nederst i hvert
enkelt kort.

### 2. Nyt foredrag under Kultur

"Når løftet møder hverdagen" tilføjet med præcis den angivne tekst
(teaser, 4 fokuspunkter, udbyttetekst), kategori Kultur, sort_order 13.

### 3. Kategoritælling

Alle: 13 · Mennesker: 3 · Ledelse: 3 · Kultur: 3 · Forretning: 4 —
bekræftet ved faktisk synlighedstest af hvert filter.

### 4. Seeding/versionering

`talks_data_version` bumpet fra `v2-12talks-focus-takeaway` til
`v3-13talks-kultur-loftet` i både `content-loader.js` og `admin.js`.
Testet specifikt: en browser med gammel v2-data i LocalStorage bliver
automatisk opgraderet til de 13 aktuelle foredrag ved næste besøg.

Cache-busting bumpet til `?v=rc24` for de filer, der faktisk ændrede sig
(`style.css`, `default-talks.js`, `content-loader.js`, `admin.js`) på
alle 12 sider. Øvrige, uændrede filers versionsnumre er ikke rørt.

### Test gennemført

33 automatiserede tjek: alle 13 foredrag til stede, filtrenes præcise
optælling (verificeret via faktisk CSS-synlighed), det nye foredrags
modal med korrekt billede og fuldt indhold, knap-flugtning testet med
pixel-præcision på tværs af flere rækker, ingen tekstafskæring, ingen
horisontal scroll ved mobil/tablet/desktop, stale-data-opgradering
bekræftet, og ingen regression på Cases (stadig 11 cases), Compass,
kontakt eller øvrige sider.

**Ændrede/nye filer:** `assets/js/default-talks.js` (nyt foredrag),
`assets/js/content-loader.js` og `assets/js/admin.js` (version bumpet),
`assets/css/style.css` (højde-fix + specificitetsrettelse), ny billedfil
`assets/images/foredrag/naar-loftet-moder-hverdagen.jpg`, samt
version-bump på script-/style-referencer på alle 12 sider (kun
versionsnummer ændret — bekræftet ved diff, ingen indholdsændringer på
Cases eller de øvrige sider).

## RC23 — Cases-siden genopbygget med alle 11 cases

Bygget videre på RC22 (Foredrag-verifikationen). Ingen ændringer i
Supabase, Vercel, Google Analytics, Foredrag, Compass eller
kontaktoplysninger.

### Liste over alle 11 cases (kategori · sort_order)

1. **Mennesker** — Fra høj personaleomsætning til en onboarding, der skabte tilknytning
2. **Mennesker** — Retail Academy gjorde læring til en del af driften
3. **Mennesker** — Fra reaktiv kundeservice til fælles ansvar for kundeoplevelsen
4. **Ledelse** — Én ledelsesrytme på tværs af 32 butikker
5. **Ledelse** — Ledelse gennem indflydelse – ikke organisationsdiagram
6. **Ledelse** — Lokalt mandat uden at miste den fælles retning
7. **Kultur** — Kundeløftet blev gjort til adfærd – ikke en plakat
8. **Kultur** — Fra lokale sandheder til en åben performancekultur
9. **Forretning** — Fra uensartet drift til målbar kommerciel fremdrift
10. **Forretning** — Fra 6 til 37 mio. kr. i årlig omsætning
11. **Forretning** — 15 nøgleforretninger skabte 32 procent vækst

Fordeling: 3 Mennesker, 3 Ledelse, 2 Kultur, 3 Forretning — som krævet.

### Indsigter hentet fra 8-case-filen (kun hvor de klart matcher)

| Case | Indsigt |
|---|---|
| 1. Onboarding/tilknytning | "Tilknytning skabes længe før opsigelsen" |
| 2. Retail Academy | "Træning skal kunne bruges mandag morgen" |
| 3. Kundeservice på tværs | "Kunden ser én virksomhed – ikke jeres siloer" |
| 4. Ledelsesrytme | "Strategi skaber først værdi, når den får en rytme" |
| 5. Ledelse gennem indflydelse | "Du kan ikke kommandere dig til ejerskab" |
| 6. Lokalt mandat | "Frihed virker bedst med en fælles retning" |
| 7. Kundeløftet som adfærd | "Tydelighed gør ansvar muligt" |
| 8. Åben performancekultur | "Åbenhed er også sund forretning" |
| 10. Fra 6 til 37 mio. | "Vækst kræver flere ben på taburetten" |

Case 9 og 11 fik **ingen** ekstra indsigt — der var ikke et tydeligt nok
match blandt de foretrukne eksempler, og opgaven bad om at bruge dem
"kun, når de klart matcher". Ingen case har mere end én indsigt (under
den tilladte grænse på to).

### Tal harmoniseret (11-case-filen vandt, som krævet)

Ingen reelle uoverensstemmelser blev fundet mellem de to filers *tal* —
8-case-filen bruger stort set de samme nøgletal. Der var dog stilistiske
forskelle (fx "55 procentpoint / næsten 79 % relativ reduktion" i
8-case-filen for personaleomsætning), som **ikke** er brugt — kun
11-case-filens egne formuleringer ("70 % til 15 %", "+15 pp") indgår.
Alle tal på siden stammer udelukkende fra 11-case-filen: ca. 30 ledere,
32 butikker, NPS +10 pp, eNPS +15 pp, personaleomsætning 70 %→15 %, 6 år
for udviklingen fra 6 til 37 mio. kr., og "flere opnåede TOP50" (ikke at
alle 15 gjorde det).

### Fortrolighed — bekræftet

Side 15 i 11-case-filen (mærket "INTERNT – SKAL IKKE UPLOADES") er
**ikke** brugt til noget som helst. Den blev udelukkende brugt til at
lokalisere og udelukke sig selv fra al videre læsning. Der er kørt en
eksplicit søgning gennem hele projektmappen efter "SENG", "Bang &
Olufsen"/"Bang og Olufsen" og "Randers" — ingen af delene findes noget
sted i de leverede filer (det ene "286"-hit, som blev fundet, er en
kommentar i koden, der forklarer, HVORFOR den case bevidst er udeladt —
ikke selve indholdet). Case-emnet "286 % vækst på ét år" fra
8-case-filen er ikke oprettet som case 12 eller nogen andre steder.

### Sprog

Kildeteksten fra 11-case-filen bruger allerede konsekvent "jeg" for
Mortens egne, individuelle handlinger ("Jeg etablerede…", "Mit
ansvar…") og "vi" specifikt, når det beskriver en fælles indsats sammen
med det daværende team ("Vi fulgte udviklingen…", "Vi indførte
SLA'er…") — præcis det mønster, opgaven bad om at bevare. Der er derfor
**ikke** foretaget blind søg-og-erstat; den oprindelige, korrekte
sprogbrug er bevaret uændret.

### Struktur og filtrering

Løsning valgt: **modal** (samme arkitektur som Foredrag-siden, for
konsistens og for at undgå unødig kompleksitet). Hvert kort viser
kategori, titel, teaser, op til 3 nøgletal, "Læs hele casen" og "Book en
samtale". Fuld case ved klik: kategori, organisationstype/omfang, titel,
teaser, Udfordringen, Mit ansvar, Sådan greb jeg det an, nøgletal,
Resultatet, central indsigt (hvor relevant), Sådan kan MFG Advisory
hjælpe, og CTA. Filtrene (Alle/Mennesker/Ledelse/Kultur/Forretning) er
testet med præcis optælling ved alle bredder.

### Forside

Tre fremhævede cases, der repræsenterer tre forskellige retninger
(Mennesker, Ledelse, Forretning), med link til hele Cases-siden.

### Billeder

11 selvstændige placeholder-billeder (ét pr. case, ikke delt), i
`assets/images/cases/`, samme navy/guld-stil som Foredrag-billederne, så
Morten senere kan udskifte ét ad gangen.

### Test gennemført

79 automatiserede tjek: alle 11 cases til stede med korrekt titel,
kategori, teaser; filtrenes præcise optælling (3/3/2/3); ingen
horisontal scroll ved 375/390/768/1024/1440px; mobil-modal med internt
scroll bekræftet; forsidens 3 fremhævede cases; admin viser nu 11 cases;
Foredrag, Compass og kontaktoplysninger bekræftet uændrede. Manuel
gennemgang af de fire specifikt efterspurgte cases (01/04/08/10) med
skærmbilleder af både fuld oversigt og hver enkelt åbne case.

**Ændrede/nye filer:** Ny fil `assets/js/default-cases.js` (alle 11
cases), ny mappe `assets/images/cases/` (11 billeder). Ændret:
`cases.html` (ny intro, filtre, fjernet de fire gamle
eksempel-case-teasere), `index.html` (ny fremhævet cases-sektion),
`assets/js/content-loader.js` (fuldt genskrevet case-rendering + filtre
+ seeding), `assets/js/admin.js` (tilsvarende seeding-logik),
`assets/css/style.css` (disclaimer- og nøgletal-styling), samt
script-tags på alle 11 offentlige sider + admin.html.

## RC22 — fuld verifikation mod PowerPoint-facittet

Gennemført en systematisk, feltvis sammenligning af alle 12 foredrag mod
de to originale PowerPoint-filer (ikke stikprøve — alle felter for alle
12). Sammenligningen blev lavet programmatisk (Python + python-pptx),
ikke ved øjemål, for at undgå transskriptionsfejl.

### Verifikationstabel (alle 12 foredrag, alle felter)

| Foredrag | Titel | Undertitel | Teaser | 4 fokuspunkter | Udbytte | Billede | Kategori | Link |
|---|---|---|---|---|---|---|---|---|
| Mennesker – fra potentiale til performance | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ Mennesker | ✅ |
| Tilknytning – det, der får mennesker til at vælge jer igen | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ Mennesker | ✅ |
| Psykologisk tryghed – når sandheden kommer frem i tide | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ Mennesker | ✅ |
| Ledelse – fra retning til resultater | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ Ledelse | ✅ |
| Ledelse uden formel magt – fra position til indflydelse | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ Ledelse | ✅ |
| Når lederen bliver organisationens flaskehals | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ Ledelse | ✅ |
| Kultur – det vi gør, accepterer og gentager | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ Kultur | ✅ |
| Kundeoplevelsen er ikke kundeservices ansvar | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ Kultur | ✅ |
| Forretningsudvikling – når værdien bliver virkelig | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ Forretning | ✅ |
| Fra 6 til 37 mio. kr. – sammen med ejeren | ✅* | ✅ | ✅ | ✅* | ✅ | ✅ | ✅ Forretning | ✅ |
| Strategi virker først, når den kan ses mandag morgen | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ Forretning | ✅ |
| The MFG Compass™ – navigation under pres | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ Forretning | ✅ |

**\* Én afvigelse fundet og rettet:** I foredraget "Fra 6 til 37 mio. kr."
stod der i den tidligere version "– blandt andet hotline 08–22" i det
første fokuspunkt. PowerPoint-kilden bruger forkortelsen "– bl.a. hotline
08–22". Rettet til at matche kildeteksten ordret.

**Nyt felt tilføjet:** Hver titel i PowerPoint-filerne viste sig at være
opdelt i to linjer (fx "Forretningsudvikling" + "– når værdien bliver
virkelig"). Den fulde titel (begge linjer) var allerede korrekt bevaret
som `title` fra tidligere runder, men undertitlen (linje 2) var ikke
gemt som et selvstændigt, kontrollerbart felt. Tilføjet som `subtitle`
til alle 12 foredrag, udtrukket ord for ord fra kilden, og vist tydeligt
i modalen lige under titlen.

**Billeder:** Bekræftet uændrede fra RC20 — stadig det korrekte,
unikke billede fra det matchende slide for hvert af de 12 foredrag.

**Kategori og forespørgselslink:** Alle 12 bekræftet korrekt kategoriseret
(3 Mennesker, 3 Ledelse, 2 Kultur, 4 Forretning) og alle forespørgselslinks
peger korrekt på `kontakt.html` med foredragets titel forudfyldt.

### Test af mobil-scroll og tekstafskæring

Testet specifikt for ét foredrag i hver kategori (Mennesker, Ledelse,
Kultur, Forretning) ved 375px bredde: ingen tekst er beskåret vandret i
noget element, modalens panel er scrollbart (`overflow-y:auto`), og —
vigtigst — efter at have scrollet til bunden af modal-panelet bliver
"Forespørg på foredraget"-knappen bekræftet fuldt synlig og korrekt
positioneret. Screenshots taget af både desktop og mobil for alle fire
kategorier.

**Ændrede filer (kun disse to):** `assets/js/default-talks.js` (én
tekstrettelse + `subtitle`-felt på alle 12), `assets/js/content-loader.js`
(viser nu undertitlen i modalen). Alle øvrige sider og funktioner
bekræftet uændrede.

**Vigtigt forbehold:** Min billedvisning virkede desværre stadig ikke i
denne session, så jeg kunne ikke selv se de otte skærmbilleder (4
desktop + 4 mobil). De er vedhæftet separat til din egen visuelle
kontrol.

## RC21 — den præcise fejlårsag fundet og rettet

**Den præcise fejlårsag:** `seedTalksIfNeeded()` i både
`assets/js/content-loader.js` og `assets/js/admin.js` tjekkede kun
`if (content.talks) return` — altså "findes der overhovedet allerede
foredragsdata i browseren?". Hvis svaret var ja, blev den nye
12-foredrags-datamodel **aldrig indlæst**, uanset hvor gammel eller
forældet den eksisterende data var.

Enhver browser, der havde besøgt en tidligere version af sitet
(RC15–RC17, som brugte et andet dataskema med 7 foredrag og feltnavne
som `excerpt`/`body` i stedet for de nuværende `teaser`/`focus`/
`takeaway`), ville derfor blive "fanget" med den gamle data for altid.
Da modal-visningen i RC18-RC20 korrekt leder efter `t.teaser`, `t.focus`
og `t.takeaway` — felter, der **slet ikke findes** på den gamle,
fastlåste data — blev disse sektioner naturligt tomme. Det er ikke en
fejl i selve rendering-koden (feltnavnene har hele tiden matchet
korrekt, bekræftet ved direkte gennemgang af begge filer), men i
betingelsen for, HVORNÅR data bliver opdateret i browserens gemte lager.

**Rettelsen:** Indført en versioneret seed-mekanisme
(`talks_data_version`). Hvis den gemte version ikke matcher den
nuværende (`v2-12talks-focus-takeaway`), overskrives browserens gemte
data automatisk med den aktuelle 12-foredrags-model — uanset hvad der
lå der i forvejen. Dette er verificeret med en test, der specifikt
genskaber scenariet: en frisk browser med forudindsat, forældet
1-foredrags-data injiceret **før** noget som helst af sidens eget
script kører (præcis som en reelt forældet browser ville opføre sig) —
efter rettelsen viser siden korrekt alle 12 aktuelle foredrag.

**Om cache/service worker (punkt 6-7 i din forespørgsel):** Dette
projekt har **ingen** service worker og har aldrig haft det — bekræftet
ved eftersøgning i hele projektet. Den reelle årsag var som beskrevet
ovenfor: forældet data i browserens LocalStorage, ikke en
service-worker-cache. For alligevel at sikre, at GitHub Pages/browseren
ikke viser gamle **filer** efter en deployment, er alle lokale
JS/CSS-referencer på samtlige 12 sider nu forsynet med en
versionsstreng (`?v=rc21`), så browseren tvinges til at hente friske
filer, næste gang du deployer en ny version.

**Bekræftelse:** Tekst og billede vises nu sammen for alle 12 foredrag —
testet enkeltvis for hvert af dem (ikke stikprøve): kategori, titel,
teaser, billede, "Foredraget sætter fokus på" med præcis 4 punkter,
"Deltagerne får med sig" med udbyttetekst, og "Forespørg på
foredraget"-knappen. Specifikt bekræftet for de tre navngivne foredrag
("Ledelse – fra retning til resultater", "Tilknytning – det, der får
mennesker til at vælge jer igen", "The MFG Compass™ – navigation under
pres") i et scenarie, der aktivt genskaber den forældede databug.

**Ændrede kodefiler:** `assets/js/content-loader.js`,
`assets/js/admin.js` (den reelle rettelse), samt alle 12 HTML-filer
(kun tilføjet `?v=rc21` på script-/stylesheet-referencer — ingen andet
indhold ændret i disse filer).

**Vigtigt forbehold:** Min billedvisning fungerede desværre slet ikke i
denne session (bekræftet ved gentagne forsøg), så jeg kunne ikke selv se
skærmbillederne af de tre modaler. De er vedhæftet separat til din egen
visuelle kontrol.

## RC20 — de rigtige billeder fra PowerPoint indsat

Bygget videre på RC19. Kun billedfilerne er ændret — ingen kode, ingen
andre sider.

**Baggrund:** Ved nærmere undersøgelse af de to PowerPoint-filer viste
det sig, at hvert af de 12 slides faktisk indeholder sit eget unikke
billede (`image2.png` til `image7.png` i hver fil — ikke kun det
genbrugte logo). Farvekompleksitets-analyse af alle 12 billeder (tusindvis
af unikke farver i selv små stikprøver, i alle regioner af billedet)
bekræftede, at der er tale om rigtige fotografiske/grafiske billeder uden
indlejret tekst — ikke tekst-tunge slide-baggrunde. De er derfor
velegnede til brug, som du bad om.

**Gjort:** Udtrukket det korrekte billede fra det korrekte slide for
hvert af de 12 foredrag (kortlagt via slidets faktiske titeltekst, ikke
gættet ud fra rækkefølge), og erstattet de tidligere placeholder-billeder
1:1 — samme filnavne som i RC18/19, så ingen kode skulle ændres.

**Verificeret:** Alle 12 billeder indlæser korrekt, ensartet
kort-højde bevaret, alt-tekst intakt, og — vigtigst — hver "Læs
mere"-modal viser nu bekræftet **det samme billede** som det
tilhørende kort (testet enkeltvis for alle 12, ikke kun stikprøve).
Fuld regression af mobil/tablet/desktop og alle øvrige sider bekræftet
uændret.

**Ændrede filer:** Kun de 12 billeder i `assets/images/foredrag/`.

## RC19 — "Læs mere"-modal gennemgået og styrket

Bygget videre på RC18 (GitHub-versionen), som bekræftet. Ingen Supabase-,
database- eller Vercel-arbejde genoptaget.

**Baggrund:** De fleste af de efterspurgte elementer (billede, kategori,
teaser, fokuspunkter, udbyttetekst, forespørgselsknap) var allerede en
del af RC18's kode — men for at være helt sikker, gennemgik jeg hvert
eneste punkt igen, for **alle 12 foredrag hver for sig** (ikke kun en
enkelt stikprøve), og strammede desuden op de steder, hvor det gav
mening:

- **Mobilbredde:** Øget fra ~88% til ~95% af skærmbredden, så modalen nu
  tydeligere fylder "næsten hele mobilens bredde".
- **Billedet:** Gjort mere fremtrædende (større højde på desktop, 240px)
  og sikret at det altid vises som blok (ikke klemt af omkringliggende tekst).
- **Tydeligere sektioner:** Tilføjet en synlig skillelinje før
  "Foredraget sætter fokus på", så teaser, fokuspunkter og udbytte
  fremstår som klart adskilte afsnit, ikke én lang tekstblok.

**Punkt-for-punkt bekræftet (108 automatiserede tjek, alle 12 foredrag
testet individuelt, ikke kun ét):**
- ✅ Kategori, titel, teaser, billede, "Foredraget sætter fokus på" + 4
  punkter, "Deltagerne får med sig" + udbytte, og "Forespørg på
  foredraget"-knap — til stede i **alle 12** modaler.
- ✅ Billedet er synligt og responsivt (bekræftet på både desktop og mobil).
- ✅ På mobil (390×700, en bevidst kort skærmhøjde for at fremtvinge
  overløb): modalens indhold **scroller internt** i kortet
  (`overflow-y:auto` på selve panelet) — og siden bagved scroller
  bekræftet **ikke** med.
- ✅ Modalens z-index (3000) ligger sikkert over den mobile
  sticky-bookingknap (1500) — dækker den aldrig.
- ✅ Luk fungerer via krydset, via klik uden for kortet (baggrunden) og
  via Escape-tasten — alle tre testet separat.
- ✅ Den mørke baggrunds-overlay er bevaret uændret.
- ✅ Det korte foredragskort på oversigten viser fortsat **kun** den korte
  teaser — bekræftet, at fokuspunkter og udbyttetekst ikke er synlige,
  før der klikkes "Læs mere".
- ✅ Testet på tablet (768px) og desktop (1440px) — ingen horisontal
  scroll noget sted.

**Indhold:** Genbruger de 12 foredrag fra de to PowerPoint-filer, som
allerede blev lagt ind i RC18 — intet indhold er ændret i denne omgang,
kun selve modal-visningen.

**Ændrede filer (kun disse to):** `assets/css/style.css`,
`assets/js/content-loader.js`. Alle øvrige sider, Compass-modulet og
funktioner er bekræftet uændrede ved diff og regressionstest.

## RC18 — Foredragssiden udvidet til 12 foredrag med filtre

Bygget videre på RC17. Ingen Supabase-, Vercel- eller databaseændringer.

**Indhold:** Alle 12 foredrag fra de to PowerPoint-filer er lagt ind
(erstatter de tidligere 7). Billederne i PowerPoints var fulde
slide-baggrunde med indlejret tekst/branding — ikke enkeltstående
foto-emner — så jeg har genereret 12 nye, selvstændige placeholder-billeder
(ét pr. foredrag, navy/guld, MFG Advisory-mærket) i stedet for at
genbruge dem, for at undgå tekst, der bliver ulæselig på mobil, præcis
som krævet.

**Struktur:**
- **Fælles introduktion:** Ny overskrift og to intro-afsnit, plus CTA
  "Forespørg på et foredrag".
- **"Det kan I forvente":** Ny sektion med de to afsnit og de fire punkter,
  vist som en 2×2-gitter med afkrydsningsikon.
- **Kategorifiltre:** "Alle / Mennesker / Ledelse / Kultur / Forretning"
  som klikbare faner over foredragsoversigten. Fordeling: 3 Mennesker,
  3 Ledelse, 2 Kultur, 4 Forretning (The MFG Compass™-foredraget er
  placeret under Forretning, da dets indhold handler om strategisk
  navigation på tværs af forretningen).
- **Kort:** Kategori, titel, teaser, billede, "Læs mere" og "Forespørg" —
  ét fælles design for alle 12, som krævet. Den fulde tekst (de fire
  fokuspunkter + "Deltagerne får med sig") vises først i en modal efter
  klik på "Læs mere" — bekræftet ikke synlig på selve kortet.
- **Skræddersyet foredrag:** Ny sektion nederst med den angivne tekst.
  CTA'en "Tal med mig om et særligt foredrag" fører til kontaktformularen
  med "Forespørgsel på skræddersyet foredrag" forudfyldt.
- **Booking:** Hvert foredrags egen "Forespørg"-knap forudfylder fortsat
  "Forespørgsel på foredrag: [titel]" — testet for flere forskellige
  foredrag, ikke kun det første.

**Sprog:** Gennemgået for "vi/vores/os". Ét foredrags titel indeholder
bevidst "vi" ("Kultur – det vi gør, accepterer og gentager") — det er den
eksakte, angivne titel, og det er en generel sandhed om organisationskultur
(ligesom det tidligere bevarede "hvordan vi gør her" på selve
Kultur-siden), ikke MFG Advisory, der taler om sig selv. Ellers er al ny
tekst skrevet i "jeg/mig/min/mine".

**Ændrede/nye filer:** `foredrag.html`, `assets/js/default-talks.js`
(fuldt genskrevet med de 12 foredrag), `assets/js/content-loader.js`
(nye felter: teaser/fokus/deltagerudbytte, samt filter-logik),
`assets/css/style.css`, samt ny mappe `assets/images/foredrag/` med 12
placeholder-billeder. Alle øvrige sider er bekræftet urørt (verificeret
ved diff).

**Testet:** 375px, 390px, 768px, 1024px, 1440px — 46 automatiserede tjek:
alle 12 foredrag til stede med korrekte titler, filtrene giver præcis
den rigtige optælling pr. kategori på alle testede bredder, "Læs mere"
åbner korrekt med fokuspunkter og udbytte, to forskellige
kontaktformular-forudfyldninger (individuelt foredrag og skræddersyet),
alle billeder indlæst med ensartet højde og meningsfuld alt-tekst, ingen
horisontal scroll, forsidens fremhævede foredrag og Compass-modulet
uændrede, admin viser nu automatisk 12 foredrag.

## RC17 — navigationsfix, læsbart kompas, "jeg"-sprog, foredragsbilleder

Bygget videre på RC15 (den sidst fuldt selvstændige version uden
Supabase-afhængighed), som eksplicit bedt om. Ingen database-, Supabase-
eller Vercel-ændringer.

### 1. Desktop-menu rettet
Jeg kunne ikke reproducere den præcise "rside"/"Konta"-afskæring i mit
testmiljø (kan ikke hente den rigtige Google Font DM Sans der), men
målingerne viste, at den tidligere løsning kun havde nul til få pixels
margin ved almindelige desktopbredder — for tæt på kanten uanset
skrifttype. Løst mere robust ved at: forenkle den tidligere skrøbelige
3-trins skriftstørrelse til én konsekvent størrelse, og frigøre plads fra
telefonnummer/bookingknap-området (mindre mellemrum, lidt mindre
knap-padding — kun i navigationen, ikke globalt). Verificeret med 45
automatiserede tjek ved 960-1920px: alle 9 menupunkter korrekt stavet og
fuldt synlige, intet overlap, telefonnummer og bookingknap altid synlige.
Mobilmenuen er kun testet, ikke ændret.

### 2. "SKAB RETNING" gjort læsbar
Årsagen: teksten brugte en sand/gylden farve (`#cbb892`), næsten
identisk med selve kompasstjernens guldfarve. Rettet til hvid tekst,
skriftvægt øget fra 600 til 800, kraftigere tekstskygge, samt en
diskret mørk baggrund bag teksten. Kompasgrafikken, farverne og den
øvrige tekst er uændret. Bekræftet på både desktop og mobil.

### 3. "Vi" → "jeg" gennemgået manuelt (ikke blind søg-og-erstat)
Gennemgået linje for linje på Forside, Mennesker, Ledelse, Kultur,
Forretning, Foredrag, Kontakt og The MFG Compass™-siden, samt
cookiebanner-teksten. Cases og Om Morten indeholdt ingen "vi" i forvejen
(Om Morten er allerede skrevet i tredje person). Metadata/SEO-tekster
var allerede fri for "vi".

**Bevidst IKKE ændret** (efter instruksen om kunde-/fællesskabs-undtagelser):
- Kultur-siden: "Sammen skaber vi tydeligere fælles standarder" — eksplicit
  fælles formulering ("sammen").
- Kultur-siden: "hvordan vi gør her" — et citat, der illustrerer kundens
  egen interne forvirring, ikke MFG Advisory, der taler om sig selv.

Fandt og rettede undervejs en egen grammatikfejl ("mit rådgivning" skulle
have været "min rådgivning", da "rådgivning" er et fælleskønsord).

### 4. Teaser og billede til hvert foredrag
Hvert af de 7 foredrag havde allerede en kort teaser (feltet `excerpt`).
Det manglende var billeder. Tilføjet:
- **7 selvstændige placeholder-billeder** (ikke én delt fil), i
  `assets/images/foredrag/[foredragets-slug].jpg` — ét pr. foredrag, så
  Morten senere kan udskifte ét enkelt billede uden at røre de andre.
  Neutral, brand-tilpasset navy/guld-grafik med MFG Advisory-mærke.
- `image_url` tilføjet i `assets/js/default-talks.js` (samme simple
  datafil-tilgang som resten af foredrags-systemet — ingen admin- eller
  databaseændring).
- Rettet manglende alt-tekst (var tom `alt=""`) til at bruge foredragets
  titel, både på kortet og i detaljevisningen.
- Genbruger eksisterende `.case-teaser img`-styling: fast 140px højde,
  `object-fit:cover` (ingen forvrænget beskæring), samme afrundede
  hjørner som resten af siden, fuldt responsivt. Verificeret med 18 tjek
  ved 375/768/1440px: alle 7 billeder indlæses, ensartet højde, korrekt
  alt-tekst, ingen layoutforskydning.

### Billedfiler Morten senere skal levere
De 7 filer i `assets/images/foredrag/` (navngivet efter foredragets
emne) er placeholders. Til rigtige billeder: behold samme filnavne og
samme liggende 900×560-format (eller tættere på), så de passer ind uden
kodeændringer — blot upload de rigtige filer med de samme filnavne.

### Kvalitetstest
375px, 768px, 1440px — alle 11 sider, 36 regressions-tjek: ingen
horisontal scroll, interne links (Compass, Foredrag-nav) fungerer,
admin-login fungerer uændret, ingen konsolfejl.

**Ændrede/nye filer:** `assets/css/style.css`,
`assets/js/content-loader.js`, `assets/js/cookie-consent.js`,
`assets/js/default-talks.js`, `index.html`, `mennesker.html`,
`ledelse.html`, `kultur.html`, `forretning.html`, `foredrag.html`,
`kontakt.html`, `mfg-compass.html`, samt ny mappe
`assets/images/foredrag/` (7 billeder). Cases og Om Morten er urørt
(bekræftet ved diff — ingen "vi" fandtes der i forvejen).

## RC15 — bekræftelse af admin-adgang + reel bug rettet

**Baggrund:** Der blev spurgt, om admin-login overhovedet findes. Svar:
Ja — se den fulde bekræftelse i chatten. Under verifikationen fandt jeg
en reel bug: åbnes `admin.html` i en helt frisk browser (der aldrig har
besøgt selve hjemmesiden), viste Foredrag-sektionen **0** rækker i
stedet for de 7 standardforedrag, fordi den logik, der forudfylder dem
("seeding"), kun lå i `content-loader.js` (indlæst på de offentlige
sider) — ikke i selve adminpanelet.

**Rettelsen:** Standardforedragene flyttet til én fælles, delt fil
(`assets/js/default-talks.js`), som nu indlæses på **både** alle
offentlige sider og admin.html. Adminpanelets egen opstartslogik tjekker
nu selv, om foredrag mangler, og forudfylder dem uafhængigt af, om den
offentlige side er besøgt først. Ingen datamodel, tekster eller
funktionalitet er ændret — kun hvor standarddata bliver indlæst fra.

**Testet:** En helt frisk browser-session, der åbner `admin.html` som
allerførste side, viser nu korrekt 7 foredrag — bekræftet direkte. Den
offentlige Foredrag-side er samtidig bekræftet at virke uændret. Fuld
CRUD-cyklus (opret → udgiv → vises offentligt → slet → oprydning
verificeret) testet igennem for **både** Cases og Foredrag. Alle 11
sider bekræftet at loade uden fejl, Compass-modulet uændret.

**Ændrede/nye filer:** Ny fil `assets/js/default-talks.js`. Ændret:
`assets/js/admin.js`, `assets/js/content-loader.js`, samt ét nyt
script-tag på alle 11 offentlige sider + admin.html (bekræftet ved diff
— ingen andre ændringer i disse filer).

## RC14 — mere luft på de fire Compass-sider

Ren spacing-justering på Mennesker, Ledelse, Kultur og Forretning.
CTA-knappen "Book en samtale" er bevaret uændret på alle fire sider.

**Ændringer:**
- **30px** mellem sidste brødtekst og CTA-knappen (inden for det ønskede
  24-32px-interval).
- **20px** mellem CTA-knappen og Compass-navigationen
  (Mennesker/Ledelse/Kultur/Forretning-fanerne) (inden for det ønskede
  16-24px-interval).
- Nøjagtig samme mål på alle fire sider — verificeret identisk ved test.

**Sådan blev det gjort:** Én ny CSS-klasse (`dir-hero-actions`) tilføjet
til CTA-rækken på hver af de fire sider, plus to nye linjer CSS. Ingen
tekst, farve eller funktionalitet er ændret — bekræftet ved diff: hver
af de fire HTML-filer har præcis dette ene, identiske linjeskift, intet
andet. Kontakt, Om Morten, Cases, Foredrag, 404 og forsiden bruger samme
`.hero-actions`-klasse men fik **ikke** den nye spacing, da klassen er
scopet specifikt til de fire Compass-sider (holdt adskilt via
`.dir-switch`, som kun findes på disse fire).

**Testet:** 375px, 390px, 430px, 768px, 1024px, 1440px — 26 automatiserede
tjek (præcise pixel-mål på alle fire sider, CTA-knap og Compass-navigation
bekræftet intakte og funktionelle, ingen horisontal scroll, Compass og
admin uændret).

## RC13 — designforfinelse af Foredrag-siden

**Ændrede filer (kun disse tre):** `assets/css/style.css`,
`assets/js/content-loader.js`, `foredrag.html` (kun én ny CSS-klasse
tilføjet til hero-sektionen — ingen tekstændringer). Cases, Compass,
kontaktoplysninger, de syv foredragstekster og login er 100% urørt,
bekræftet ved diff.

**1. Desktop-læsbarhed:** Foredrag-sidens indholdsbredde er øget fra
1180px til 1320px (kun på denne side — resten af sitet er uændret).
Kortene har fået mere indvendig luft (32px/28px padding, op fra 26/24),
større titel- og brødtekst, og et 3-kolonne-grid ved ≥1200px i stedet for
2, så pladsen på brede skærme udnyttes bedre.

**2. Hero-sektionen:** Den store tomme flade til højre er reduceret ved
at gøre tekstopsætningen bredere specifikt for Foredrag (640px → 820px
tekstbredde) — ikke ved at tilføje stockbilleder eller nye grafiske
elementer, som bedt om. Andre siders hero-sektioner er verificeret
uændrede (fortsat 640px).

**3. Mobilversion:** Sidemargin reduceret til 18px (fra sitets
standard 28px) specifikt på Foredrag-siden. Kortene vises i én kolonne,
med større trykflader på "Læs mere" og "Forespørg". Testet ved 375, 390,
430 og 768px.

**4. Cookiebanner:** Testet grundigt ved alle seks bredder — ingen
afskåret tekst eller knapper, ingen overlap, fungerer ens på
desktop/mobil. **Et vigtigt forbehold:** Jeg har **ikke** tilføjet en
tredje "Tilpas"-knap ud over de eksisterende "Kun nødvendige" og
"Accepter alle". At tilføje en reel "Tilpas"-funktion (et
præferencepanel til at vælge cookie-kategorier enkeltvis) ville være en
ny funktion, ikke en rettelse — og opgaven bad eksplicit om, at
eksisterende funktionalitet ikke må ændres. Sig til, hvis I ønsker en
reel "Tilpas"-knap som en ny, separat opgave.

**5. Det runde ikon nederst til højre:** Jeg gennemsøgte koden
programmatisk for samtlige fixed/sticky-positionerede elementer på
tværs af sider og fandt **intet** rundt ikon nederst til højre nogen
steder. De eneste faste elementer er: headeren (top), cookiebanneret
(bund, fuld bredde) og den mobile sticky-bookingknap (en fuldbredde-pille
med afrundede hjørner, ikke et lille rundt ikon). Hvis I ser noget
specifikt et bestemt sted, så sig endelig til præcis hvilken side og
skærmstørrelse, så finder jeg det.

**6. Foredragskortenes informationsstruktur:** Tilføjet en valgfri
linje med målgruppe/format, som **kun** vises, hvis feltet faktisk er
udfyldt i admin (ingen af de syv standardforedrag har disse felter
udfyldt endnu, så linjen er ikke synlig, før Morten selv tilføjer det).
Kategori, titel, kort beskrivelse, "Læs mere" og "Forespørg" er bevaret
som ét fælles kortdesign.

**7. Testet ved:** 375px, 390px, 430px, 768px, 1024px, 1440px — 27 nye
tjek plus en fuld gennemgang af navigation (alle 11 sider), forsidens
fremhævede foredrag, kontakt-forudfyldning, Compass, admin-CRUD og
Cases. Alle bestået, ingen konsolfejl.

**8. Præcise svar:**

- **Gemmes foredrag nu permanent i Supabase, eller stadig i lokal
  content-store?** Uændret siden RC12: foredragene ligger i den
  eksisterende content-store — det vil sige LocalStorage, medmindre
  `assets/js/supabase-config.js` er udfyldt med et rigtigt Supabase-
  projekt, i hvilket tilfælde de i stedet ligger i den generiske
  "content"-tabel (ikke den dedikerede `talks`-tabel fra migrationen,
  som kræver rigtig Supabase-login for at kunne skrives til — se
  forklaringen i `supabase/talks_migration.sql`).
- **Kan adminændringer ses på en anden enhed?** Kun hvis Supabase reelt
  er tilsluttet (rigtig URL/nøgle indsat i `supabase-config.js`). Som
  projektet er konfigureret lige nu (tomme standardværdier), er svaret
  **nej** — ændringer gemmes kun i browserens LocalStorage på den
  enhed, hvor de blev lavet.
- **Hvad mangler konkret, før løsningen er en rigtig PWA?** Der findes
  slet ingen PWA-grundlag i projektet endnu: ingen `manifest.json`
  (navn, ikoner, temafarver, startside, standalone-visning), ingen
  service worker (offline-cache, installations-prompt), ingen
  app-ikoner i PWA-størrelser (192px/512px), ingen offline-fallback-side,
  og ingen cache-opdateringsstrategi. Det er en selvstændig opgave, jeg
  ikke har påbegyndt endnu.

## RC12 — Foredrag som ny, redigerbar produktkategori

**1. Filer oprettet:** `foredrag.html`, `supabase/talks_migration.sql`,
`sitemap.xml`, `robots.txt`. **Filer ændret:** `assets/js/content-loader.js`
(rendering + modal for foredrag), `assets/js/admin.js` (fuld CRUD),
`assets/js/analytics-clarity.js` (nye events), `assets/js/main.js`
(kontaktformular-forudfyldning), `assets/css/style.css` (nav-spacing +
foredragskort), samt alle 10 offentlige sider (kun ét nyt navigationslink
tilføjet — bekræftet ved diff, ingen andre ændringer på disse sider).

**2. Navigation:** "Foredrag" tilføjet mellem Forretning og Cases på alle
sider, inkl. mobilmenuen (samme `<nav>`-element genbruges, så det virker
automatisk begge steder). **Fandt og rettede en reel overlap-bug:** det
ekstra menupunkt fik navigationen til at gå i intern scroll ved
960-1300px desktop-bredder. Løst med to spacing-niveauer. **Ærligt
forbehold:** ved det smalle 960-1010px-interval er der stadig ca. 5-25px
intern scroll i selve nav-baren (det eksisterende `overflow-x:auto`-
fallback, som var der i forvejen) — ingen overlap, ingen sidescroll, men
heller ikke 100% fri af scroll i akkurat dette snævre interval.

**3. De syv foredrag:** Oprettet med præcis de angivne titler og
beskrivelser (inkl. korrekt stavning af "Psykologisk tryghed" og "The MFG
Compass™ – Navigation under pres"). Bygget som duplikaterbare data — ét
fælles kort-design (ikke syv hardcodede layouts), ligesom Cases-siden.

**4. Midlertidigt statisk, klar til Supabase:** Foredragene ligger i dag i
den eksisterende content-store (LocalStorage, eller den generiske
"content"-tabel, hvis Supabase allerede er tilsluttet) — nøjagtig samme
mekanisme som Cases og Testimonials bruger i forvejen. De 7 foredrag
sås automatisk ved første besøg. Jeg har **desuden** leveret en
selvstændig, korrekt afspærret `talks`-tabel i
`supabase/talks_migration.sql` med den sikkerhedsmodel, du bad om — men
den er ikke den aktive datakilde endnu. Se forklaringen i filens
kommentarer: den nuværende PIN-baserede admin har ingen rigtig Supabase
Auth-session, så den kan ikke skrive til en tabel, der (korrekt) kun
tillader autentificerede brugere at skrive. Når adminpanelet får en
rigtig Supabase-login, kan indholdet flyttes over uden at ændre
sikkerhedsmodellen.

**5. Adminfunktioner implementeret:** Opret, redigér, gem kladde (status
"Kladde"), publicér/afpublicér (status "Udgivet"/"Afpubliceret"), slet
med bekræftelse (`confirm()`-dialog), ændr rækkefølge (op/ned-knapper),
markér som fremhævet, upload/udskift billede, upload PDF, indsæt
video-link, redigér CTA-tekst/link, samt en forhåndsvisning (viser titel,
undertitel, beskrivelse og udfyldte metafelter) — alt via samme login,
samme PIN og samme sikkerhedsmodel som resten af adminpanelet. Ingen nyt
login oprettet.

**6. RLS-politikker (i talks_migration.sql):** Offentlig læseadgang
**kun** til rækker med `status = 'published'`. Alt andet (opret, redigér,
slet, og læsning af kladder/afpublicerede) kræver
`auth.role() = 'authenticated'` — en rigtig Supabase-login, ikke bare
anon-nøglen. Service role-nøglen bruges ingen steder i browseren.

**7. Forespørgsler:** "Forespørg på foredraget" fører til
`kontakt.html?emne=...`, som forudfylder beskedfeltet med
"Emne: Forespørgsel på foredrag: [titel]". Testet, at almindelig brug af
kontaktformularen (uden parameter) forbliver 100% upåvirket.

**8. Clarity-events tilføjet:** `navigation_foredrag_click`,
`homepage_foredrag_click`, `talk_card_click`, `talk_read_more_click`,
`talk_inquiry_click`, `talk_inquiry_submitted`. Clarity indlæses fortsat
udelukkende efter samtykke — uændret gate-logik.

**9. PWA — ærligt forbehold:** Dette projekt har **endnu ingen**
`manifest.json` eller service worker overhovedet — "den kommende PWA"
nævnt i opgaven er endnu ikke bygget noget sted i projektet. Jeg kan
derfor hverken bekræfte eller reelt teste "åbnes fra installeret PWA",
"offline-visning" eller "cache-opdatering", fordi der intet er at teste
endnu. Det, jeg **kan** bekræfte: foredrag.html bruger samme
scriptmønster (almindelige `<script src="...">`-tags, ingen build-step,
ingen hardcodet aggressiv caching) som resten af sitet, så den ikke
lægger nogen kendte forhindringer i vejen for en fremtidig PWA — men en
egentlig PWA-implementering er en selvstændig opgave, jeg ikke har
udført her, og jeg vil hellere sige det ligeud end at påstå noget, jeg
ikke kan bevise.

**10. Bekræftelse:** Cases, Compass, Mortens portræt, kontaktoplysninger,
Clarity-konfiguration, cookiebannerets design, admin-login/roller og
øvrige adminfunktioner er alle bekræftet uændrede — verificeret med en
fuld diff mod forrige version (alle 9 øvrige offentlige sider har kun ét
tilføjet navigationslink, ellers 100% identiske) samt automatiserede
tests (44 tjek: navigation, sidevisning, kort, modal, admin-CRUD i fuld
opret→udgiv→afpublicér→slet-cyklus, ombestilling, forhåndsvisning,
kontaktformular-forudfyldning, ingen konsolfejl, ingen horisontal scroll
ved 375-1440px).

**En reel bug fundet og rettet undervejs:** Adminpanelets hjælpefunktion
`escapeAttr()` fejlede på tal (kastede en JavaScript-fejl, der stille
afbrød hele Foredrag-sektionens visning) — rettet ved at konvertere
sorterings-feltet til tekst, før det sendes til funktionen.

**Testet ved:** 375px, 390px, 430px, 768px, 1024px, 1440px.

## RC11.2 — konsekvent "vi" på forretnings- og ydelsessider

Gennemgået manuelt (ikke automatisk søg-og-erstat) for hvert eneste fund
af "jeg/mig/min/mit/mine" i alle offentlige HTML-filer.

**1. Ændrede sider:** `index.html`, `mennesker.html`, `ledelse.html`,
`kultur.html`, `forretning.html`, `kontakt.html`. Ingen andre filer rørt.

**2. "Jeg" bevaret på Om Morten:** Faktisk **ingen** — ved gennemgang
viste det sig, at Om Morten-sidens bio allerede er skrevet i tredje
person ("Morten Foged Guglielmetti hjælper virksomheder med...", "Fokus
er at skabe...") og ikke bruger "jeg" noget sted i forvejen. Der var
derfor intet at bevare eller ændre på denne side — den opfylder allerede
kravet om at være personlig uden at kollidere med "vi"-reglen andre steder.

**3. "Vi" nu konsekvent brugt:**
- **Forside:** Hero-teksten ("Vi hjælper ejerledere og SMV'er...") og alle
  tre afsnit i Mød Morten-sektionen er rettet til "vi/vores", præcis som
  specificeret. Overskriften "Rådgivning fra én, der selv har stået med
  ansvaret" er bevaret uændret.
- **Mennesker, Ledelse, Kultur, Forretning:** Hver sides "Jeg hjælper
  jer..." er rettet til "Vi hjælper jer...", ordret som specificeret.
- **Kontakt:** Hovedoverskrift og brødtekst rettet til "Vi skaber..." /
  "Vi hjælper...". Desuden rettet formularteksten "så vender jeg tilbage"
  til "så vender vi tilbage" — samme logik (virksomheden svarer, ikke kun
  Morten personligt), selvom denne ene sætning ikke var eksplicit
  citeret i opgaven.

Ingen CTA'er brugte "Kontakt mig/Book mig/Skriv til mig" i forvejen —
kontrolleret og bekræftet rent.

**4. Ingen funktioner, links eller layout ændret:** Bekræftet med
automatiseret test — kompas-links, sticky bookingknap, cookiebanner og
admin-login fungerer alle uændret. HTML-balance verificeret på alle seks
ændrede filer. En fuld diff mod forrige version bekræfter, at kun de seks
navngivne HTML-filer er rørt — ingen CSS, JavaScript, billeder eller
andre sider.

## RC11.1 — sticky bookingknap, cookiebanner og mobilportræt rettet

**1. Sticky bookingknap overlappede Mortens portræt:** Løst med en rigtig
`IntersectionObserver`-baseret synlighedslogik (ikke bare cookiebanner +
footer som før). Den fastholdte knap skjules nu automatisk, når en af
følgende er synlig i viewport: en eksisterende "Book en samtale"-knap
(hero, Morten-sektionen, retningssidernes CTA — undtaget selve den lille
"Book"-genvej i headeren, som altid er synlig af design), footeren,
kontaktformularen, eller Mortens portrætsektion. Den vises kun på
almindelige tekstafsnit, hvor den reelt tilfører værdi — præcis som bedt om.

**2. Cookiebanner dækkede indhold på Mennesker-siden:** `body` får nu
klassen `cookie-banner-open`, mens banneret er åbent, og siden får
midlertidigt ekstra bundplads, så alt indhold (inkl. footeren) kan
scrolles helt fri af banneret. Selve cookiebanneret er visuelt uændret,
og "Accepter alle" fungerer som før.

**3. Mobilportræt for højt:** Portrættet er gjort mere kompakt på
375–430px (kvadratisk beskæring i stedet for det høje 700:758-format,
`object-fit:cover` + justeret `object-position`, så ansigt og skuldre
forbliver i billedet). Det oprindelige billede er uændret — kun
beskæringen på mobil er justeret. Desktop er 100% uændret.

**4-5. Sikker bundplacering og visningslogik:** `env(safe-area-inset-bottom)`
tilføjet til knappens position, så den ikke kolliderer med iPhones
home-indikator. Ingen blink ved scroll — synligheden styres udelukkende
af IntersectionObserver-events (ikke en scroll-lytter), som browseren i
forvejen optimerer.

**Ændrede filer (kun disse tre):** `assets/css/style.css`,
`assets/js/cookie-consent.js`, `assets/js/mobile-sticky-cta.js`. Ingen
tekster, HTML-indhold, Compass, desktoplayout, Clarity-events, Supabase,
admin eller Cases er rørt — bekræftet med en fuld diff mod RC11.

**Testet ved:** 375px, 390px og 430px — 39 automatiserede tjek i alt,
herunder scroll-gennemløb af hele forsiden for at bekræfte, at sticky-CTA
aldrig overlapper portrættet nogen steder, og at footeren kan scrolles
100% fri af det åbne cookiebanner (målt med 2px margin).

**Vigtigt forbehold:** Min billedvisning fungerede desværre slet ikke i
denne session, så jeg kunne ikke personligt se de fire krævede
screenshots. De er vedhæftet separat til din egen visuelle kontrol.

## RC11 — mere personlig og kundevendt

**1. Morten på forsiden:** Ny sektion ("Mød Morten") placeret umiddelbart
efter The MFG Compass™ og hero-teksten, før footeren. Genbruger Mortens
eksisterende portræt (samme fil som Om Morten og Kontakt — intet nyt eller
kunstigt genereret billede). Desktop: to-delt layout med portræt ~36% af
indholdsbredden (verificeret). Mobil: portræt over tekst, kompakt.

**2-3. Nye indledninger:** Mennesker, Ledelse, Kultur og Forretning har
hver fået en ny overskrift, to introafsnit og en afsluttende
CTA-spørgsmål+knap, præcis som leveret. Sproget er gennemgående skrevet
med "jer/jeres/I" til kunden, "jeg" om Mortens rådgivning. De eksisterende
længere sektioner (typiske udfordringer, løsningskort, cases, indsigter)
er urørt — ingen tydelig gentagelse blev fundet, der skulle fjernes.

**4. Fast bookingknap på mobil:** Implementeret. Vises kun under 768px,
samme navy/guld-stil som resten af sitet. Skjules automatisk, mens
cookiebanneret er åbent (overvåget live), og skjules igen, når footeren
kommer i syne, så den aldrig dækker footer-indhold. Siden får ekstra
bundplads på mobil, så knappen ikke dækker tekst.

**9. Clarity-events tilføjet:** `homepage_about_morten_click`,
`homepage_booking_click`, `mennesker_booking_click`,
`ledelse_booking_click`, `kultur_booking_click`,
`forretning_booking_click`, `mobile_sticky_booking_click` — alle via et
nyt, generisk `data-clarity-event`-attribut-system i
`assets/js/analytics-clarity.js` (ægte event-delegation, så det også
virker for den dynamisk indsatte sticky-knap). Clarity starter fortsat
kun efter samtykke — ingen ændring af den eksisterende gate-logik.

**Ændrede/nye filer:** `index.html` (Morten-sektion), `mennesker.html`,
`ledelse.html`, `kultur.html`, `forretning.html` (nye indledninger),
`assets/css/style.css` (nyt CSS til Morten-sektionen, CTA-spørgsmål og
sticky-knap), `assets/js/analytics-clarity.js` (generisk event-tracking),
ny fil `assets/js/mobile-sticky-cta.js`. De øvrige 5 sider
(Kontakt, Om Morten, Cases, 404, The MFG Compass™) fik udelukkende
tilføjet ét script-tag for sticky-knappen — ingen indholdsændringer
(bekræftet med diff).

**Testet ved:** 375px, 390px, 430px, 768px, 1024px og 1440px — 58
automatiserede tjek. Ingen horisontal scroll noget sted. Cases, Compass,
admin-login, Supabase og Clarity-konfiguration bekræftet uændrede.

**Vigtigt forbehold:** Min billedvisning fungerede desværre ikke i denne
session (gentestet flere gange), så jeg kunne ikke personligt se
skærmbillederne. De er vedhæftet separat til din egen visuelle kontrol.

## RC10 — Microsoft Clarity implementeret

Sitet bruger nu **Microsoft Clarity** til statistik — gratis, ingen egen
statistikdatabase. Der bruges **ikke** Plausible eller Google Analytics
(den tidligere forberedte understøttelse af dem er fjernet og erstattet).

- **Ét konfigurationssted:** `assets/js/clarity-config.js` indeholder kun
  `window.MFG_CLARITY_PROJECT_ID = ''` — udfyld dette ene sted, og alle
  sider bruger det automatisk. Se `docs/ANALYTICS.md` for en fuld guide
  til at oprette en gratis konto og finde ID'et.
- **Consent-styret:** Clarity indlæses udelukkende, hvis en besøgende har
  valgt "Accepter alle" i cookiebanneret, og kun hvis et Project ID er
  udfyldt. Scriptet indsættes højst én gang, uanset hvor mange gange
  funktionen kaldes.
- **Automatisk event-tracking** af: "Book en strategisk samtale"-klik,
  telefon-klik, mail-klik, indsendt kontaktformular, klik på hver af de
  fire kompas-retninger, klik på kompassets centrum, PDF-downloads og
  eksterne links. Se den fulde liste i `docs/ANALYTICS.md`.
- **Admin → Analytics** viser nu Clarity-status (Installeret/Ikke
  konfigureret), Projekt-ID og en knap til at åbne Clarity-dashboardet —
  rent visningsvindue, intet redigeres her.

**Ændrede/nye filer:** `assets/js/clarity-config.js` (ny),
`assets/js/analytics-clarity.js` (ny), `docs/ANALYTICS.md` (ny),
`assets/js/cookie-consent.js` (Clarity i stedet for Plausible/GA),
`assets/js/admin.js` (ny Analytics-visning), alle 10 offentlige sider samt
`admin.html` (script-tags tilføjet). Design, layout, CSS, Compass,
navigation, admin-login, Supabase og indhold er 100% uændrede — bekræftet
med automatiseret test (34 tjek, ingen horisontal scroll, ingen
konsolfejl, kontaktformular og alle sider bekræftet fungerende uændret).

## RC9 — global mobilrettelse: for stor afstand øverst og nederst

**1. CSS-reglen bag den store afstand øverst:** `.subpage-hero` (bruges af
Om Morten, Kontakt, Cases, de fire retningssider og 404) havde en
mobil-regel (`padding-top:var(--header-clearance-mobile)`), der **aldrig
reelt blev anvendt** — den stod placeret *før* grundreglen
`.subpage-hero{padding:var(--header-clearance) 0 46px}` i CSS-filen.
Ved lige specificitet vinder den regel, der står sidst i filen, så
desktop-værdien (196px) blev brugt selv på mobil. Målt direkte: 129px
afstand under headeren i stedet for de tilsigtede ~56px — næsten det
dobbelte. Nederst var der ikke en tilsvarende fejl (den regel var allerede
korrekt placeret fra en tidligere rettelse) — footer-afstanden var
faktisk allerede fin (56px), men den store afstand øverst gjorde hele
siden føltes for tom.

**2. Ingen CSS-regel skabte en decideret fejl nederst** — jeg gennemsøgte
grundigt for `100vh`, `min-height`, `justify-content:space-between` og
lignende og fandt intet af det nogen steder i projektet. Den oplevede
"tomme plads nederst" var en direkte konsekvens af den forkerte
øverste-afstand, som gjorde hele siden virke unaturligt lang.

**3. Ændrede filer:** Kun `assets/css/style.css`. Ingen HTML, JavaScript,
tekster, billeder eller andre filer er rørt (bortset fra `index.html`,
som allerede indeholdt en tidligere godkendt tekstrettelse til
kompas-centrum, "SKAB RETNING" — ikke en del af denne opgave).

**4. Testet ved:** 375px, 390px, 430px og 768px, på alle ni sider
(Forside, Mennesker, Ledelse, Kultur, Forretning, Cases, Om Morten,
Kontakt, The MFG Compass). Præcise målinger:
- **Om Morten:** header→"OM MORTEN" = 56px. Portræt→footer = 56px.
- **Kontakt:** header→"KONTAKT" = 56px. Overskrift→brødtekst = 18px.
  Brødtekst→CTA = 30px. CTA→første kontaktkort = 48px. Sidste
  indhold→footer = 56px.
- Alle værdier ligger inden for de ønskede intervaller (48-64px øverst,
  24-32px mellem tekstelementer, 40-56px før første kort, 40-80px før
  footer). 768px bruger fortsat desktop-værdierne uændret (samme
  breakpoint-konvention som resten af sitet), ingen fejl fundet der.

**5. Desktop og Compass bekræftet uændret:** `.kontakt`, `.om` og
`.compass-section--home`'s padding er verificeret identiske med
før-rettelsen ved 1440px (90px/90px/196px). Kompas-billedet, alle fem
klikområder og kontaktformularen er testet og fungerer uændret.

**Vigtigt forbehold:** Min billedvisning fungerede desværre ikke i denne
session (gentestet flere gange), så jeg kunne ikke personligt se de tre
krævede screenshots. De er vedhæftet separat (Om Morten ved 390px,
Kontakt øverst ved 390px, Kontakt nederst/footer ved 390px), så du kan
lave den visuelle kontrol selv.

## RC8.1 — kritisk rettelse: LEDELSE/KULTUR blev beskåret på mobil

**Årsagen fundet:** Mine tidligere automatiske tests tjekkede kun
`document.documentElement.scrollWidth` (side-niveau scroll), ikke om det
enkelte elements egen boks lå inden for viewportet. `.compass-section` har
`overflow:hidden` (bruges til den bløde baggrundsgradient) — det forhindrer
siden i at scrolle, men skjuler samtidig alt, der stikker uden for
sektionen. Jeg havde tidligere sat Ledelse til `left:-4%` på smalle
bredder for at undgå at overlappe kompasrosen — det placerede boksens
venstre kant uden for viewportet, hvor `overflow:hidden` klippede den
visuelt, uden at det nogensinde udløste side-scroll. Det er derfor mine
tidligere "ingen horisontal scroll"-tjek bestod, mens teksten stadig var
synligt beskåret. Bekræftet direkte: ved 390px lå Ledelses boks fra
x=-35,45px til x=64,7px — 35px af den lå uden for skærmen.

**Løsningen:** Et selvstændigt mobil-koordinatsystem (ikke genbrug af
desktop-koordinater):
- Ledelse: `left:2px` (aldrig negativ), Kultur: `right:2px` (aldrig ud
  over 100%) — begge med `transform` kun på lodret akse, ingen vandret
  centrering der kan skubbe dem ud over kanten.
- Bredde styret med `clamp(78px, 23vw, 110px)` og reduceret skriftstørrelse
  via `clamp()`, så hele teksten (inkl. "hvor mennesker lykkes") altid har
  plads uden at blive beskåret internt.
- Selve kompasrosen skaleres til 76% bredde på mobil (proportioner
  fuldstændig bevaret, ikke forvrænget) — det skaber den nødvendige,
  garanterede sideplads til Ledelse/Kultur, som eksplicit foreslået.
- Mennesker/Forretning er nu fuldt centreret (både vandret og lodret) på
  deres ankerpunkt, så deres boks aldrig vokser ind i kompasrosen.
- "SE METODEN" er nu to linjer ("SE" / "METODEN"), større, centreret i
  cirklen (ikke længere nederst), med en let mørk baggrund bag teksten for
  bedre kontrast mod guldstjernen.

**Ny, strengere testmetode:** Denne gang tjekker jeg hvert af de fire
elementers **faktiske `getBoundingClientRect()`** direkte mod viewportets
grænser (0 til viewport-bredde) — præcis den kontrol, der ville have
fanget den oprindelige fejl. 56 tjek bestået ved 375px, 390px og 430px:
ingen kant uden for viewport, ingen intern tekstbeskæring, alle fire
tekster (inkl. "Vi bygger kultur, hvor mennesker lykkes") bekræftet
tilstede i deres fulde ordlyd i DOM'en. Desuden verificeret, at intet
element overlapper kompasrosen ved 375-1440px.

**Desktop bekræftet uændret:** `.compass-original-wrap` er stadig 520px
bred (100%, ikke skaleret ned) ved 1440px, og alle fire retningers
`left`/`top`/`width`-værdier er identiske med RC8's godkendte desktop-layout.

**Vigtigt forbehold:** Min egen billedvisning fungerede desværre ikke i
denne session (bekræftet ved gentagne forsøg), så jeg kunne ikke
personligt se skærmbillederne. De tre screenshots (375px, 390px, 430px)
er derfor vedhæftet separat, så du kan lave den visuelle kontrol, du med
rette beder om.

## RC8 — nyt, rent Compass-billede med 5 klikbare områder

**1. Det nye Compass-billede:** `mfg-compass-original.jpg` / `.webp`
(1109×1419px) — Mortens professionelle, fuldstændigt tekstfrie grafik med
guld kompasrose på mørkeblå baggrund. Det gamle billede (693×719px, med de
gamle tekster visket ud af mig i en tidligere runde) er permanent
udskiftet og bruges ikke længere noget sted.

**2. Ændrede filer:**
- `index.html` — kompasmodulet genopbygget: `.mfg-compass-stage`-wrapper,
  fem rigtige klikområder, ingen accordion-paneler længere (erstattet af
  direkte links + den nye side).
- `assets/css/style.css` — hele kompasmodulets styling omskrevet: transparent
  normaltilstand, gylden ramme kun ved interaktion, ny geometri tilpasset
  det nye billedes proportioner.
- `assets/js/main.js` — den gamle panel-toggle-logik fjernet (ikke længere
  nødvendig); en lille tilføjelse sikrer, at touch/tastatur får samme
  gyldne feedback som museover.
- **Ny fil:** `mfg-compass.html` — hele den nye side om metoden.
- Alle 10 offentlige sider fik tilføjet ét diskret link ("The MFG
  Compass™") i footeren til den nye side, uden at fylde hovedmenuen.

**3. De fem klikområder:**
- **Mennesker / Ledelse / Kultur / Forretning**: rigtige `<a>`-links
  (`mennesker.html`, `ledelse.html`, `kultur.html`, `forretning.html`),
  med `aria-label="Læs om [Retning]"`. Alle fire deler nøjagtig samme
  grundklasse `.compass-direction` (bredde, min-højde, padding, border,
  radius, hover/fokus/aktiv-tilstand, animation ét sted) — kun
  `--people/--leadership/--culture/--business`-modifierne sætter
  placering. Normaltilstand: helt transparent, ingen ramme, ingen skygge,
  lys tekst (da hele billedet nu er mørkeblåt). Gylden, afrundet ramme
  vises kun ved hover/fokus/klik.
- **Centrum**: et rundt `<a>`-link, positioneret præcist over
  kompasrosen, med den diskrete tekst "SE METODEN" nederst i cirklen (for
  ikke at dække selve stjernen) og `aria-label="Læs om The MFG
  Compass-metoden"`. Fører til `mfg-compass.html`. Diskret gylden glød ved
  hover/fokus/aktiv, ellers usynlig.

**4. Testet ved:** 375px, 390px, 430px, 480px, 600px, 768px, 1024px og
1440px — automatiseret (50 tjek i alt). Alle fire retninger forbliver
positioneret omkring kompasset ved samtlige bredder (aldrig en liste
under kompasset), ingen af de fem områder overlapper kompasrosen, ingen
tekst beskæres, ingen horisontal scroll, ingen konsol-/sidefejl. Tastatur-
navigation (Tab) når frem til de klikbare områder. Et reelt overlap med
kompasrosen blev fundet og rettet for Ledelse/Kultur under testen (den
oprindelige placering var for tæt på ringsystemet ved smalle bredder).

**5. Øvrige sider:** Bekræftet uændrede — Om Morten, Kontakt, Cases,
Supabase, admin, cookie-banner, kontaktoplysninger og alle øvrige tekster
er ikke rørt. Kun kompasmodulet, billedreferencen, de fem klikområder, den
nye side og footer-linket er ændret.

**Vigtigt forbehold:** Min egen billedvisning var ustabil under denne
session (bekræftet ved gentagne forsøg), så jeg kunne ikke personligt
lave den sidste visuelle kontrol. Al positionering og alle mål er derfor
verificeret geometrisk/matematisk (cirkeloverlap beregnet præcist, ikke
skønnet), og desktop-/mobil-skærmbilleder er vedhæftet separat til din
egen visuelle bekræftelse.

## RC7.7 — for stor lodret afstand på mobil (Kontakt + Om Morten)

**1. Årsagen:** To CSS-regler brugte samme store padding på mobil som på
desktop, uden nogen mobil-specifik reduktion:
- `.kontakt{padding:90px 0 100px}` (Kontaktsidens sektion med kontaktkortene)
- `.om{padding:90px 0 110px}` (Om Morten-sidens sektion med portrættet)

Kombineret med `.subpage-hero`'s faste bundpadding (46px, samme på alle
skærmstørrelser) gav det op til **136px** tomt rum mellem CTA-knappen og
det første kontaktkort, og tilsvarende mellem undertitlen og portrættet
på Om Morten. Der var **ingen** `height:100vh` eller
`justify-content:space-between` involveret — det var udelukkende for
generøs padding, der ikke var tilpasset mobil.

Undervejs fandt jeg desuden en reel bug i min egen første rettelse: den
nye mobil-regel stod placeret *før* grundreglerne i CSS-filen, så den
blev overskrevet af dem (CSS-cascade: ved lige specificitet vinder den
regel, der står sidst i filen). Rettet ved at flytte mobil-reglerne til
efter grundreglerne, hvorefter de faktisk slår igennem.

**2. Ændrede filer:** Kun `assets/css/style.css`. Ingen HTML, JavaScript,
tekster, billeder eller andre filer er rørt.

**3. Testede skærmbredder:** 375px, 390px, 430px, 768px og 1440px
(desktop), automatiseret med 27 tjek:
- Kontakt: afstand CTA → første kort er nu **48px** (var 136px), inden for
  det ønskede 40-56px-interval.
- Om Morten: afstand undertitel → portræt er nu **54px** (var 136px),
  inden for 40-56px (medregnet brødtekstens egen 30px bundmargin).
- 768px bruger bevidst stadig desktop-spacing, i tråd med sitets
  eksisterende breakpoint ved 768px (samme grænse, hvor hovedmenuen
  skifter fra hamburger til fuld visning).

**4. Bekræftelse:**
- **Desktop (1440px):** `.kontakt` og `.om`'s padding er uændret 90px —
  verificeret direkte på computed style.
- **Kompasset:** Billedet indlæses korrekt, og et hotspot-klik blev
  testet og åbner stadig sit panel korrekt — kompasmodulet er ikke rørt.
- Telefonnummer- og mail-links, kontaktformularen, samt alle sider, der
  deler `.subpage-hero`-klassen (Cases, de fire retningssider, 404),
  er testet uden horisontal scroll eller andre regressioner.

## RC7.6 — Compass-retningerne er nu rigtige HTML-elementer

Efter flere runder med pixel-justering af tekst indbygget i selve
kompas-grafikken viste målingerne, at metoden ikke var holdbar (for lidt
fysisk plads i billedet til at opfylde alle krav samtidig). Løsningen er
nu ændret fundamentalt: de fire retningsnavne er ikke længere en del af
billedet, men rigtige, tilgængelige HTML-knapper.

**1. Tekstfri grafik:** Ja — `assets/images/mfg-compass-original.jpg` (og
`.webp`) er nu redigeret, så de fire tekstblokke (MENNESKER, LEDELSE,
KULTUR, FORRETNING + deres undertekster og forbindelsesprikker) er
fjernet fra billedet. Titlen ("THE MFG COMPASS™ / DIT KOMPAS FOR
UDVIKLING"), selve kompasset/stjernen og bundcitatet er bevaret uændret.
Verificeret ved pixelanalyse: ingen mørke pixels tilbage i de fire
tekstområder, mens cirkel, titel og bundtekst stadig er intakte.

**2. Ændrede filer:** Kun `index.html`, `assets/css/style.css`,
`assets/images/mfg-compass-original.jpg`, `assets/images/mfg-compass-original.webp`,
og en tekstopdatering i admin-panelets forklaringstekst (`assets/js/admin.js`,
ingen funktionel ændring). Bekræftet med en fuld mappe-diff — ingen andre
filer er rørt (navigation, portræt, farver, footer, Supabase, cases,
indsigter og øvrige tekster er 100% uændrede).

**3. De fire ensartede HTML-elementer:** Alle fire bruger nøjagtig samme
grundklasse `.compass-direction` (bredde, min-højde, padding, border,
border-radius, typografi, hover/aktiv/fokus-tilstand er defineret ét
sted). Kun placeringen styres af `.compass-direction--people`,
`--leadership`, `--culture`, `--business` — disse sætter udelukkende
`left`/`top`/`transform` til positionering, intet om størrelse eller
udseende. Teksterne er nu almindelig, semantisk HTML
(`<span class="compass-direction__title">` +
`<span class="compass-direction__subtitle">`), ikke pixler i et billede.

**4. Test af mobil og desktop:** Automatiseret testsuite (41 tjek) kørt
ved 375px, 390px, 430px, 768px, 1024px og 1440px:
- **Mobil (<768px):** Kompasset vises øverst, de fire retninger vises
  som ens kort i et 2×2-grid nedenunder (1 kolonne under 420px) — ingen
  absolut positionering, ingen risiko for overlap på smalle skærme.
- **Desktop/tablet (≥768px):** De fire retninger ligger rundt om
  kompasset som før, nu som synlige, klikbare kort. Verificeret
  geometrisk, at ingen af de fire kort overlapper kompas-cirklen på
  768px, 1024px og 1440px (fandt og rettede et lille overlap på Ledelse
  under testen).
- Alle fire klikhandlinger, "Læs mere"-links og accordion-adfærd er
  bekræftet uændret. Ingen horisontal scroll på nogen af de seks bredder.

**5. Ingen tekst beskæres:** Bekræftet automatisk — hvert kort tjekkes
for, at dets `scrollHeight`/`scrollWidth` ikke overstiger dets synlige
`clientHeight`/`clientWidth` (dvs. ingen indre overflow/beskæring af
hverken overskrift eller undertekst) på alle seks testede bredder.

**Ikke inkluderet endnu (som aftalt):** Klik på selve kompas-centrum er
bevidst ikke tilføjet — det tages som en separat, senere opgave.

## RC7.5.4 — undersøgelse af PNG-fejlen

**Konklusion: der er ingen fejl i selve hjemmesidens filer.** Jeg har
gennemgået alle seks kontrolpunkter systematisk:

1. **Alle PNG-filer er verificeret som ægte, gyldig binær billeddata** —
   ikke tekst indsat i HTML/CSS/JS. Tjekket med tre uafhængige metoder:
   `file`-kommandoen (bekræfter "PNG image data" for alle), Pythons
   billedbibliotek PIL (åbner og validerer hver fil uden fejl), og en
   direkte byte-for-byte kontrol af PNG-signaturen (`\x89PNG\r\n\x1a\n`)
   i starten af hver fil. Alle tre metoder bekræfter gyldige filer.
2. **Ingen filnavne har forkerte/doble endelser** — alle ender præcist på
   `.png`, `.jpg` eller `.webp`, ingen `.png.html` eller lignende.
3. **Alle `<img src="">` og `<link>`-referencer er gennemgået** — alle
   peger korrekt på eksisterende filer i `assets/images/`.
4. **Ingen navigation eller hotspot-link peger på en billedfil** — gennemsøgt
   hele projektet for `.png`-forekomster; de eneste er de forventede
   favicon-`<link>`-tags og admin-CMS'ets standardværdi for favicon.
5. **Testet direkte via lokal HTTP-server**: alle tre favicon-PNG'er
   bekræftet leveret med `Content-Type: image/png` og korrekt binært
   indhold — præcis den måde, GitHub Pages også ville servere dem på.
6. **`<picture>`-elementet på forsiden** bruger korrekt WebP som kilde og
   JPG som fallback for selve Compass-billedet — ingen PNG indgår her,
   og der er ingen forkerte type-angivelser.

**Den sandsynlige, reelle årsag:** Sidste levering (RC7.5.1) indeholdt en
ekstra mappe, `screenshots/`, med et skærmbillede jeg vedlagde som
*reference til dig* — det var aldrig en del af selve hjemmesiden og blev
ikke linket fra nogen side. At det lå inde i selve projekt-ZIP'en har
sandsynligvis skabt forvirring om, hvad der reelt er "sitet". Den mappe er
nu **fjernet helt** fra leverancen. Skærmbilleder til din egen kontrol
sender jeg fremover kun som separate vedhæftninger i chatten — aldrig
inde i selve projekt-ZIP'en.

**Testet før levering:** Compass-billedet indlæses korrekt (bekræftet via
`img.complete`/`naturalWidth`/`naturalHeight`), alle fire hotspots åbner
deres paneler, alle favicon-links resolver korrekt, og der er ingen
konsol- eller sidefejl. Ingen andre filer er ændret i forhold til RC7.5.1
(bekræftet med en fuld mappe-diff).

## RC7.5.1 — tre sidste rettelser til Compass-hotspots

**Igen et forbehold:** Billedvisningen var stadig ustabil i denne session
(virkede kort i sidste runde, fejlede konsekvent i denne). Alle tre punkter
er derfor verificeret matematisk/geometrisk (se detaljer nedenfor) samt via
et vedlagt skærmbillede (`screenshots/rc751-compass-frames.png`) til din
egen visuelle kontrol.

**1. Kultur centreret korrekt:** Fandt roden af problemet — min tidligere
centrering inkluderede ved en fejl den lille guld-forbindelsesprik mod
kompasset som en del af "teksten". Da prikken sidder til venstre for selve
ordet "KULTUR", trak den centreringen for langt mod venstre. Ekskluderede
prikken og genberegnede ud fra kun den læsbare tekst — rammen er nu flyttet
mod højre og centreret på selve "KULTUR" + undertekst.

**2. Forretning-teksten flyttet (hele blokken):** Kontrollerede grundigt:
min forrige rettelse flyttede rent faktisk både overskrift og undertekst
sammen (verificeret ved pixelanalyse af begge versioner) — men tilsyneladende
så det ikke tilstrækkeligt ud. Flyttede nu hele blokken ("FORRETNING" +
begge undertekstlinjer, som én samlet, sammenhængende operation) yderligere
ned. **Ærligt forbehold:** Jeg kunne kun flytte den **8px længere ned**
(ikke fulde 12-15px), fordi bundteksten/citatet nedenunder er en fast,
urørlig grænse — en fuld ekstra 12-15px shift ville visuelt have ramt
bundteksten, hvilket ville bryde kravet om, at intet andet må ændres.
Samlet er "FORRETNING"-blokken nu flyttet 23px ned i forhold til det
allerførste, oprindelige billede.

**3. Forretning-rammen genberegnet:** Rammen er nu centreret om den nye,
lavere tekstposition, med samme størrelse som de tre andre, og ligger
tydeligt under kompasset uden at røre cirklen.

**4. Ens rammer:** Uændret fra RC7.5 — bredde, højde, border-radius og
glød defineres stadig ét sted i `.compass-hotspot`; kun `left`/`top`
varierer pr. retning.

**Et vedvarende, ærligt forbehold:** Ligesom i RC7.5 er de fire tekstlabels
fysisk forskellige størrelser i dette billede. Kultur er nu centreret på
sin egen tekst, hvilket betyder dens afstand til kompasset (~17px) ikke er
pixel-identisk med Ledelses (~10px) — det var nødvendigt for at opfylde det
mere eksplicitte krav om centrering på selve teksten. Begge har dog en
tydelig, synlig afstand, og ingen ramme rører cirklen.

## RC7.5 — korrekt placering af Compass-hotspots

**Vigtigt forbehold:** Min billedvisning fungerede ikke i denne session
(bekræftet ved gentagne forsøg, også med et simpelt testbillede), så jeg
kunne ikke personligt lave den visuelle skærmbillede-kontrol, der blev
bedt om. I stedet har jeg verificeret alt **geometrisk/matematisk med
pixel-præcision** (se `screenshots/`-mappen for de faktiske skærmbilleder
til din egen visuelle kontrol).

**1. Ens rammer:** Alle fire hotspots har nu identisk bredde (139px/20,1%),
højde (84px/11,7%), border-radius (8px) og glød — defineret ét sted i
`.compass-hotspot`. Kun `left`/`top` varierer pr. retning.

**2. Ingen overlap med kompasset:** Kompassets cirkel blev målt præcist
(center 335,377px, radius 183px). Alle fire rammer har nu **nøjagtig
10px afstand** til cirklen — hverken mere eller mindre, verificeret med
en geometrisk cirkel/rektangel-kollisionstest, ikke kun et øjemål.

**3. Forretning flyttet ned:** Selve teksten ("FORRETNING" / "Vi omsætter
potentiale" / "til resultater") er fysisk flyttet 15px ned i billedet
(inden for det ønskede 12-18px-interval) — ikke kun rammen. Det gamle
tekstområde er visket ud og erstattet med den korrekte cremefarvede
baggrund; teksten er indsat på ny, lavere position. Rammen er genberegnet
til at sidde centreret om den nye tekstposition.

**Et ærligt forbehold om "perfekt centrering":** Kompassets fire
tekstlabels er reelt forskellige størrelser (Mennesker/Forretning har
bredere undertekster; Ledelse/Kultur sidder tæt på cirklens kant med
meget lidt sideplads). En ramme, der er 100% ens i størrelse for alle
fire OG har en tydelig, ens afstand til cirklen, kan derfor ikke være
matematisk 100% centreret om al tekst i alle fire retninger samtidig —
det er en fysisk umulighed i dette specifikke billede, ikke en fejl fra
min side. Konkret betyder det, at rammerne dækker langt størstedelen af
hver tekstblok, men et par pixels af den yderste kant (typisk den lille
forbindelsesprik mod cirklen, eller yderste bogstav på den bredeste linje)
kan ligge lige uden for rammen. Jeg har valgt at prioritere de eksplicit
krævede "hårde" krav (ens størrelse, ingen overlap med cirklen, tydelig
ens afstand) frem for pixel-perfekt tekstindramning i alle fire hjørner.

**4-5. Funktionalitet og responsivitet:** Verificeret automatisk (22
tjek): alle fire hotspots åbner stadig deres panel, "Læs mere"-links
virker, ingen navigation væk fra forsiden ved klik, ingen horisontal
scroll og ingen overlap med cirklen på 375px, 390px, 430px, tablet
(820px) og desktop (1440px).

**6. Visuel kontrol:** Se `screenshots/rc75-375.png`,
`screenshots/rc75-390.png` og `screenshots/rc75-430.png` — de fire gyldne
rammer er der fremtvunget synlige (normalt vises de kun ved hover/fokus)
for at gøre kontrollen let. Kontrollér venligst selv, at de matcher dine
forventninger, og sig til, hvis noget skal justeres.

## RC7.4 — ensartede Compass-hotspots

Kun `assets/css/style.css` er ændret i denne runde — ingen HTML, JavaScript,
tekster, links eller navigation er rørt.

- **Forretning**: hotspot-markeringen (og dermed den gyldne ramme, der vises
  ved hover/fokus) er flyttet ca. 17px længere ned, så afstanden til
  kompasstjernen nu matcher de tre andre retninger visuelt.
- **Ensartede rammer**: bredde, højde, border-radius og padding for alle
  fire hotspots ligger nu i **én fælles CSS-regel** (`.compass-hotspot`)
  — kun placeringen (`left`/`top`) er forskellig pr. retning, hvilket er
  nødvendigt, fordi de fire tekstlabels rent faktisk sidder forskellige
  steder i billedet. Der er ingen individuelle bredde/højde-værdier
  tilbage pr. retning.
- Placeringerne er beregnet ud fra en pixel-præcis måling af, hvor hver af
  de fire tekstblokke (MENNESKER/LEDELSE/KULTUR/FORRETNING + undertekst)
  rent faktisk ligger i billedet, så den nye, ensartede ramme er centreret
  om hver tekstblok — ikke forskudt til nogen side.
- **Vigtigt om klikzoner**: den nye, fælles størrelse er sat, så den er
  **mindst lige så stor** som det tidligere klikområde for alle fire
  retninger (aldrig mindre) — der er altså ikke sket nogen indskrænkning
  af klikzonerne noget sted, kun en forstørrelse/ensretning hvor det var
  nødvendigt.
- En lille teknisk følgeændring: `.compass-original-wrap` brugte
  `overflow:hidden` til at runde billedets hjørner. Det er flyttet til at
  sidde direkte på billedet (`.compass-original-img{border-radius:10px}`)
  i stedet, så de nu ensartede hotspot-rammer for Ledelse og Kultur (som
  ligger helt ude ved billedets venstre/højre kant) ikke bliver skåret af.
  Det visuelle resultat (afrundede hjørner) er identisk.
- Verificeret automatisk: alle fire hotspots har nu identisk bredde, højde,
  border-radius og padding; ingen af de fire dækker mindre end sit eget
  tekstlabel; alle fire åbner stadig deres panel korrekt; "Læs mere"-links
  navigerer stadig korrekt; ingen horisontal scroll på mobil (375px),
  tablet (820px) og desktop (1440px).

## RC7.3 — ny stjerne i forsidegrafikken

Selve stjerne-/kompasrose-grafikken i midten af forsidens Compass-billede
er udskiftet med den nye stjerne fra bagsiden af visitkortet. Alt andet i
grafikken er bevaret uændret:

- Sandfarvet baggrund, titel ("THE MFG COMPASS™ / DIT KOMPAS FOR UDVIKLING"),
  de fire retningstekster (Mennesker/Ledelse/Kultur/Forretning) og
  bundteksten er alle 100% uændrede — kun cirklen med selve stjernen i
  midten er skiftet ud.
- Teknisk: den nye stjerne blev sat ind ved at finde de præcise
  pixel-koordinater for den gamle kompas-cirkel (center ca. 335,377,
  radius ca. 183px i det 693×719px store billede) og indsætte den nye
  stjerne der med en cirkulær maske, så overgangen til den sandfarvede
  baggrund er sømløs. Billedets samlede mål (693×719) er uændret, så
  ingen andre filer skulle røres — de eksisterende klikbare områder
  (`.hotspot-mennesker` osv. i `assets/css/style.css`) rammer stadig
  præcis de samme steder, da de er baseret på tekstplaceringerne, som
  ikke er flyttet.
- Verificeret: billedet indlæses korrekt på mobil/tablet/desktop, alle
  fire hotspots åbner stadig deres paneler, "Læs mere"-links navigerer
  stadig korrekt, ingen tekst eller links er brudt, ingen horisontal
  scroll. Kun `assets/images/mfg-compass-original.jpg` og den tilhørende
  `.webp`-udgave er ændret — ingen andre filer i projektet er rørt.

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

## Analytics (Microsoft Clarity)

MFG Advisory bruger Microsoft Clarity — gratis, ingen egen statistikdatabase,
ingen Plausible, ingen Google Analytics. Se `docs/ANALYTICS.md` for en fuld
guide til at oprette en konto og finde dit Project ID. Selve ID'et indsættes
ét sted: `assets/js/clarity-config.js`. Status vises under **Admin → Analytics**.

## Cookiebanner

Vises automatisk ved første besøg ("Kun nødvendige" / "Accepter alle").
Valget gemmes i `mfg_cookie_consent` i LocalStorage. Status findes under
**Admin → Cookiebanner**. Microsoft Clarity indlæses udelukkende, hvis
besøgende har valgt "Accepter alle" — og kun hvis et Project ID er
konfigureret.

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
