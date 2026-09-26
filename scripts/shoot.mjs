import { launchBrowser } from './browser.mjs';
import { mkdir } from 'node:fs/promises';

const OUT = process.env.SHOT_DIR || '/tmp/claude-0/-home-user-Muralistique/8a758518-533c-5049-a66a-79be8d5c24c0/scratchpad/shots';
const BASE = process.env.BASE || 'http://localhost:4321';
const targets = (process.env.PAGES || '/').split(',');
const widths = (process.env.WIDTHS || '1440').split(',').map(Number);

await mkdir(OUT, { recursive: true });
const browser = await launchBrowser();

for (const width of widths) {
  const ctx = await browser.newContext({ viewport: { width, height: 900 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => console.log(`  ! JS error: ${e.message}`));
  page.on('console', (m) => { if (m.type() === 'error') console.log(`  ! console: ${m.text().slice(0, 160)}`); });
  for (const target of targets) {
    const name = (target.replace(/[^\w]+/g, '_') || 'home').replace(/^_|_$/g, '') || 'home';
    await page.goto(BASE + target, { waitUntil: 'networkidle' });
    // laisser jouer les animations d'entrée, puis tout révéler pour la capture
    await page.waitForTimeout(1400);
    await page.evaluate(async () => {
      const step = window.innerHeight * 0.8;
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 90));
      }
      window.scrollTo(0, 0);
      await new Promise((r) => setTimeout(r, 400));
    });
    // Forcer l'état final des apparitions : la capture ne doit pas attraper
    // une transition en cours.
    await page.evaluate(() => {
      document.querySelectorAll('[data-reveal]').forEach((el) => {
        el.classList.add('is-revealed');
        el.style.transition = 'none';
      });
    });
    await page.waitForTimeout(500);
    const file = `${OUT}/${name}-${width}.png`;
    await page.screenshot({ path: file, fullPage: true });
    const h = await page.evaluate(() => document.body.scrollHeight);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    console.log(`${file}  height=${h}px  h-overflow=${overflow}`);
  }
  await ctx.close();
}
await browser.close();
