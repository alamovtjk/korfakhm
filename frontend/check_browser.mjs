import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

const errors = [];
const warnings = [];

page.on('console', msg => {
  if (msg.type() === 'error') errors.push(msg.text());
  if (msg.type() === 'warning') warnings.push(msg.text());
});

page.on('pageerror', err => errors.push('PAGE ERROR: ' + err.message));

await page.goto('http://localhost:5173', { waitUntil: 'networkidle', timeout: 15000 });
await page.waitForTimeout(4000);

// Take screenshot
await page.screenshot({ path: 'debug_screenshot.png', fullPage: true });

// Check if content is visible
const rootContent = await page.$eval('#root', el => el.innerHTML.length);
const bodyBg = await page.$eval('body', el => getComputedStyle(el).backgroundColor);

console.log('ROOT HTML length:', rootContent);
console.log('Body bg:', bodyBg);
console.log('ERRORS:', JSON.stringify(errors, null, 2));
console.log('WARNINGS:', JSON.stringify(warnings, null, 2));

await browser.close();
