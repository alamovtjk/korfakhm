import { chromium } from 'playwright';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.setViewportSize({ width: 1440, height: 900 });
await page.goto('https://alteno-dev-silk.vercel.app/', { waitUntil: 'networkidle', timeout: 30000 });
await page.waitForTimeout(3000);

// Screenshot hero section
await page.screenshot({ path: 'alteno_hero.png', clip: { x: 0, y: 0, width: 1440, height: 900 } });

// Screenshot cards section
await page.screenshot({ path: 'alteno_cards.png', clip: { x: 0, y: 900, width: 1440, height: 800 } });

// Get all button styles
const btnStyles = await page.evaluate(() => {
  const buttons = [...document.querySelectorAll('button, a[href]')].slice(0, 5);
  return buttons.map(b => ({
    text: b.textContent.trim().slice(0, 30),
    bg: getComputedStyle(b).background,
    border: getComputedStyle(b).border,
    borderRadius: getComputedStyle(b).borderRadius,
    padding: getComputedStyle(b).padding,
    color: getComputedStyle(b).color,
    fontSize: getComputedStyle(b).fontSize,
    fontWeight: getComputedStyle(b).fontWeight,
  }));
});
console.log('BUTTONS:', JSON.stringify(btnStyles, null, 2));

// Get card styles
const cardStyles = await page.evaluate(() => {
  const cards = [...document.querySelectorAll('[class*="card"], [class*="glass"], section > div > div')].slice(0, 3);
  return cards.map(c => ({
    tag: c.tagName,
    bg: getComputedStyle(c).background.slice(0, 100),
    border: getComputedStyle(c).border,
    borderRadius: getComputedStyle(c).borderRadius,
    backdropFilter: getComputedStyle(c).backdropFilter,
    boxShadow: getComputedStyle(c).boxShadow.slice(0, 100),
    padding: getComputedStyle(c).padding,
  }));
});
console.log('CARDS:', JSON.stringify(cardStyles, null, 2));

await browser.close();