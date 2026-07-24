# Microsoft Clarity — opsætning og brug

MFG Advisory bruger **Microsoft Clarity** til statistik og adfærdsanalyse.
Clarity er gratis, kræver ingen kreditkort, og der bygges ingen egen
statistikdatabase i dette projekt — alt vises i Microsoft Clarity's eget
dashboard.

Der bruges **ikke** Plausible Analytics eller Google Analytics.

---

## 1. Opret en gratis Microsoft Clarity-konto

1. Gå til **https://clarity.microsoft.com/**
2. Klik **"Sign up"** (eller **"Get started"**).
3. Log ind med en Microsoft-konto, Google-konto eller Facebook-konto —
   vælg den, der er nemmest for dig (fx din almindelige Gmail-konto virker fint).
4. Der kræves ingen betaling eller kreditkort noget sted i processen.

## 2. Opret et nyt projekt

1. Klik **"Add new project"** (eller **"+ New project"**).
2. Udfyld:
   - **Name**: fx `MFG Advisory`
   - **Website URL**: `https://mfgadvisory.dk` (eller den adresse, sitet
     faktisk kører på — kan rettes senere)
   - **Category**: vælg den, der passer bedst (fx "Business" eller "Consulting")
3. Klik **"Create"** / **"Add project"**.

## 3. Find og kopiér dit Project ID

Efter oprettelsen viser Clarity et **installations-script**. Du skal
**ikke** indsætte hele scriptet — kun selve Project ID'et.

Project ID'et er en kort kode (bogstaver/tal), som findes:

- I det viste installationsscript, i denne del:
  `"https://www.clarity.ms/tag/" + "XXXXXXXXXX"` — det er `XXXXXXXXXX`, du skal bruge.
- Eller under **Settings → Setup** / **"How to install"** i dit Clarity-projekt,
  hvor ID'et også vises separat og kan kopieres direkte.

## 4. Indsæt Project ID i projektet

Åbn filen:

```
assets/js/clarity-config.js
```

Og indsæt dit ID mellem citationstegnene:

```js
window.MFG_CLARITY_PROJECT_ID = 'dit-project-id-her';
```

Gem filen og upload den opdaterede version til GitHub Pages (eller din
hosting). **Dette er det eneste sted i hele projektet, hvor Project ID'et
skal indsættes** — alle sider læser det herfra automatisk.

Er feltet tomt (`''`), indlæses Clarity slet ikke, og Admin → Analytics
viser "Ikke konfigureret".

## 5. Sådan bruges dashboardet

Gå til **https://clarity.microsoft.com/** og log ind, vælg dit projekt
("MFG Advisory"), og du får adgang til:

- **Dashboard** — overblik over besøgende, sidevisninger, sessioner, enheder,
  lande og trafikkilder.
- **Recordings** — session recordings: se (anonymiseret) hvordan rigtige
  besøgende bruger sitet.
- **Heatmaps** — klik-, scroll- og opmærksomheds-heatmaps for de enkelte sider.
- **Custom events** (under **Recordings** eller **Filters**) — her kan du
  filtrere på de events, sitet allerede sender automatisk (se listen
  nedenfor), fx for at se alle sessioner, hvor nogen har klikket "Book en
  strategisk samtale".

Der går typisk nogle timer, før de første data begynder at vise sig i
dashboardet efter installation.

## Events, der spores automatisk

Følgende handlinger sender allerede et navngivet event til Clarity, så
snart en besøgende har accepteret statistik-cookies:

| Handling | Event-navn |
|---|---|
| Klik på "Book en strategisk samtale" / "Book en samtale" | `book_strategisk_samtale_click` |
| Klik på telefonnummer (`tel:`) | `phone_click` |
| Klik på mailadresse (`mailto:`) | `mail_click` |
| Kontaktformular sendt | `kontaktformular_sendt` |
| Klik på Mennesker i kompasset | `compass_mennesker_click` |
| Klik på Ledelse i kompasset | `compass_ledelse_click` |
| Klik på Kultur i kompasset | `compass_kultur_click` |
| Klik på Forretning i kompasset | `compass_forretning_click` |
| Klik på kompassets centrum ("SKAB RETNING") | `compass_center_click` |
| Download af PDF-filer | `pdf_download` |
| Klik på eksterne links (fx LinkedIn, Nordic Operations) | `external_link_click` |

## Sikkerhed og privatliv

- Der gemmes **ingen** persondata i dette projekt — al statistik ligger
  udelukkende hos Microsoft Clarity.
- Der oprettes **ingen** brugerprofiler i MFG Advisory's egen kode.
- Der sættes **ingen** cookies ud over Microsoft Clarity's egne (og kun
  efter samtykke via cookiebanneret).
- Supabase, admin-login og resten af sitets funktionalitet er helt
  upåvirket af denne integration.
