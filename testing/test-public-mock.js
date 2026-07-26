const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  const BASE = 'http://localhost:11010/';
  let failures = 0;
  function check(label, cond) { console.log((cond ? '[OK] ' : '[FAIL] ') + label); if (!cond) failures++; }

  const configOverride = fs.readFileSync('/tmp/test_config_override.js', 'utf8');
  const mockClient = fs.readFileSync('test-mock-supabase.js', 'utf8');

  await page.route('**/assets/js/supabase-config.js', route => route.fulfill({ contentType: 'application/javascript', body: configOverride }));
  await page.route('**/assets/js/vendor/supabase.js', route => route.fulfill({ contentType: 'application/javascript', body: mockClient }));

  const consoleErrors = [];
  page.on('pageerror', e => consoleErrors.push('PAGEERROR: ' + e.message));

  // ===== 1. Cases page renders from mock Supabase data =====
  await page.goto(BASE + 'cases.html');
  await page.waitForTimeout(500);
  const dynCaseTitles = await page.evaluate(() => Array.from(document.querySelectorAll('[data-cases-list] h4')).map(h => h.textContent));
  check('Cases page renders dynamic cases from Supabase', dynCaseTitles.includes('Produktionsvirksomhed, ca. 60 medarbejdere'));

  // ===== 2. Foredrag page renders from mock Supabase data =====
  await page.goto(BASE + 'foredrag.html');
  await page.waitForTimeout(500);
  const talkTitles = await page.evaluate(() => Array.from(document.querySelectorAll('.talk-card h4')).map(h => h.textContent));
  check('Foredrag page renders talks from Supabase', talkTitles.includes('Ledelse, der skaber retning'));

  // ===== 3. Homepage featured talks =====
  await page.goto(BASE + 'index.html');
  await page.waitForTimeout(500);
  const featuredTitles = await page.evaluate(() => Array.from(document.querySelectorAll('#homepageFeaturedTalks h4')).map(h => h.textContent));
  check('Homepage shows featured talk (is_featured=true)', featuredTitles.includes('Ledelse, der skaber retning'));
  check('Homepage does NOT show non-featured talk', !featuredTitles.includes('Kultur skabes gennem handling'));

  // ===== 4. Page content applied to data-edit fields =====
  const heroBody = await page.evaluate(() => document.querySelector('[data-edit="hero-body"]')?.textContent);
  check('Homepage hero-body text applied from Supabase page_content', heroBody && heroBody.includes("Vi hjælper ejerledere"));

  // ===== 5. Error fallback: Supabase completely unreachable =====
  const context2 = await browser.newContext();
  const page2 = await context2.newPage();
  await page2.route('**/assets/js/supabase-config.js', route => route.fulfill({ contentType: 'application/javascript', body: configOverride }));
  // Do NOT mock vendor/supabase.js this time — let it fail to define window.supabase properly by aborting it
  await page2.route('**/assets/js/vendor/supabase.js', route => route.abort());
  await page2.goto(BASE + 'index.html');
  await page2.waitForTimeout(500);
  const stillHasStaticText = await page2.evaluate(() => document.querySelector('[data-edit="hero-title"]')?.textContent.length > 0);
  check('When Supabase is unreachable, static fallback text is still visible (no blank page)', stillHasStaticText);
  const bodyNotEmpty = await page2.evaluate(() => document.body.textContent.trim().length > 100);
  check('Page body is not empty/blank on Supabase failure', bodyNotEmpty);
  await context2.close();

  check('No console/page errors on the successful-data pages', consoleErrors.length === 0);
  if (consoleErrors.length) console.log('ERRORS:', JSON.stringify(consoleErrors));

  console.log('\n=== TOTAL FAILURES:', failures, '===');
  await browser.close();
  process.exit(failures > 0 ? 1 : 0);
})().catch(e => { console.error('TEST CRASHED:', e); process.exit(1); });
