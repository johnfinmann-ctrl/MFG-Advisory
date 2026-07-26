#!/usr/bin/env node
/* =========================================================================
   MFG Advisory — build-script til Vercel
   =========================================================================
   Formål: Sitet er en almindelig statisk hjemmeside uden byggetrin. For at
   undgå at commit'e rigtige Supabase-nøgler til Git, skriver dette lille
   script dem ind i assets/js/supabase-config.js ud fra miljøvariabler,
   som sættes i Vercel-projektets indstillinger (IKKE i denne fil).

   Brug som "Build Command" i Vercel:
     node scripts/inject-env.js

   Og som "Output Directory": . (roden af projektet)

   Kører du sitet lokalt uden Vercel, kan du i stedet bare udfylde
   assets/js/supabase-config.js manuelt med det samme — scriptet er kun en
   bekvemmelighed for automatiseret deployment.
   ========================================================================= */

const fs = require('fs');
const path = require('path');

const url = process.env.SUPABASE_URL || '';
const key = process.env.SUPABASE_ANON_KEY || '';

if (!url || !key) {
  console.warn('⚠️  SUPABASE_URL og/eller SUPABASE_ANON_KEY er ikke sat som miljøvariabler.');
  console.warn('    supabase-config.js efterlades uændret (sitet falder tilbage til "ikke konfigureret").');
  process.exit(0);
}

const configPath = path.join(__dirname, '..', 'assets', 'js', 'supabase-config.js');
const content = `/* Auto-genereret af scripts/inject-env.js ved deployment — redigér ikke manuelt i produktion. */
window.MFG_SUPABASE_URL = '${url.replace(/'/g, "\\'")}';
window.MFG_SUPABASE_ANON_KEY = '${key.replace(/'/g, "\\'")}';
window.MFG_SUPABASE_STORAGE_BUCKET = 'case-images';
`;

fs.writeFileSync(configPath, content, 'utf8');
console.log('✅ assets/js/supabase-config.js opdateret fra miljøvariabler.');
