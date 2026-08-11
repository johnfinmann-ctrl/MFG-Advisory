/* =========================================================================
   MFG Advisory — standard-cases (bruges til at forudfylde "Cases", hvis
   der endnu ikke er gemt nogen cases i content-store'en).
   Delt mellem content-loader.js (offentlige sider) og admin.js
   (adminpanelet), så begge altid viser det samme, uanset hvilken side
   der besøges først i en frisk browser.

   Kilde: "MFG_Advisory_Websitecases_11_cases_v1.docx" — mastergrundlaget
   for de 11 cases. Indhold (titel, teaser, udfordring, ansvar, greb,
   nøgletal, resultat, "sådan kan MFG Advisory hjælpe") er hentet ordret
   fra dokumentet. Dokumentet indeholder ikke et "indsigter"-felt for
   disse 11 cases, så der er ikke tilføjet nogen — kun det, dokumentet
   faktisk indeholder.

   Side 15 i dokumentet ("INTERNT — SKAL IKKE UPLOADES") er ikke brugt
   til noget som helst.
   ========================================================================= */

window.MFG_DEFAULT_CASES = [
  {
    id: 'case1', slug: 'case-01-onboarding-tilknytning',
    title: 'Fra høj personaleomsætning til en onboarding, der skabte tilknytning',
    category: 'mennesker',
    org_type: 'SENG · Landsdækkende retailkæde · 32 butikker · 100+ medarbejdere',
    teaser: 'Personaleomsætningen blev reduceret fra cirka 70 til 15 procent som del af en samlet indsats med onboarding, lederansvar, træning og konsekvent opfølgning.',
    challenge: 'Organisationen havde en meget høj personaleomsætning, og nye medarbejdere fik ikke en ensartet start. Introduktionen afhang i høj grad af den enkelte leder og den aktuelle travlhed i butikken. Det betød forskelle i oplæring, forventninger og tempo — og en dyr gentagelse af rekruttering og oplæring.',
    responsibility: 'Som Head of Retail & Customer Service havde jeg ansvar for cirka 30 ledere, mere end 100 medarbejdere og P&L på cirka 250 mio. kr. Min opgave var både at stabilisere driften og skabe et mere professionelt forløb fra ansættelse til selvstændig performance.',
    approach: [
      'Jeg etablerede et samlet 0-12 måneders onboardingforløb med tydelige milepæle, forventninger og opfølgningspunkter.',
      'Lederens ansvar blev konkretiseret før opstart, i introduktionen, i den praktiske oplæring og i de løbende samtaler.',
      'Produktviden, kundeoplevelse, salgstræning, leverandør- og fabriksbesøg samt læring i hverdagen blev samlet i ét forløb.',
      'Vi fulgte udviklingen gennem samtaler, trivselsdata og personaleomsætning og brugte tilbagemeldinger til at justere forløbet.'
    ],
    key_figures: [
      { value: '70 % til 15 %', label: 'Personaleomsætning' },
      { value: '+15 pp', label: 'eNPS / trivsel' },
      { value: '0-12 mdr.', label: 'Fælles onboarding' }
    ],
    result: 'Personaleomsætningen blev reduceret fra cirka 70 til 15 procent på under to år, mens eNPS steg med 15 procentpoint. Resultatet kan ikke tilskrives onboarding alene. Det blev skabt gennem en kombination af bedre introduktion, tydeligere ledelse, kompetenceudvikling, performanceopfølgning og et stærkere fokus på tilknytning.',
    insights: [],
    mfg_help: 'MFG Advisory kan kortlægge medarbejderrejsen og udvikle et konkret onboarding- og opfølgningsforløb, som lederne kan gennemføre i en travl hverdag.',
    image_url: 'assets/images/cases/case-01-onboarding-tilknytning.jpg',
    cta_text: 'Book en strategisk samtale', cta_url: 'kontakt.html',
    sort_order: 1, is_featured: true, status: 'published'
  },
  {
    id: 'case2', slug: 'case-02-retail-academy',
    title: 'Retail Academy gjorde læring til en del af driften',
    category: 'mennesker',
    org_type: 'SENG · Retailorganisation · Kompetenceudvikling · Kundeoplevelse',
    teaser: 'Et fælles læringssystem for ledere og medarbejdere koblede produktviden, kundeoplevelse, salg og opfølgning tættere sammen.',
    challenge: 'Træning blev tidligere gennemført som enkeltstående aktiviteter, ofte i forbindelse med kampagner eller produktlanceringer. Det gjorde det vanskeligt at sikre en fælles standard, følge læringen til dørs og omsætte den til ny adfærd i butikkerne.',
    responsibility: 'Jeg havde ansvaret for at skabe en mere systematisk læringsstruktur på tværs af butikkerne og gøre lederne til aktive medspillere i udviklingen af deres egne teams.',
    approach: [
      'Jeg etablerede Retail Academy som en fælles ramme for produktviden, salg, kundeoplevelse og ledelse.',
      'Træningen blev samlet i et årshjul og koblet til kampagner, sortiment, kunderejse og de vigtigste kommercielle prioriteter.',
      'Lederne fik ansvar for at træne videre lokalt, observere adfærd og følge op i den daglige drift.',
      'Fabriks- og leverandørbesøg, sidemandsoplæring og fælles videndeling gjorde læringen mere konkret og anvendelig.'
    ],
    key_figures: [
      { value: '+25 %', label: 'Konvertering' },
      { value: '+10 pp', label: 'NPS' },
      { value: '32', label: 'Butikker' }
    ],
    result: 'I perioden steg konverteringen med 25 procent, og NPS blev forbedret med 10 procentpoint. Retail Academy var en del af en større kommerciel og organisatorisk transformation og kan derfor ikke stå som en isoleret forklaring. Dens væsentligste bidrag var at gøre læring gentagelig, ledelsesforankret og tættere knyttet til den ønskede kundeoplevelse.',
    insights: [],
    mfg_help: 'MFG Advisory kan udvikle et praksisnært academy, træningsårshjul eller lederdrevet læringsforløb, hvor kompetenceudvikling kobles direkte til adfærd, kundeoplevelse og de resultater, virksomheden ønsker at forbedre.',
    image_url: 'assets/images/cases/case-02-retail-academy.jpg',
    cta_text: 'Book en strategisk samtale', cta_url: 'kontakt.html',
    sort_order: 2, is_featured: false, status: 'published'
  },
  {
    id: 'case3', slug: 'case-03-kundeservice-faelles-ansvar',
    title: 'Fra reaktiv kundeservice til fælles ansvar for kundeoplevelsen',
    category: 'mennesker',
    org_type: 'SENG · National kundeservice · Danmark og Sverige · Tværgående samarbejde',
    teaser: 'Kundeservice blev koblet tættere på salg og logistik gennem nye processer, fælles data og tydelige servicemål.',
    challenge: 'Kundeservice håndterede mange henvendelser reaktivt, og organisationen manglede et fælles overblik over svartider, sagstyper, gentagne fejl og overleveringer mellem butikker, kundeservice og logistik. Det gjorde problemer vanskeligere at løse ved kilden.',
    responsibility: 'Jeg havde det overordnede ansvar for kundeserviceopsætningen i Danmark og Sverige og for at skabe en mere sammenhængende kundeoplevelse på tværs af kanaler og funktioner.',
    approach: [
      'Jeg ledte kravspecifikation og implementering af FocalScope som fælles service- og sagsplatform.',
      'Vi indførte SLA\u2019er, KPI\u2019er og månedlige performancegennemgange, så udviklingen blev synlig og kunne prioriteres.',
      'Kundeservice blev koblet tættere til salg og logistik med tydeligere overleveringer og fælles problemløsning.',
      'Onboarding, træning og videndeling blev styrket, så teamet kunne løse flere sager ensartet og tidligere i forløbet.'
    ],
    key_figures: [
      { value: '+10 pp', label: 'NPS' },
      { value: 'DK + SE', label: 'Fælles setup' },
      { value: 'Månedlig', label: 'SLA/KPI-opfølgning' }
    ],
    result: 'NPS steg med 10 procentpoint, og organisationen fik større transparens i kundehenvendelser og serviceperformance. Samtidig blev kundeoplevelsen mere ensartet på tværs af kontaktpunkter. Resultatet var skabt i samspil med ændringer i butikker, logistik, ledelse og den samlede kunderejse.',
    insights: [],
    mfg_help: 'MFG Advisory kan hjælpe med at analysere kundeserviceflow, roller, data og samarbejde på tværs. Målet er ikke blot hurtigere svartider, men færre gentagne fejl og en organisation, der lærer af kundernes henvendelser.',
    image_url: 'assets/images/cases/case-03-kundeservice-faelles-ansvar.jpg',
    cta_text: 'Book en strategisk samtale', cta_url: 'kontakt.html',
    sort_order: 3, is_featured: false, status: 'published'
  },
  {
    id: 'case4', slug: 'case-04-ledelsesrytme-32-butikker',
    title: 'Én ledelsesrytme på tværs af 32 butikker',
    category: 'ledelse',
    org_type: 'SENG · 32 butikker · Ca. 30 ledere · P&L ca. 250 mio. kr.',
    teaser: 'Fælles prioriteringer, ens KPI-definitioner og en fast opfølgningsrytme gjorde forskelle i performance og eksekvering synlige tidligere.',
    challenge: 'Butikkerne havde forskellige lokale vaner, og centrale beslutninger kunne blive fortolket forskelligt. Det gjorde det vanskeligt at vide, om et utilfredsstillende resultat skyldtes retningen, den lokale eksekvering eller manglende opfølgning.',
    responsibility: 'Som ansvarlig for retailorganisationen skulle jeg både sætte den fælles retning og skabe en ledelsesform, der gav den enkelte leder mulighed for at handle lokalt inden for en tydelig ramme.',
    approach: [
      'Vi reducerede retningen til få fælles prioriteter med tydelige ejere, aktiviteter, succeskriterier og tidsfrister.',
      'KPI\u2019er, forecast, pipeline og kundeoplevelse blev fulgt i en fast ugentlig og månedlig rytme.',
      'Kvartalsvise lederreviews, individuelle samtaler og butiksbesøg blev brugt til både støtte, modspil og konsekvent opfølgning.',
      'Et fælles årshjul bandt kampagner, drift, træning og ledelseskommunikation sammen.'
    ],
    key_figures: [
      { value: '+21 %', label: 'Omsætning år 1' },
      { value: '+25 %', label: 'Konvertering' },
      { value: '32', label: 'Butikker' }
    ],
    result: 'Organisationen leverede 21 procent omsætningsvækst det første år og en forbedring af konverteringen på 25 procent. Ledelsesrytmen var ikke den eneste årsag, men den gjorde aftaler, aktiviteter og afvigelser synlige og skabte et bedre grundlag for at reagere, før problemerne voksede.',
    insights: [],
    mfg_help: 'MFG Advisory kan etablere en enkel ledelsesrytme, der forbinder strategi med hverdagens beslutninger. Det omfatter prioriteringer, mandat, KPI\u2019er, mødefora og opfølgning — tilpasset virksomhedens størrelse og modenhed.',
    image_url: 'assets/images/cases/case-04-ledelsesrytme-32-butikker.jpg',
    cta_text: 'Book en strategisk samtale', cta_url: 'kontakt.html',
    sort_order: 4, is_featured: true, status: 'published'
  },
  {
    id: 'case5', slug: 'case-05-ledelse-gennem-indflydelse',
    title: 'Ledelse gennem indflydelse — ikke organisationsdiagram',
    category: 'ledelse',
    org_type: 'Bang & Olufsen · Internationalt premiumbrand · Ca. 140 partnere · Fem nordiske markeder',
    teaser: 'Selvstændige franchisepartnere blev udviklet gennem forretningsplaner, data, feltarbejde og kommerciel sparring — uden traditionel linjeledelse.',
    challenge: 'Netværket bestod af selvstændige virksomhedsejere med forskellige markeder, ambitioner og forudsætninger. En central strategi kunne ikke implementeres gennem instruktion alene. Den skulle give lokal forretningsmæssig mening.',
    responsibility: 'Jeg havde ansvar for nordisk retail- og franchiseudvikling på tværs af Danmark, Sverige, Norge, Finland og Island. Netværket omfattede cirka 140 partnerenheder med en samlet årlig omsætning på mere end 400 mio. kr.',
    approach: [
      'Jeg segmenterede partnerne efter potentiale, performance, udviklingsvilje og lokal markedsposition.',
      'Sammen med udvalgte partnere udviklede jeg flerårige forretningsplaner med konkrete kommercielle prioriteringer.',
      'KPI\u2019er, forecast, pipeline, CSI og CRM blev brugt som fælles faktagrundlag i den løbende sparring.',
      'Butiksbesøg, coaching, træning og kvalificeret modspil blev tilpasset den enkelte ejers forretning og ambitionsniveau.'
    ],
    key_figures: [
      { value: '140', label: 'Partnerenheder' },
      { value: '400+ mio.', label: 'Årlig omsætning' },
      { value: '5', label: 'Nordiske markeder' }
    ],
    result: 'I 15 nøgleforretninger blev der skabt en samlet vækst på 32 procent, og flere opnåede placering blandt brandets globale TOP50. Resultaterne blev skabt af partnerne og deres teams. Mit bidrag var at etablere retning, struktur, opfølgning og et samarbejde, hvor modspil kunne omsættes til lokale beslutninger.',
    insights: [],
    mfg_help: 'MFG Advisory kan hjælpe franchise-, partner- og kædeorganisationer med at skabe fælles retning uden at fjerne det lokale ejerskab. Indsatsen kan omfatte partnersegmentering, forretningsplaner, performancefora og udvikling af relationen mellem kæde og selvstændige ejere.',
    image_url: 'assets/images/cases/case-05-ledelse-gennem-indflydelse.jpg',
    cta_text: 'Book en strategisk samtale', cta_url: 'kontakt.html',
    sort_order: 5, is_featured: false, status: 'published'
  },
  {
    id: 'case6', slug: 'case-06-lokalt-mandat-faelles-retning',
    title: 'Lokalt mandat uden at miste den fælles retning',
    category: 'ledelse',
    org_type: 'SENG · Distribueret organisation · Lokale beslutninger · Fælles ansvar',
    teaser: 'Tydeligere beslutningsrum og systematisk feedback reducerede behovet for, at alle beslutninger skulle forbi den øverste leder.',
    challenge: 'Når en organisation vokser, kan den øverste leder let blive flaskehals. Lederne venter på godkendelse, beslutninger mister tempo, og den lokale dømmekraft udvikles ikke. Omvendt kan utydeligt mandat skabe store forskelle i kvalitet og risiko.',
    responsibility: 'I en organisation med 32 butikker arbejdede jeg med at flytte flere beslutninger tættere på kunden uden at gøre retning, ansvar eller opfølgning uklare.',
    approach: [
      'Vi tydeliggjorde, hvilke beslutninger den enkelte leder selv ejede, og hvilke der krævede involvering eller eskalation.',
      'Beslutninger skulle vurderes på data, muligheder, risici og konsekvenser — ikke på, hvad jeg personligt ville have gjort.',
      'Lederne blev inviteret til at udfordre antagelser før beslutningen og levere feedback under eksekveringen.',
      'Effekten blev fulgt, og beslutninger kunne korrigeres, når fakta eller forudsætninger ændrede sig.'
    ],
    key_figures: [
      { value: 'Mandat', label: 'Klare beslutningsrum' },
      { value: 'Modspil', label: 'Bedre beslutningsgrundlag' },
      { value: 'Opfølgning', label: 'Læring og ansvar' }
    ],
    result: 'Indsatsen gjorde det muligt at fordele ansvar tydeligere og reagere hurtigere på lokale forhold. Effekten blev ikke målt som en selvstændig KPI og bør derfor ikke kobles direkte til ét bestemt resultat. Den var en del af den ledelsesdisciplin, der understøttede en mere ensartet eksekvering og den samlede kommercielle udvikling.',
    insights: [],
    mfg_help: 'MFG Advisory kan hjælpe med at afklare beslutningsrum, roller og eskalationsveje, så ansvar flyttes ud i organisationen på en kontrolleret måde — og uden at ledelsen mister indsigt i effekt og risici.',
    image_url: 'assets/images/cases/case-06-lokalt-mandat-faelles-retning.jpg',
    cta_text: 'Book en strategisk samtale', cta_url: 'kontakt.html',
    sort_order: 6, is_featured: false, status: 'published'
  },
  {
    id: 'case7', slug: 'case-07-kundeloftet-som-adfaerd',
    title: 'Kundeløftet blev gjort til adfærd — ikke en plakat',
    category: 'kultur',
    org_type: 'SENG · Kundeoplevelse · Fælles adfærd · Data og læring',
    teaser: 'Mission, kundeløfter, træning og kundedata blev koblet sammen, så den ønskede kundeoplevelse kunne genkendes i den daglige drift.',
    challenge: 'En organisation kan have stærke formuleringer om kunden uden at skabe en ensartet oplevelse. Når butikker og funktioner fortolker løftet forskelligt, opstår variation i rådgivning, service, overlevering og opfølgning.',
    responsibility: 'Jeg havde ansvar for både retail og kundeservice og kunne derfor arbejde med kundeoplevelsen på tværs af butikker, kundeservice, salg og de processer, der forbandt dem.',
    approach: [
      'Mission, vision og kundeløfter blev oversat til konkrete forventninger til adfærd og service.',
      'Retail Academy og den lokale lederopfølgning gjorde kundeløftet til en del af træningen og hverdagen.',
      'NPS, kundefeedback og data fra serviceplatformen blev brugt til at finde mønstre frem for kun at håndtere enkeltsager.',
      'Fejl i overleveringer og gentagne kundehændelser blev behandlet som fælles læring på tværs af funktioner.'
    ],
    key_figures: [
      { value: '+10 pp', label: 'NPS' },
      { value: '32', label: 'Butikker' },
      { value: 'DK + SE', label: 'Kundeservice' }
    ],
    result: 'NPS blev forbedret med 10 procentpoint, og organisationen fik et mere fælles sprog for den ønskede kundeoplevelse. Forbedringen havde flere årsager, herunder træning, processer, ledelse, CRM og kommercielle ændringer. Kulturens bidrag var at gøre kundeoplevelsen til et fælles ansvar frem for en opgave for kundeservice alene.',
    insights: [],
    mfg_help: 'MFG Advisory kan hjælpe med at omsætte værdier og kundeløfter til observerbar adfærd, ledelsespraksis og få relevante målepunkter. Målet er at gøre kulturen konkret nok til, at den kan trænes, følges og udvikles.',
    image_url: 'assets/images/cases/case-07-kundeloftet-som-adfaerd.jpg',
    cta_text: 'Book en strategisk samtale', cta_url: 'kontakt.html',
    sort_order: 7, is_featured: true, status: 'published'
  },
  {
    id: 'case8', slug: 'case-08-aaben-performancekultur',
    title: 'Fra lokale sandheder til en åben performancekultur',
    category: 'kultur',
    org_type: 'Performancekultur · Transparens · Ordentlig opfølgning',
    teaser: 'Fælles data og tydelige forventninger gjorde det lettere at tage problemer op tidligt, støtte lederne og placere ansvar på et fair grundlag.',
    challenge: 'Når hver enhed har sin egen forklaring på performance, bliver samtalen hurtigt personlig eller defensiv. Manglende fælles definitioner kan samtidig skjule problemer, indtil de er blevet dyre for mennesker, kunder og forretning.',
    responsibility: 'Min opgave var at skabe større transparens uden at reducere ledelse til tal. Data skulle kvalificere samtalen, mens observationer fra driften og feedback fra ledere, medarbejdere og kunder skulle forklare det, tallene ikke viste.',
    approach: [
      'Vi etablerede fælles KPI-definitioner, dashboards og en fast rytme for performancegennemgang.',
      'Forventninger, aftaler, støtte og mulige konsekvenser blev gjort tydelige i de svære samtaler.',
      'Lederne blev opfordret til at udfordre beslutninger og antagelser, når de havde relevant information fra driften.',
      'Opfølgning blev brugt til at finde årsagen og justere indsatsen — ikke til at omskrive historien eller placere skyld.'
    ],
    key_figures: [
      { value: '+15 pp', label: 'eNPS / trivsel' },
      { value: '70 % til 15 %', label: 'Personaleomsætning' },
      { value: 'Fælles', label: 'KPI og opfølgning' }
    ],
    result: 'eNPS steg med 15 procentpoint, og personaleomsætningen blev reduceret fra cirka 70 til 15 procent. Udviklingen var et samlet resultat af onboarding, ledelse, træning, tydelighed og bedre arbejdsformer. Den fælles performancekultur gjorde det lettere at reagere tidligere og behandle både mennesker og resultater ordentligt.',
    insights: [],
    mfg_help: 'MFG Advisory kan diagnosticere de mønstre, der præger virksomhedens performancekultur, og etablere en arbejdsform, hvor data, feedback, ansvar og psykologisk tryghed understøtter hinanden.',
    image_url: 'assets/images/cases/case-08-aaben-performancekultur.jpg',
    cta_text: 'Book en strategisk samtale', cta_url: 'kontakt.html',
    sort_order: 8, is_featured: false, status: 'published'
  },
  {
    id: 'case9', slug: 'case-09-kommerciel-fremdrift',
    title: 'Fra uensartet drift til målbar kommerciel fremdrift',
    category: 'forretning',
    org_type: 'SENG · Retailtransformation · P&L ca. 250 mio. kr. · 32 butikker',
    teaser: 'En fælles salgsmodel, CRM, KPI\u2019er, træning og ledelsesopfølgning bidrog til 21 procent omsætningsvækst det første år.',
    challenge: 'Kæden havde et større potentiale end de aktuelle resultater viste. Performance varierede mellem butikkerne, kundeoplevelsen var ujævn, og organisationen manglede en fælles kommerciel arbejdsform, der forbandt aktiviteter med resultater.',
    responsibility: 'Som Head of Retail & Customer Service havde jeg det samlede ansvar for drift, salgsudvikling, kundeservice og P&L på cirka 250 mio. kr. Opgaven var både at skabe fremdrift her og nu og opbygge en mere robust kommerciel model.',
    approach: [
      'Vi etablerede en databaseret salgsmodel med fælles KPI\u2019er, forecast, pipeline og konverteringsopfølgning.',
      'CRM og FocalScope gav bedre transparens i kundeaktiviteter, service og opfølgning.',
      'Retail Academy, onboarding og lederudvikling blev koblet til de kommercielle prioriteter.',
      'Omnichannel, kampagner, årshjul og butiksbesøg blev samlet i en mere konsekvent eksekveringsrytme.'
    ],
    key_figures: [
      { value: '+21 %', label: 'Omsætning år 1' },
      { value: '+25 %', label: 'Konvertering' },
      { value: '+10 pp', label: 'NPS' }
    ],
    result: 'Organisationen leverede 21 procent omsætningsvækst det første år, forbedrede konverteringen med 25 procent og løftede NPS med 10 procentpoint. Resultaterne blev skabt af ledere og medarbejdere i fællesskab og gennem flere samtidige ændringer. Mit bidrag var at samle retning, struktur, kompetencer og opfølgning i en fælles kommerciel arbejdsform.',
    insights: [],
    mfg_help: 'MFG Advisory kan gennemføre en kommerciel diagnose, identificere hvor potentialet går tabt og omsætte analysen til få prioriterede handlinger med ejerskab, målepunkter og en 90-dages eksekveringsrytme.',
    image_url: 'assets/images/cases/case-09-kommerciel-fremdrift.jpg',
    cta_text: 'Book en strategisk samtale', cta_url: 'kontakt.html',
    sort_order: 9, is_featured: false, status: 'published'
  },
  {
    id: 'case10', slug: 'case-10-fra-6-til-37-mio',
    title: 'Fra 6 til 37 mio. kr. i årlig omsætning',
    category: 'forretning',
    org_type: 'Bang & Olufsen · Franchisepartner · Lokal markedsudvikling · B2B og retail',
    teaser: 'En langsigtet partnerindsats kombinerede pipeline, proaktivt B2B-salg, lokale partnerskaber og konsekvent kommerciel sparring.',
    challenge: 'Forretningen havde et stærkt brand og en god lokal platform, men væksten kunne ikke alene baseres på kundestrømmen i butikken. Potentialet krævede en mere proaktiv salgsmodel og et bredere lokalt økosystem.',
    responsibility: 'Jeg arbejdede tæt sammen med den selvstændige partner om forretningsudvikling, pipeline, aktivitetsniveau og de prioriteringer, der kunne skabe vækst over flere år.',
    approach: [
      'Vi etablerede en mere systematisk pipeline- og aktivitetsstyring med fast opfølgning.',
      'B2B-salget blev udviklet gennem proaktiv bearbejdning af virksomheder og beslutningstagere.',
      'Samarbejder med ejendomsmæglere, udstillingslejligheder og tilbud i forbindelse med ejendomssalg skabte nye indgange til kunder.',
      'Butiksbesøg, sparring, CRM og løbende vurdering af lokale muligheder gjorde det muligt at justere indsatsen over tid.'
    ],
    key_figures: [
      { value: '6 mio.', label: 'Udgangspunkt' },
      { value: '37 mio.', label: 'Årlig omsætning' },
      { value: '6 år', label: 'Udviklingsperiode' }
    ],
    result: 'Forretningens årlige omsætning voksede fra cirka 6 til 37 mio. kr. over seks år. Væksten var partnerens og teamets resultat og blev påvirket af marked, brand, produkter og lokal eksekvering. Mit bidrag var den langsigtede sparring, kommercielle struktur og udviklingen af nye salgsaktiviteter og partnerskaber.',
    insights: [],
    mfg_help: 'MFG Advisory kan hjælpe ejerledede virksomheder og partnerforretninger med at finde nye vækstveje, styrke pipeline og aktivitet samt udvikle en lokal go-to-market-plan, der ikke alene afhænger af eksisterende kundestrøm.',
    image_url: 'assets/images/cases/case-10-fra-6-til-37-mio.jpg',
    cta_text: 'Book en strategisk samtale', cta_url: 'kontakt.html',
    sort_order: 10, is_featured: true, status: 'published'
  },
  {
    id: 'case11', slug: 'case-11-noeglepartnere-vaekst',
    title: '15 nøgleforretninger skabte 32 procent vækst',
    category: 'forretning',
    org_type: 'Bang & Olufsen · 15 nøgleforretninger · Nordisk netværk · Prioriteret partnerudvikling',
    teaser: 'Partnersegmentering og flerårige forretningsplaner koncentrerede indsatsen dér, hvor potentiale og udviklingsvilje var størst.',
    challenge: 'I et netværk på cirka 140 partnerenheder var behovene forskellige, og ressourcerne kunne ikke fordeles ens. En mere målrettet indsats krævede et sagligt grundlag for at prioritere de forretninger, hvor tæt samarbejde kunne flytte mest.',
    responsibility: 'Jeg havde ansvar for performance og udvikling i det nordiske franchisenetværk og arbejdede med at forbinde brandets strategi med partnernes lokale forretningsplaner.',
    approach: [
      'Vi identificerede 15 nøgleforretninger ud fra performance, potentiale, lokal markedsposition og udviklingsvilje.',
      'Hver partner fik en flerårig forretningsplan med prioriteringer for salg, kundeoplevelse, organisation og lokal markedsudvikling.',
      'KPI, forecast, CRM, CSI og pipeline blev brugt i faste reviews og i den løbende sparring.',
      'Træning, events, butiksudvikling og best practice blev målrettet den enkelte partners konkrete muligheder.'
    ],
    key_figures: [
      { value: '15', label: 'Nøgleforretninger' },
      { value: '+32 %', label: 'Samlet vækst' },
      { value: 'TOP50', label: 'Global placering' }
    ],
    result: 'De 15 nøgleforretninger skabte en samlet vækst på 32 procent, og flere blev placeret blandt brandets globale TOP50. Resultaterne var partnernes og deres teams. Min rolle var at kvalificere prioriteringen, udvikle planerne, skabe en fælles opfølgningsstruktur og fastholde fokus over tid.',
    insights: [],
    mfg_help: 'MFG Advisory kan hjælpe kæder og partnerorganisationer med at segmentere porteføljen, prioritere udviklingsressourcer og skabe individuelle planer, der stadig kan styres gennem en fælles kommerciel model.',
    image_url: 'assets/images/cases/case-11-noeglepartnere-vaekst.jpg',
    cta_text: 'Book en strategisk samtale', cta_url: 'kontakt.html',
    sort_order: 11, is_featured: false, status: 'published'
  }
];
