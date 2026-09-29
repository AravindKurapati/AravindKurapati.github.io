// Screenshot built pages at desktop and phone widths: node scripts/shots.mjs <outdir> [paths...]
import { chromium } from 'playwright';
import { startPreview } from './preview.mjs';

const out = process.argv[2] ?? 'shots';
const paths = process.argv.slice(3).length ? process.argv.slice(3) : ['/', '/now/', '/work/durable-notebook/', '/writing/'];
const server = await startPreview(4329);
const browser = await chromium.launch();
try {
  for (const [name, vp] of [['desk', { width: 1440, height: 900 }], ['phone', { width: 375, height: 812 }]]) {
    const page = await browser.newPage({ viewport: vp, deviceScaleFactor: 1 });
    for (const p of paths) {
      await page.goto(`http://127.0.0.1:4329${p}`, { waitUntil: 'networkidle' });
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      const file = `${out}/${name}${p.replaceAll('/', '_') || '_'}.png`;
      await page.screenshot({ path: file, fullPage: true });
      console.log(file, overflow > 0 ? `HORIZONTAL OVERFLOW ${overflow}px` : 'ok');
    }
  }
} finally {
  await browser.close();
  server.kill();
}
