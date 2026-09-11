import { chromium } from 'playwright';
import fs from 'fs';

const BASE = 'http://localhost:5173';
const OUT = 'C:/tmp/verify_shots/';
fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
const page = await ctx.newPage();

const findings = [];

async function shot(name) {
  const p = OUT + name + '.png';
  await page.screenshot({ path: p });
  return p;
}

async function step(label, fn) {
  try {
    await fn();
    console.log('OK  ' + label);
  } catch(e) {
    console.log('ERR ' + label + ' :: ' + e.message.slice(0, 120));
    findings.push(label + ': ' + e.message.slice(0, 120));
  }
}

// ── LANDING ────────────────────────────────────────────────────────────────────
await page.goto(BASE, { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);
await shot('01_landing');

await step('Landing - h1 typewriter', async () => {
  const h1 = await page.$eval('h1', el => el.textContent.trim());
  console.log('   h1:', h1.slice(0, 80));
  if (h1.length < 3) throw new Error('H1 empty');
});

await step('Landing - nav has Войти button', async () => {
  const nav = await page.$eval('nav', el => el.textContent);
  if (!nav.includes('Войти') && !nav.includes('Вуруд')) throw new Error('No login button in nav');
});

await step('Landing - vacancies preview visible', async () => {
  const body = await page.textContent('body');
  if (!body.includes('вакансии') && !body.includes('Вакансияҳо')) throw new Error('No vacancies section found');
});

await step('Landing - ZAKA widget in DOM', async () => {
  const body = await page.textContent('body');
  if (!body.includes('ZAKA')) throw new Error('ZAKA not found on page');
});

// ── AUTH ───────────────────────────────────────────────────────────────────────
await page.goto(BASE + '/auth', { waitUntil: 'networkidle' });
await page.waitForTimeout(500);
await shot('02_auth_login');

await step('Auth - login form renders', async () => {
  const body = await page.textContent('body');
  if (!body.includes('Вход') && !body.includes('Вуруд')) throw new Error('Login tab not found');
  const emailInp = await page.$('input[type="email"]');
  if (!emailInp) throw new Error('Email input missing');
});

await step('Auth - switch to register shows name field', async () => {
  const btns = await page.$$('button');
  for (const btn of btns) {
    const t = await btn.textContent();
    if (t.includes('Регистр') || t.includes('Сабтном')) { await btn.click(); break; }
  }
  await page.waitForTimeout(400);
  await shot('02b_auth_register');
  const nameInp = await page.$('input[placeholder*="Алишер"]');
  if (!nameInp) throw new Error('Name field did not appear');
});

await step('Auth - register new user', async () => {
  const nameInp = await page.$('input[placeholder*="Алишер"]');
  await nameInp.fill('Тест Верификация');
  const emailInp = await page.$('input[type="email"]');
  await emailInp.fill('verify' + Date.now() + '@test.com');
  const pwInp = await page.$('input[type="password"]');
  await pwInp.fill('test1234');
  const submit = await page.$('button[type="submit"]');
  await submit.click();
  await page.waitForTimeout(800);
  const url = page.url();
  console.log('   URL after register:', url);
  if (url.includes('/auth')) throw new Error('Still on /auth after register');
});

// ── NAVBAR LOGGED IN ───────────────────────────────────────────────────────────
await page.goto(BASE, { waitUntil: 'networkidle' });
await shot('03_landing_logged_in');

await step('Navbar - avatar shown (no Войти button)', async () => {
  const nav = await page.$eval('nav', el => el.textContent);
  const hasLogin = nav.includes('Войти') || nav.includes('Вуруд');
  console.log('   Nav still has Войти:', hasLogin);
  if (hasLogin) throw new Error('Войти still visible after login');
});

// ── VACANCIES ─────────────────────────────────────────────────────────────────
await page.goto(BASE + '/vacancies', { waitUntil: 'networkidle' });
await page.waitForTimeout(500);
await shot('04_vacancies');

await step('Vacancies - cards visible', async () => {
  const body = await page.textContent('body');
  if (!body.includes('Frontend') && !body.includes('Developer') && !body.includes('Разработ')) throw new Error('No vacancy content');
  console.log('   Vacancies page has content');
});

await step('Vacancies - search filter works', async () => {
  const inp = await page.$('input');
  await inp.fill('Frontend');
  await page.waitForTimeout(400);
  await shot('04b_search_frontend');
  const body = await page.textContent('body');
  if (!body.toLowerCase().includes('frontend')) throw new Error('Search result empty');
});

await step('Vacancies - clear search', async () => {
  const inp = await page.$('input');
  await inp.fill('');
  await page.waitForTimeout(300);
});

// ── QUIZ ──────────────────────────────────────────────────────────────────────
await page.goto(BASE + '/quiz', { waitUntil: 'networkidle' });
await shot('05_quiz_start');
await page.waitForTimeout(3000); // wait for full typewriter

await step('Quiz - robot question types out', async () => {
  await shot('05b_quiz_typed');
  const progress = await page.$('div[class*="h-1.5 rounded-full bg-gradient"]');
  if (!progress) throw new Error('Progress bar not found');
  console.log('   Quiz progress bar visible');
});

await step('Quiz - answer options appear after typing', async () => {
  const opts = await page.$$('button[class*="border-2"]');
  console.log('   Options visible:', opts.length);
  if (opts.length === 0) throw new Error('No answer options after 3 seconds');
});

await step('Quiz - select an answer and go next', async () => {
  const opts = await page.$$('button[class*="border-2"]');
  await opts[0].click();
  await page.waitForTimeout(300);
  await shot('05c_quiz_answered');
  // Click next
  const allBtns = await page.$$('button');
  for (const btn of allBtns) {
    const t = await btn.textContent();
    if (t.includes('Далее') || t.includes('Давом')) { await btn.click(); break; }
  }
  await page.waitForTimeout(1800);
  await shot('05d_quiz_q2');
});

// ── IQ TEST ───────────────────────────────────────────────────────────────────
await page.goto(BASE + '/iq', { waitUntil: 'networkidle' });
await shot('06_iq_intro');

await step('IQ - intro robot chat visible', async () => {
  const body = await page.textContent('body');
  if (!body.includes('ZAKA') && !body.includes('IQ')) throw new Error('IQ intro missing');
});

await step('IQ - start button appears after messages', async () => {
  await page.waitForTimeout(6000);
  await shot('06b_iq_ready');
  const body = await page.textContent('body');
  const hasStart = body.includes('Начать') || body.includes('оғоз');
  console.log('   Start button text visible:', hasStart);
  if (!hasStart) throw new Error('Start button did not appear after 6s');
});

// ── MY VACANCIES ───────────────────────────────────────────────────────────────
await page.goto(BASE + '/my-vacancies', { waitUntil: 'networkidle' });
await shot('07_my_vacancies');

await step('MyVacancies - page renders (not redirected to /auth)', async () => {
  const url = page.url();
  console.log('   URL:', url);
  if (url.includes('/auth')) throw new Error('Redirected to auth - user not persisted');
  const body = await page.textContent('body');
  const ok = body.includes('вакансии') || body.includes('Вакансияҳо') || body.includes('Вакансии');
  if (!ok) throw new Error('My vacancies content not found');
});

// ── POST VACANCY ──────────────────────────────────────────────────────────────
await page.goto(BASE + '/post-vacancy', { waitUntil: 'networkidle' });
await shot('08_post_vacancy');

await step('PostVacancy - form renders', async () => {
  const body = await page.textContent('body');
  if (!body.includes('вакансию') && !body.includes('Вакансия') && !body.includes('вакансияро')) throw new Error('PostVacancy form not found');
});

await step('PostVacancy - contact pre-filled with user email', async () => {
  const allInputs = await page.$$('input');
  let found = '';
  for (const inp of allInputs) {
    const v = await inp.inputValue();
    if (v.includes('@')) { found = v; break; }
  }
  console.log('   Contact pre-filled:', found || '(empty)');
  if (!found) throw new Error('Email not pre-filled for logged-in user');
});

// ── ZAKA CHAT ─────────────────────────────────────────────────────────────────
await page.goto(BASE, { waitUntil: 'networkidle' });
await page.waitForTimeout(1200);

await step('ZAKA - open chat widget', async () => {
  const zakaBtn = await page.$('#zaka-btn');
  if (!zakaBtn) throw new Error('ZAKA button (#zaka-btn) not found');
  await zakaBtn.click({ force: true });
  await page.waitForTimeout(800);
  await shot('09_zaka_open');
  const body = await page.textContent('body');
  if (!body.includes('Чем могу') && !body.includes('Ба ту') && !body.includes('Привет')) throw new Error('Chat did not open / no greeting');
});

await step('ZAKA - send message and get response', async () => {
  const inp = await page.$('input[placeholder*="вопрос"], input[placeholder*="Савол"]');
  if (!inp) throw new Error('Chat input not found');
  await inp.fill('Какие зарплаты в IT?');
  await inp.press('Enter');
  await page.waitForTimeout(4000);
  await shot('09b_zaka_response');
  const body = await page.textContent('body');
  const hasReply = body.includes('сом') || body.includes('тыс') || body.includes('IT') || body.includes('программ');
  console.log('   Got meaningful reply:', hasReply);
  if (!hasReply) throw new Error('No meaningful response received');
});

// ── DARK MODE ─────────────────────────────────────────────────────────────────
await page.goto(BASE, { waitUntil: 'networkidle' });

await step('Dark mode toggle', async () => {
  const moonBtn = await page.$('#theme-toggle');
  if (moonBtn) {
    await moonBtn.click();
    await page.waitForTimeout(300);
    await shot('10_dark_mode');
    console.log('   Dark mode toggled');
  } else {
    throw new Error('Theme toggle (#theme-toggle) not found');
  }
});

await browser.close();

console.log('\n==SUMMARY==');
console.log('Issues:', findings.length);
findings.forEach((f, i) => console.log((i+1) + '. ' + f));
if (findings.length === 0) console.log('All checks passed.');
