/* =========================================================================
   MFG Advisory — standard-foredrag (bruges til at forudfylde "Foredrag",
   hvis der endnu ikke er gemt nogen foredrag i content-store'en).
   Delt mellem content-loader.js (offentlige sider) og admin.js
   (adminpanelet), så begge altid viser det samme, uanset hvilken side
   der besøges først i en frisk browser.

   Indhold: de 12 foredrag fra MFGAdvisory-Foredrag-til-hjemmeside_1.pptx
   og _2.pptx (6 slides i hver, ét foredrag pr. slide).
   ========================================================================= */

window.MFG_DEFAULT_TALKS = [
  {
    id: 't1', slug: 'mennesker-fra-potentiale-til-performance',
    title: 'Mennesker – fra potentiale til performance', category: 'mennesker',
    subtitle: '– fra potentiale til performance',
    teaser: 'Et foredrag om at se hele mennesket bag adfærden og skabe rammer, relationer og motivation, der gør potentiale synligt i handling.',
    focus: [
      'Forstå forskellen på adfærd, mønstre, behov og potentiale.',
      'Brug profiler som spejl og dialog – aldrig som dom.',
      'Skab relationer, hvor forskellighed bliver en styrke.',
      'Match retning, ramme og rytme til den konkrete person.'
    ],
    takeaway: 'Et menneskeligt og forretningsorienteret blik på udvikling, tilknytning og performance.',
    image_url: 'assets/images/foredrag/mennesker-fra-potentiale-til-performance.jpg',
    cta_text: 'Forespørg på foredraget', cta_url: 'kontakt.html', sort_order: 1, is_featured: true, status: 'published'
  },
  {
    id: 't2', slug: 'tilknytning-vaelge-jer-igen',
    title: 'Tilknytning – det, der får mennesker til at vælge jer igen', category: 'mennesker',
    subtitle: '– det, der får mennesker til at vælge jer igen',
    teaser: 'Opsigelsen er slutpunktet – ikke begyndelsen. Tilknytning skabes længe før medarbejderen overvejer at forlade virksomheden.',
    focus: [
      'Skeln mellem tilfredshed, engagement, commitment og tilknytning.',
      'Se de små kontraktbrud, før de bliver til afstand.',
      'Gør de første 90 dage og den nærmeste leder til aktive løfter.',
      'Brug bliv-samtaler, mønstre og data før exit-samtalen.'
    ],
    takeaway: 'Konkrete greb til at styrke relation, mening, udvikling og lysten til at blive.',
    image_url: 'assets/images/foredrag/tilknytning-vaelge-jer-igen.jpg',
    cta_text: 'Forespørg på foredraget', cta_url: 'kontakt.html', sort_order: 2, is_featured: false, status: 'published'
  },
  {
    id: 't3', slug: 'psykologisk-tryghed-sandheden-i-tide',
    title: 'Psykologisk tryghed – når sandheden kommer frem i tide', category: 'mennesker',
    subtitle: '– når sandheden kommer frem i tide',
    teaser: 'Tryghed er ikke fravær af krav. Det er modet til at sige det vigtige, dele fejl og udfordre beslutninger, før tavshed bliver dyr.',
    focus: [
      'Skeln mellem komfort, frygt og læring med høje standarder.',
      'Forstå hvorfor mennesker tier, når prisen føles høj.',
      'Brug lederens første reaktion som kulturmarkør.',
      'Byg tryghed gennem rammer, invitation, respons og opfølgning.'
    ],
    takeaway: 'Samtalegreb, der gør uenighed og fejl til læring frem for skyld.',
    image_url: 'assets/images/foredrag/psykologisk-tryghed-sandheden-i-tide.jpg',
    cta_text: 'Forespørg på foredraget', cta_url: 'kontakt.html', sort_order: 3, is_featured: true, status: 'published'
  },
  {
    id: 't4', slug: 'ledelse-fra-retning-til-resultater',
    title: 'Ledelse – fra retning til resultater', category: 'ledelse',
    subtitle: '– fra retning til resultater',
    teaser: 'Et foredrag om den daglige ledelsesadfærd, der gør retning tydelig, ansvar muligt og opfølgning til læring i stedet for kontrol.',
    focus: [
      'Led fra situationen – ikke automatisk fra din vane.',
      'Sæt klare mål og rammer uden at mikrostyre.',
      'Skab psykologisk tryghed med krav og ærlig dialog.',
      'Byg en fast rytme for beslutninger, feedback og opfølgning.'
    ],
    takeaway: 'Konkrete greb til tydelig, konsekvent og virkningsfuld ledelse.',
    image_url: 'assets/images/foredrag/ledelse-fra-retning-til-resultater.jpg',
    cta_text: 'Forespørg på foredraget', cta_url: 'kontakt.html', sort_order: 4, is_featured: true, status: 'published'
  },
  {
    id: 't5', slug: 'ledelse-uden-formel-magt',
    title: 'Ledelse uden formel magt – fra position til indflydelse', category: 'ledelse',
    subtitle: '– fra position til indflydelse',
    teaser: 'Hvordan skaber du retning, ejerskab og resultater, når du ikke kan bestemme – over partnere, kolleger eller selvstændige ejere?',
    focus: [
      'Skeln mellem formel magt, faglighed, relation og troværdighed.',
      'Skab mening, før du søger tilslutning.',
      'Brug spørgsmål og forventningsafstemning til bevægelse.',
      'Følg op uden at overtage ansvaret eller kommandere.'
    ],
    takeaway: 'En model for indflydelse, der bygger engagement – ikke blot efterlevelse.',
    image_url: 'assets/images/foredrag/ledelse-uden-formel-magt.jpg',
    cta_text: 'Forespørg på foredraget', cta_url: 'kontakt.html', sort_order: 5, is_featured: false, status: 'published'
  },
  {
    id: 't6', slug: 'lederen-som-flaskehals',
    title: 'Når lederen bliver organisationens flaskehals', category: 'ledelse',
    subtitle: 'organisationens flaskehals',
    teaser: 'Overinvolvering, uklare mandater og for mange eskalationer gør organisationen langsom og afhængig – også når intentionen er god.',
    focus: [
      'Genkend ventetid, beslutningskøer og skjult afhængighed.',
      'Skeln mellem kritiske beslutninger og det, der bør flyttes ud.',
      'Gør mandat, rammer og eskalationsveje tydelige.',
      'Træn dømmekraft uden at tage opgaven tilbage.'
    ],
    takeaway: 'En praktisk vej fra svarperson til systemleder – med mere lokal beslutningskraft.',
    image_url: 'assets/images/foredrag/lederen-som-flaskehals.jpg',
    cta_text: 'Forespørg på foredraget', cta_url: 'kontakt.html', sort_order: 6, is_featured: false, status: 'published'
  },
  {
    id: 't7', slug: 'kultur-det-vi-goer-accepterer-gentager',
    title: 'Kultur – det vi gør, accepterer og gentager', category: 'kultur',
    subtitle: '– det vi gør, accepterer og gentager',
    teaser: 'Et foredrag om det usynlige system, der former adfærd, samarbejde, beslutninger og resultater – også når ingen leder følger med.',
    focus: [
      'Afdæk kultur gennem ord, adfærd, belønning og tolerance.',
      'Forstå mikrosignaler, uformelle normer og det, der gentages.',
      'Omsæt værdier fra plakat til konkrete valg og handlinger.',
      'Skab psykologisk tryghed med høje standarder – ikke hygge.'
    ],
    takeaway: 'Et fælles sprog til at gøre kulturen synlig og ændre den gennem adfærd.',
    image_url: 'assets/images/foredrag/kultur-det-vi-goer-accepterer-gentager.jpg',
    cta_text: 'Forespørg på foredraget', cta_url: 'kontakt.html', sort_order: 7, is_featured: true, status: 'published'
  },
  {
    id: 't8', slug: 'kundeoplevelsen-ikke-kun-kundeservice',
    title: 'Kundeoplevelsen er ikke kundeservices ansvar', category: 'kultur',
    subtitle: 'kundeservices ansvar',
    teaser: 'Kunden møder én virksomhed. Foredraget viser, hvordan oplevelsen skabes før, under og efter købet – af ledelse, mennesker, systemer og overleveringer.',
    focus: [
      'Se kunderejsen på tværs af touchpoints og interne siloer.',
      'Find bruddet: løfte, overlevering, ansvarsvakuum eller handlekraft.',
      'Gør kundeoplevelsen leverbar – også når noget går galt.',
      'Brug feedback, observation og data til læring og forbedring.'
    ],
    takeaway: 'Konkrete greb til at reducere kundens friktion og skabe fælles ansvar.',
    image_url: 'assets/images/foredrag/kundeoplevelsen-ikke-kun-kundeservice.jpg',
    cta_text: 'Forespørg på foredraget', cta_url: 'kontakt.html', sort_order: 8, is_featured: false, status: 'published'
  },
  {
    id: 't9', slug: 'forretningsudvikling-vaerdien-bliver-virkelig',
    title: 'Forretningsudvikling – når værdien bliver virkelig', category: 'forretning',
    subtitle: '– når værdien bliver virkelig',
    teaser: 'Et praksisnært foredrag om at skabe sammenhæng mellem kundebehov, strategi, salg og drift – på tværs af B2C, B2B og B2G.',
    focus: [
      'Identificér kundens reelle behov og den værdi, kunden køber.',
      'Gør strategi målbar gennem KPI\u2019er, rytme og opfølgning.',
      'Navigér beslutningsveje, gatekeepere og kontaktformer.',
      'Skab vækst, der kan ses i kundeoplevelse, drift og økonomi.'
    ],
    takeaway: 'En praktisk model til at fjerne friktion og omsætte indsigt til handling.',
    image_url: 'assets/images/foredrag/forretningsudvikling-vaerdien-bliver-virkelig.jpg',
    cta_text: 'Forespørg på foredraget', cta_url: 'kontakt.html', sort_order: 9, is_featured: true, status: 'published'
  },
  {
    id: 't10', slug: 'fra-6-til-37-mio-kr',
    title: 'Fra 6 til 37 mio. kr. – sammen med ejeren', category: 'forretning',
    subtitle: '– sammen med ejeren',
    teaser: 'En dokumenteret vækstrejse fra lokal butik til stærk forretning – bygget på kundebehov, nye markedsspor, B2B og en konsekvent kommerciel rytme.',
    focus: [
      'Kundebehov og service som differentiering – bl.a. hotline 08–22.',
      'Website og Norge gjorde markedet større end lokalområdet.',
      'B2B-partnerskaber, pipeline og proaktiv aktivitetsudvikling.',
      'Ejerens rolle, sparringens rolle og disciplineret opfølgning.'
    ],
    takeaway: 'Principperne bag væksten – ikke en opskrift, der kopieres blindt.',
    image_url: 'assets/images/foredrag/fra-6-til-37-mio-kr.jpg',
    cta_text: 'Forespørg på foredraget', cta_url: 'kontakt.html', sort_order: 10, is_featured: false, status: 'published'
  },
  {
    id: 't11', slug: 'strategi-virker-mandag-morgen',
    title: 'Strategi virker først, når den kan ses mandag morgen', category: 'forretning',
    subtitle: 'når den kan ses mandag morgen',
    teaser: 'Et foredrag om at oversætte strategiske ambitioner til prioriteringer, mandater, adfærd og synlige resultater i hverdagen.',
    focus: [
      'Find bruddet mellem beslutning og virkelighed.',
      'Gør få prioriteringer klare – også det, I vælger fra.',
      'Oversæt strategien til mandat, kompetence og konkret adfærd.',
      'Sæt en fast rytme for bevis, læring og korrektion.'
    ],
    takeaway: 'En 90-dages tilgang, der gør strategien styrbar og synlig i driften.',
    image_url: 'assets/images/foredrag/strategi-virker-mandag-morgen.jpg',
    cta_text: 'Forespørg på foredraget', cta_url: 'kontakt.html', sort_order: 11, is_featured: false, status: 'published'
  },
  {
    id: 't12', slug: 'mfg-compass-navigation-under-pres',
    title: 'The MFG Compass™ – navigation under pres', category: 'forretning',
    subtitle: '– navigation under pres',
    teaser: 'Du kan ikke styre vejret. Men du kan styre navigationen, når data bliver tvetydige, tempoet stiger og organisationen mister kursen.',
    focus: [
      'Læs fire signaler: mennesker, ledelse, kultur og forretning.',
      'Skeln mellem det synlige symptom og den egentlige position.',
      'Træf beslutninger i tre tempi: stop, skift eller sikr.',
      'Korrigér kursen med tydelig retning, ansvar og opfølgning.'
    ],
    takeaway: 'Et fælles navigationssprog til at handle roligt, samlet og rettidigt under pres.',
    image_url: 'assets/images/foredrag/mfg-compass-navigation-under-pres.jpg',
    cta_text: 'Forespørg på foredraget', cta_url: 'kontakt.html', sort_order: 12, is_featured: true, status: 'published'
  }
];
