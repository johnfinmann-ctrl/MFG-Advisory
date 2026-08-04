/* =========================================================================
   MFG Advisory — standard-cases (bruges til at forudfylde "Cases", hvis
   der endnu ikke er gemt nogen cases i content-store'en).
   Delt mellem content-loader.js (offentlige sider) og admin.js
   (adminpanelet), så begge altid viser det samme, uanset hvilken side
   der besøges først i en frisk browser.

   ERSTATNING (2026): Dette datasæt erstatter fuldstændigt det tidligere
   11-case-datasæt. Indhold er hentet ordret fra
   "CASES_til_WEB__2__erstat.docx" — den eneste kilde til Cases.
   Virksomhedsnavnene SENG og Bang & Olufsen er eksplicit godkendt
   skriftligt af Morten til offentlig visning på hjemmesiden.

   Kategori "forretningsudvikling" bruges konsekvent (ikke "forretning")
   i data, filter og visning, jf. eksplicit instruks.
   ========================================================================= */

window.MFG_DEFAULT_CASES = [
  {
    id: 'case1', slug: 'seng-personaleomsaetning-70-til-15',
    title: 'SENG: Personaleomsætning fra 70 % til 15 %',
    category: 'mennesker',
    org_type: 'SENG · Landsdækkende retailkæde',
    teaser: 'Åbenhed, oprigtig interesse og større forståelse for virksomhedens virkelighed skabte markant stærkere tilknytning blandt medarbejderne.',
    challenge: 'SENG havde en personaleomsætning på cirka 70 %. Det udfordrede kontinuiteten, relationerne og muligheden for at opbygge en stærk fælles kultur.',
    responsibility: 'Medarbejderne skulle ikke blot kende virksomhedens mål. De skulle forstå virkeligheden bag dem, opleve sig inddraget og mærke en oprigtig interesse for dem som mennesker.',
    approach: [
      'Jeg skabte større åbenhed og dialog og prioriterede relationen til den enkelte medarbejder.',
      'Samtidig etablerede jeg en struktureret træningskalender, et fælles årshjul og leverandørbesøg i udlandet.',
      'Medarbejderne fik større indsigt i virksomhedens virkelighed, mål og resultater samt mere systematisk træning, udvikling og opfølgning.',
      'Indsatsen bestod ikke af ét enkelt tiltag, men af en række sammenhængende greb, der skabte mening, involvering og tilknytning.'
    ],
    key_figures: [
      { value: '70 % til 15 %', label: 'Personaleomsætning' },
      { value: '55 pp', label: 'Forbedring' },
      { value: '+11 pp', label: 'Medarbejdertrivsel' }
    ],
    result: 'Personaleomsætningen blev reduceret fra cirka 70 % til 15 % — en forbedring på 55 procentpoint og en relativ reduktion på næsten 79 %. Samtidig steg medarbejdertrivslen med 11 procentpoint.',
    insights: ['Tilknytning skabes længe før opsigelsen', 'Åbenhed er også sund forretning'],
    mfg_help: '',
    image_url: 'assets/images/cases/seng-personaleomsaetning-70-til-15.jpg',
    cta_text: 'Book en strategisk samtale', cta_url: 'kontakt.html',
    sort_order: 1, is_featured: true, status: 'published'
  },
  {
    id: 'case2', slug: 'bo-udvikling-140-franchisepartnere',
    title: 'Bang & Olufsen: Udvikling af 140 franchisepartnere',
    category: 'mennesker',
    org_type: 'Bang & Olufsen · Fem nordiske markeder',
    teaser: 'Kompetenceudvikling blev omsat til praktiske værktøjer, som den enkelte franchisepartner kunne anvende direkte i sin lokale forretning.',
    challenge: 'Cirka 140 franchisepartnere på tværs af Danmark, Norge, Sverige, Finland og Island havde forskellige markeder, kompetencer og kommercielle udfordringer.',
    responsibility: 'Udviklingen skulle tage udgangspunkt i den enkelte partners virkelighed og samtidig understøtte en fælles premiumoplevelse og tydelig kommerciel retning.',
    approach: [
      'Jeg kombinerede individuel sparring med Nordic Retail Academy, Train the Trainer, deling af best practice og konkrete værktøjer til pipeline, salgsaktiviteter og opfølgning.',
      'Udviklingen blev koblet direkte til partnerens egen forretning, så ny viden kunne omsættes til konkrete handlinger i hverdagen.'
    ],
    key_figures: [
      { value: '140', label: 'Franchisepartnere' },
      { value: '5', label: 'Nordiske markeder' }
    ],
    result: 'Partnerne fik et stærkere kommercielt værktøjssæt og bedre forudsætninger for at omsætte den overordnede strategi til handling i deres lokale marked.',
    insights: ['Træning skal kunne bruges mandag morgen', 'Én løsning passer ikke til 140 forretninger'],
    mfg_help: '',
    image_url: 'assets/images/cases/bo-udvikling-140-franchisepartnere.jpg',
    cta_text: 'Book en strategisk samtale', cta_url: 'kontakt.html',
    sort_order: 2, is_featured: false, status: 'published'
  },
  {
    id: 'case3', slug: 'seng-fast-ledelsesrytme',
    title: 'SENG: Fra ambitioner til en fast ledelsesrytme',
    category: 'ledelse',
    org_type: 'SENG · 32 butikker · 28 ledere · 100+ medarbejdere',
    teaser: 'En fælles ledelsesrytme på tværs af 32 butikker var med til at skabe 21 % omsætningsvækst, 25 % højere konvertering og en markant bedre kundeoplevelse.',
    challenge: 'En organisation med 32 butikker, 28 ledere og mere end 100 medarbejdere krævede tydelig retning, gennemsigtighed og konsekvent opfølgning.',
    responsibility: 'Lederne skulle vide, hvad der blev forventet, hvilke resultater de ejede, og hvor de skulle sætte ind for at flytte deres forretning.',
    approach: [
      'Jeg etablerede tydeligere KPI-strukturer, faste performance- og opfølgningsrytmer, et fælles årshjul og tæt sparring med den enkelte leder.',
      'Mål og resultater blev gjort mere synlige, så lederne kunne handle hurtigere og tage et tydeligere ansvar for deres egen enhed.'
    ],
    key_figures: [
      { value: '+21 %', label: 'Omsætningsvækst' },
      { value: '+25 %', label: 'Konvertering' },
      { value: '+15 pp', label: 'NPS' }
    ],
    result: 'Organisationen leverede 21 % omsætningsvækst det første år, konverteringen steg med 25 %, og NPS blev forbedret med 15 procentpoint.',
    insights: ['Strategi skaber først værdi, når den får en rytme', 'Tydelighed gør ansvar muligt'],
    mfg_help: '',
    image_url: 'assets/images/cases/seng-fast-ledelsesrytme.jpg',
    cta_text: 'Book en strategisk samtale', cta_url: 'kontakt.html',
    sort_order: 3, is_featured: true, status: 'published'
  },
  {
    id: 'case4', slug: 'seng-randers-286-procent-vaekst',
    title: 'SENG Randers: 286 % vækst på ét år',
    category: 'ledelse',
    org_type: 'SENG Randers · Lokal butik',
    teaser: 'Tæt ledelsessparring, tydelige mål og konsekvent opfølgning bidrog til en markant kommerciel udvikling af butikken.',
    challenge: 'Butikken i Randers havde behov for en tydeligere kommerciel retning og et stærkere fokus på de aktiviteter, der kunne flytte forretningen.',
    responsibility: 'Ledelsen skulle tættere på hverdagen, og ambitionerne skulle omsættes til konkrete mål, salgsaktiviteter og personligt ansvar.',
    approach: [
      'Jeg arbejdede tæt sammen med den lokale ledelse om salgsfokus, prioritering af aktiviteter og mere konsekvent opfølgning.',
      'Det blev tydeligere, hvad der skulle gøres, hvem der havde ansvaret, og hvordan den daglige indsats skulle bidrage til butikkens samlede resultat.'
    ],
    key_figures: [
      { value: '+286 %', label: 'Omsætningsvækst' },
      { value: '1 år', label: 'Periode' }
    ],
    result: 'Butikken i Randers leverede en omsætningsvækst på 286 % på ét år.',
    insights: ['Potentiale flytter sig ikke af sig selv', 'Turnaround begynder med få klare prioriteter'],
    mfg_help: '',
    image_url: 'assets/images/cases/seng-randers-286-procent-vaekst.jpg',
    cta_text: 'Book en strategisk samtale', cta_url: 'kontakt.html',
    sort_order: 4, is_featured: false, status: 'published'
  },
  {
    id: 'case5', slug: 'seng-kundeoplevelse-faelles-ansvar',
    title: 'SENG: Kundeoplevelsen som et fælles ansvar',
    category: 'kultur',
    org_type: 'SENG · 32 butikker · Kundeservice · Digitale kontaktpunkter',
    teaser: 'Kundeoplevelsen blev gjort til et fælles ledelses- og kulturansvar på tværs af butikker, kundeservice og digitale kontaktpunkter.',
    challenge: 'Hos SENG blev kundeoplevelsen skabt på tværs af 32 butikker, kundeservice og digitale kontaktpunkter. Derfor kunne ansvaret ikke placeres hos én enkelt funktion.',
    responsibility: 'Kundefeedback skulle bruges aktivt i ledelsen og omsættes til læring, adfærd og forbedringer tæt på kunden.',
    approach: [
      'Jeg gjorde NPS og kundeoplevelsen til en fast del af opfølgningen og skabte en tættere forbindelse mellem butikkerne, kundeservice og den samlede kunderejse.',
      'Kundens oplevelse blev et fælles ansvar og ikke kun noget, der skulle håndteres, når en utilfreds kunde kontaktede kundeservice.'
    ],
    key_figures: [
      { value: '+15 pp', label: 'NPS' },
      { value: '+25 %', label: 'Konvertering' },
      { value: '32', label: 'Butikker' }
    ],
    result: 'Organisationen skabte et stærkere fælles kundefokus. I perioden steg NPS med 15 procentpoint, samtidig med at konverteringen steg med 25 %.',
    insights: ['Kundeoplevelsen er ikke kundeservices ansvar', 'Kundefeedback skal føre til handling'],
    mfg_help: '',
    image_url: 'assets/images/cases/seng-kundeoplevelse-faelles-ansvar.jpg',
    cta_text: 'Book en strategisk samtale', cta_url: 'kontakt.html',
    sort_order: 5, is_featured: false, status: 'published'
  },
  {
    id: 'case6', slug: 'bo-faelles-retning-uden-formel-magt',
    title: 'Bang & Olufsen: Fælles retning uden formel magt',
    category: 'kultur',
    org_type: 'Bang & Olufsen · 140 franchisepartnere',
    teaser: '140 selvstændige franchisepartnere kunne ikke ledes gennem instruktion alene. Udviklingen blev skabt gennem tillid, tydelige forventninger og fælles data.',
    challenge: 'Franchisepartnerne ejede deres egne virksomheder. Jeg havde derfor ikke traditionel ledelsesret, men havde fortsat ansvaret for at styrke performance og udvikling.',
    responsibility: 'Partnerne skulle opleve respekt for deres selvstændighed og samtidig møde tydelighed omkring de kommercielle forventninger.',
    approach: [
      'Jeg arbejdede med langsigtede forretningsplaner, gennemsigtige KPI\u2019er, tæt sparring, konsekvent opfølgning og deling af erfaringer mellem partnerne.',
      'Udviklingen blev skabt gennem relationer og faglig troværdighed — ikke gennem formel magt.'
    ],
    key_figures: [
      { value: '15', label: 'Nøgleenheder' },
      { value: '+32 %', label: 'Samlet vækst' },
      { value: '140', label: 'Partnere' }
    ],
    result: 'Indsatsen styrkede ejerskabet og skabte en mere databaseret dialog om forretningen. 15 nøgleenheder leverede samlet en historisk vækst på 32 %.',
    insights: ['Du kan ikke kommandere dig til ejerskab', 'Frihed virker bedst med en fælles retning'],
    mfg_help: '',
    image_url: 'assets/images/cases/bo-faelles-retning-uden-formel-magt.jpg',
    cta_text: 'Book en strategisk samtale', cta_url: 'kontakt.html',
    sort_order: 6, is_featured: false, status: 'published'
  },
  {
    id: 'case7', slug: 'bo-fra-6-til-37-mio',
    title: 'Bang & Olufsen: Fra 6 til 37 mio. kr.',
    category: 'forretningsudvikling',
    org_type: 'Bang & Olufsen · Franchisepartner',
    teaser: 'En franchisepartner blev udviklet gennem større kunderelevans, flere kommercielle ben og konsekvent opfølgning.',
    challenge: 'En Bang & Olufsen-partner havde en årlig omsætning på cirka 6 mio. kr. og behov for flere kommercielle ben under forretningen.',
    responsibility: 'Væksten skulle skabes ved at forstå kundernes behov bedre, øge tilgængeligheden og arbejde mere proaktivt med nye markeder og kundegrupper.',
    approach: [
      'I tæt samarbejde med partneren arbejdede jeg med hotline og personlig vejledning fra kl. 08.00–22.00, en stærkere hjemmeside og målrettet annoncering i Norge.',
      'Samtidig blev B2B-salget udviklet gennem samarbejde med ejendomsmæglere, udstillingslejligheder og tilbud i forbindelse med boligsalg. Pipeline, aktiviteter og opfølgning blev sat i system.'
    ],
    key_figures: [
      { value: '6 mio.', label: 'Udgangspunkt' },
      { value: '37 mio.', label: 'Årlig omsætning' },
      { value: '6 år', label: 'Udviklingsperiode' }
    ],
    result: 'Over cirka seks år voksede den årlige omsætning fra cirka 6 til 37 mio. kr. Det svarer til 31 mio. kr. i øget årlig omsætning og cirka 6,2 gange udgangspunktet.',
    insights: ['Vækst kræver flere ben på taburetten', 'Vækst starter med kundens behov'],
    mfg_help: '',
    image_url: 'assets/images/cases/bo-fra-6-til-37-mio.jpg',
    cta_text: 'Book en strategisk samtale', cta_url: 'kontakt.html',
    sort_order: 7, is_featured: true, status: 'published'
  },
  {
    id: 'case8', slug: 'seng-sammenhaengende-kunderejse',
    title: 'SENG: En sammenhængende kunderejse',
    category: 'forretningsudvikling',
    org_type: 'SENG · Webshop · Kundeservice · 32 butikker',
    teaser: 'Omnichannel, CRM og tydeligere ejerskab skabte en stærkere forbindelse mellem de digitale kontaktpunkter, kundeservice og de 32 butikker.',
    challenge: 'Kunden bevæger sig frit mellem webshop, kundeservice og fysisk butik. Hvis organisationen arbejder i siloer, risikerer både kundeoplevelsen og salget at gå tabt mellem kontaktpunkterne.',
    responsibility: 'Kunderejsen skulle opleves som én sammenhængende proces — uanset hvor kunden begyndte eller afsluttede sit køb.',
    approach: [
      'Jeg arbejdede med udviklingen af omnichannel, webshoppen, CRM-systemet FocalScope samt tydeligere processer for ejerskab, leadhåndtering og opfølgning.',
      'Målet var at skabe en mere sammenhængende kunderejse og sikre, at muligheder og kundehenvendelser ikke gik tabt mellem organisationens forskellige funktioner.'
    ],
    key_figures: [
      { value: '+21 %', label: 'Omsætningsvækst' },
      { value: '+25 %', label: 'Konvertering' },
      { value: '+15 pp', label: 'NPS' }
    ],
    result: 'Indsatsen skabte et stærkere kommercielt fundament og bedre sammenhæng i kunderejsen. Den samlede udvikling omfattede 21 % omsætningsvækst det første år, 25 % højere konvertering og 15 procentpoint højere NPS.',
    insights: ['Kunden ser én virksomhed – ikke jeres siloer', 'Et lead uden ejerskab er en tabt mulighed'],
    mfg_help: '',
    image_url: 'assets/images/cases/seng-sammenhaengende-kunderejse.jpg',
    cta_text: 'Book en strategisk samtale', cta_url: 'kontakt.html',
    sort_order: 8, is_featured: false, status: 'published'
  }
];
