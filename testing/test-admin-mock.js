const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  const BASE = 'http://localhost:11001/';
  let failures = 0;
  function check(label, cond) { console.log((cond ? '[OK] ' : '[FAIL] ') + label); if (!cond) failures++; }

  const configOverride = fs.readFileSync('/tmp/test_config_override.js', 'utf8');
  const mockClient = fs.readFileSync('test-mock-supabase.js', 'utf8');

  // Serve our test config + mock client instead of the real files
  await page.route('**/assets/js/supabase-config.js', route => route.fulfill({ contentType: 'application/javascript', body: configOverride }));
  await page.route('**/assets/js/vendor/supabase.js', route => route.fulfill({ contentType: 'application/javascript', body: mockClient }));

  const consoleErrors = [];
  page.on('pageerror', e => consoleErrors.push('PAGEERROR: ' + e.message));
  page.on('console', m => { if (m.type() === 'error' && !m.text().includes('403')) consoleErrors.push(m.text()); });

  // ===== 1. Login screen loads =====
  await page.goto(BASE + 'admin.html');
  await page.waitForTimeout(300);
  check('Login screen visible', await page.isVisible('#loginBox'));

  // ===== 2. Wrong credentials rejected =====
  await page.fill('#emailInput', 'wrong@example.com');
  await page.fill('#passwordInput', 'wrongpass');
  await page.click('#loginSubmit');
  await page.waitForTimeout(300);
  const errText = await page.textContent('#loginError');
  check('Wrong credentials show an error', errText.includes('Forkert'));
  check('Still on login screen after failed login', await page.isVisible('#loginBox'));

  // ===== 3. Valid non-admin user is rejected with "not admin" message =====
  await page.fill('#emailInput', 'ikke-admin@example.com');
  await page.fill('#passwordInput', 'password123');
  await page.click('#loginSubmit');
  await page.waitForTimeout(400);
  check('Non-admin user sees "no access" screen (not the app)', await page.isVisible('#notAdminBox'));
  const appVisibleForNonAdmin = await page.evaluate(() => document.getElementById('adminApp').classList.contains('visible'));
  check('Non-admin user CANNOT see the admin app', !appVisibleForNonAdmin);
  await page.click('#notAdminLogoutBtn');
  await page.waitForTimeout(300);

  // ===== 4. Valid admin user logs in successfully =====
  await page.fill('#emailInput', 'morten@mfgadvisory.dk');
  await page.fill('#passwordInput', 'RigtigtKodeord123');
  await page.click('#loginSubmit');
  await page.waitForTimeout(500);
  check('Admin user sees the admin app', await page.evaluate(() => document.getElementById('adminApp').classList.contains('visible')));
  const loggedInLabel = await page.textContent('#loggedInAsLabel');
  check('Shows logged-in email', loggedInLabel.includes('morten@mfgadvisory.dk'));

  // ===== 5. Dashboard shows correct counts =====
  await page.waitForTimeout(500);
  const dashboardText = await page.textContent('#section-dashboard');
  check('Dashboard shows case/talk counts from mock DB', dashboardText.includes('2 case') && dashboardText.includes('2 foredrag'));

  // ===== 6. Cases CRUD =====
  await page.click('[data-section-btn="cases"]');
  await page.waitForTimeout(300);
  let caseRows = await page.evaluate(() => document.querySelectorAll('#casesList .testi-card').length);
  check('Cases section shows 2 seeded cases', caseRows === 2);

  await page.click('#addCaseBtn');
  await page.waitForTimeout(300);
  caseRows = await page.evaluate(() => document.querySelectorAll('#casesList .testi-card').length);
  check('Adding a case increases count to 3', caseRows === 3);

  const newCaseId = await page.evaluate(() => window.__MOCK_DB__.cases[window.__MOCK_DB__.cases.length - 1].id);
  await page.fill(`[data-case-id="${newCaseId}"] [data-cf="title"]`, 'Playwright Test Case');
  await page.selectOption(`[data-case-id="${newCaseId}"] [data-cf="status"]`, 'published');
  await page.click(`[data-case-save="${newCaseId}"]`);
  await page.waitForTimeout(400);
  const savedTitle = await page.evaluate((id) => window.__MOCK_DB__.cases.find(c => c.id === id).title, newCaseId);
  check('Case save persists new title to mock DB', savedTitle === 'Playwright Test Case');
  const savedStatus = await page.evaluate((id) => window.__MOCK_DB__.cases.find(c => c.id === id).status, newCaseId);
  check('Case save persists published status', savedStatus === 'published');

  page.once('dialog', d => d.accept());
  await page.click(`[data-case-delete="${newCaseId}"]`);
  await page.waitForTimeout(400);
  const afterDelete = await page.evaluate(() => document.querySelectorAll('#casesList .testi-card').length);
  check('Case delete (with confirm) removes the row', afterDelete === 2);

  // ===== 7. Foredrag CRUD =====
  await page.click('[data-section-btn="foredrag"]');
  await page.waitForTimeout(300);
  let talkRows = await page.evaluate(() => document.querySelectorAll('#foredragList .testi-card').length);
  check('Foredrag section shows 2 seeded talks', talkRows === 2);

  await page.click('#addForedragBtn');
  await page.waitForTimeout(300);
  talkRows = await page.evaluate(() => document.querySelectorAll('#foredragList .testi-card').length);
  check('Adding a talk increases count to 3', talkRows === 3);

  const newTalkId = await page.evaluate(() => window.__MOCK_DB__.talks[window.__MOCK_DB__.talks.length - 1].id);
  await page.click(`[data-talk-id="${newTalkId}"] summary`);
  await page.fill(`[data-talk-id="${newTalkId}"] [data-tf="title"]`, 'Playwright Test Talk');
  await page.check(`[data-talk-id="${newTalkId}"] [data-tf="is_featured"]`);
  await page.selectOption(`[data-talk-id="${newTalkId}"] [data-tf="status"]`, 'published');
  await page.click(`[data-talk-save="${newTalkId}"]`);
  await page.waitForTimeout(400);
  const savedTalk = await page.evaluate((id) => window.__MOCK_DB__.talks.find(t => t.id === id), newTalkId);
  check('Talk save persists title', savedTalk.title === 'Playwright Test Talk');
  check('Talk save persists is_featured=true', savedTalk.is_featured === true);
  check('Talk save persists status=published', savedTalk.status === 'published');

  page.once('dialog', d => d.accept());
  await page.click(`[data-talk-delete="${newTalkId}"]`);
  await page.waitForTimeout(400);
  const talksAfterDelete = await page.evaluate(() => document.querySelectorAll('#foredragList .testi-card').length);
  check('Talk delete (with confirm) removes the row', talksAfterDelete === 2);

  // reorder test
  const idsBefore = await page.evaluate(() => window.__MOCK_DB__.talks.map(t => t.id + ':' + t.sort_order));
  await page.click('[data-talk-move-down="t1"]');
  await page.waitForTimeout(300);
  const idsAfter = await page.evaluate(() => window.__MOCK_DB__.talks.map(t => t.id + ':' + t.sort_order));
  check('Reorder (move down) changed sort_order values', JSON.stringify(idsBefore) !== JSON.stringify(idsAfter));

  // ===== 8. Testimonials CRUD =====
  await page.click('[data-section-btn="testimonials"]');
  await page.waitForTimeout(300);
  await page.click('#addTestiBtn');
  await page.waitForTimeout(300);
  const testiCount = await page.evaluate(() => window.__MOCK_DB__.testimonials.length);
  check('Adding a testimonial persists to mock DB', testiCount === 1);

  // ===== 9. Page text editing =====
  await page.click('[data-section-btn="index"]');
  await page.waitForTimeout(300);
  const heroInputExists = await page.evaluate(() => !!document.querySelector('[data-pc-id]'));
  check('Page text section shows editable fields for index', heroInputExists);

  const firstFieldId = await page.evaluate(() => document.querySelector('[data-pc-id]').getAttribute('data-pc-id'));
  await page.fill(`[data-pc-id="${firstFieldId}"]`, 'Changed via test');
  await page.click('[data-save-page-text="index"]');
  await page.waitForTimeout(400);
  const savedValue = await page.evaluate((id) => window.__MOCK_DB__.page_content.find(p => p.id === id).value, firstFieldId);
  check('Page text save persists new value to mock DB', savedValue === 'Changed via test');

  // ===== 10. SEO editing =====
  await page.click('[data-section-btn="seo"]');
  await page.waitForTimeout(300);
  await page.fill('[data-seof="title"]', 'New SEO Title Test');
  await page.click('[data-seo-save="s1"]');
  await page.waitForTimeout(400);
  const seoSaved = await page.evaluate(() => window.__MOCK_DB__.seo_metadata.find(s => s.id === 's1').title);
  check('SEO save persists new title', seoSaved === 'New SEO Title Test');

  // ===== 11. Image upload flow (mocked storage) =====
  await page.click('[data-section-btn="cases"]');
  await page.waitForTimeout(300);
  const firstCaseId = await page.evaluate(() => window.__MOCK_DB__.cases[0].id);
  const fileInput = await page.$(`[data-case-id="${firstCaseId}"] [data-cf-image]`);
  await fileInput.setInputFiles({ name: 'test.png', mimeType: 'image/png', buffer: Buffer.from('fake-image-data') });
  await page.click(`[data-case-save="${firstCaseId}"]`);
  await page.waitForTimeout(400);
  const imagePath = await page.evaluate((id) => window.__MOCK_DB__.cases.find(c => c.id === id).image_path, firstCaseId);
  check('Image upload produces a stored public URL', imagePath && imagePath.includes('mock.supabase.co/storage'));

  // ===== 12. Logout =====
  await page.click('#logoutBtn');
  await page.waitForTimeout(300);
  check('Logout returns to login screen', await page.isVisible('#loginBox'));
  const appHiddenAfterLogout = await page.evaluate(() => !document.getElementById('adminApp').classList.contains('visible'));
  check('Admin app hidden after logout', appHiddenAfterLogout);

  // ===== 13. Forgot password flow =====
  await page.click('#forgotPasswordLink');
  await page.waitForTimeout(200);
  check('Forgot password box shown', await page.isVisible('#forgotBox'));
  await page.fill('#forgotEmailInput', 'morten@mfgadvisory.dk');
  await page.click('#forgotSubmit');
  await page.waitForTimeout(300);
  const forgotSuccess = await page.textContent('#forgotSuccess');
  check('Forgot password shows success message', forgotSuccess.includes('nulstillingslink'));

  // ===== 14. Session persistence: reload page while "logged in" =====
  await page.click('#backToLoginLink');
  await page.fill('#emailInput', 'morten@mfgadvisory.dk');
  await page.fill('#passwordInput', 'RigtigtKodeord123');
  await page.click('#loginSubmit');
  await page.waitForTimeout(400);
  await page.reload();
  await page.waitForTimeout(500);
  check('Session persists across reload (still logged in)', await page.evaluate(() => document.getElementById('adminApp').classList.contains('visible')));

  check('No console/page errors throughout the whole test', consoleErrors.length === 0);
  if (consoleErrors.length) console.log('ERRORS:', JSON.stringify(consoleErrors, null, 2));

  console.log('\n=== TOTAL FAILURES:', failures, '===');
  await browser.close();
  process.exit(failures > 0 ? 1 : 0);
})().catch(e => { console.error('TEST CRASHED:', e); process.exit(1); });
