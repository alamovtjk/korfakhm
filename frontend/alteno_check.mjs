import { chromium } from 'playwright';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.setViewportSize({ width: 1440, height: 900 });
await page.goto('https://alteno-dev-silk.vercel.app/', { waitUntil: 'networkidle', timeout: 30000 });
await page.waitForTimeout(3000);
await page.screenshot({ path: 'alteno_full.png', fullPage: true });
const styles = await page.evaluate(() => {
  const cs = getComputedStyle(document.body);
  const vars = {};
  for (const sheet of document.styleSheets) {
    try {
      for (const rule of sheet.cssRules) {
        if (rule.selectorText === ':root') {
          for (const prop of rule.style) {
            if (prop.startsWith('--')) vars[prop] = rule.style.getPropertyValue(prop).trim();
          }
        }
      }
    } catch(e) {}
  }
  return {
    bodyBg: cs.backgroundColor, bodyColor: cs.color, fontFamily: cs.fontFamily,
    cssVars: vars, title: document.title,
    h1: document.querySelector('h1')?.textContent?.trim(),
    nav: document.querySelector('nav')?.textContent?.trim()?.slice(0,300),
    allText: document.body.innerText.slice(0, 2000)
  };
});
console.log(JSON.stringify(styles, null, 2));
await browser.close();