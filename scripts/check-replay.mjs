// Drive the durable-notebook replay: start, a middle turn, and the end. Screenshots + JS errors.
import { chromium } from 'playwright';
import { startPreview } from './preview.mjs';
const out = process.argv[2];
const server = await startPreview(4331);
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('http://127.0.0.1:4331/work/durable-notebook/', { waitUntil: 'networkidle' });
  const replay = page.locator('[data-replay]');
  await replay.scrollIntoViewIfNeeded();
  await replay.screenshot({ path: `${out}/start.png` });
  for (let i = 0; i < 12; i++) await page.click('[data-next]');
  await replay.screenshot({ path: `${out}/mid.png` });
  await page.click('[data-end]');
  await replay.screenshot({ path: `${out}/end.png` });
  const state = await page.evaluate(() => ({
    count: document.querySelector('[data-count]').textContent,
    verdictShown: !document.querySelector('[data-verdict]').hidden,
    gone: document.querySelectorAll('.msg.gone').length,
    files: [...document.querySelectorAll('[data-files] tr')].map((r) => r.textContent),
  }));
  console.log(JSON.stringify(state, null, 1));
  console.log('errors:', errors.length ? errors : 'none');
} finally {
  await browser.close();
  server.kill();
}
