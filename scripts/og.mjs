// Render a 1200x630 share card per page into public/og/<name>.png (node scripts/og.mjs).
// Base.astro maps each URL to its card with ogName(); keep the two lists in step.
import { chromium } from 'playwright';
import { mkdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'public', 'og');
// Inlined: a page built with setContent cannot load file:// images.
const photoBuf = await sharp(path.join(ROOT, 'src', 'assets', 'platform.jpeg')).resize({ width: 900 }).jpeg({ quality: 82 }).toBuffer();
const photo = `data:image/jpeg;base64,${photoBuf.toString('base64')}`;

const tones = {
  white: ['#ffffff', '#141312', '#8a8782'],
  sky: ['#cfe0f1', '#141312', '#4a5360'],
  platform: ['#f3d15c', '#141312', '#4f4630'],
  slate: ['#3e4650', '#f7f5f1', '#c7c9cc'],
  signal: ['#c63a2e', '#fff6f2', '#f7cfc5'],
};

const work = (id) => {
  const md = readFileSync(path.join(ROOT, 'src', 'content', 'work', `${id}.md`), 'utf8');
  const get = (k) => md.match(new RegExp(`^${k}: (.*)$`, 'm'))[1].replace(/^"|"$/g, '');
  return { title: get('title'), kicker: `Work · ${get('kind')}`, big: md.match(/value: "(.*)"/)[1], sub: get('tagline') };
};

const cards = [
  { name: 'home', kicker: 'AI engineer · New York', title: 'Aravind Kurapati', sub: "Forward-deployed engineer at Virtusa. NYU '25.", tone: 'white', photo: true },
  { name: 'now', kicker: 'Now', title: "What I'm up to, outside work.", sub: 'Updated monthly from trackers I built.', tone: 'sky' },
  { name: 'writing', kicker: 'Writing', title: 'Written by me, not for me.', sub: 'Agents, Claude Code, research, ML infrastructure.', tone: 'platform' },
  { name: 'after-hours', kicker: 'After hours', title: 'Films, and a month in Europe.', sub: 'Letterboxd top four and summer 2024.', tone: 'signal' },
  { name: 'colophon', kicker: 'Colophon', title: 'How this site is built.', sub: 'Astro, a monthly tracker pipeline, and what never leaves my laptop.', tone: 'slate' },
  { name: 'work-agent-flight-recorder', ...work('agent-flight-recorder'), tone: 'platform' },
  { name: 'work-durable-notebook', ...work('durable-notebook'), tone: 'sky' },
  { name: 'work-alphafold', ...work('alphafold'), tone: 'slate' },
];

const html = (c) => {
  const [bg, ink, muted] = tones[c.tone];
  return `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif&family=Newsreader:opsz@6..72&family=JetBrains+Mono:wght@500&display=block" rel="stylesheet">
<style>
  html,body{margin:0}
  .card{width:1200px;height:630px;box-sizing:border-box;padding:28px;background:#e9e7e3;display:flex;gap:20px}
  .main{flex:1;background:${bg};color:${ink};border-radius:30px;padding:56px 60px;display:flex;flex-direction:column}
  .k{font-family:'JetBrains Mono';font-size:22px;letter-spacing:.09em;text-transform:uppercase;color:${muted}}
  h1{font-family:'Instrument Serif';font-weight:400;font-size:${c.photo ? 104 : 88}px;line-height:.98;margin:26px 0 0;letter-spacing:-.01em}
  .big{font-family:'Instrument Serif';font-size:64px;margin-top:22px;line-height:1}
  .sub{font-family:'Newsreader';font-size:32px;line-height:1.35;margin-top:auto;color:${ink};opacity:.85;max-width:24ch}
  .url{font-family:'JetBrains Mono';font-size:20px;color:${muted};margin-top:18px}
  .photo{width:430px;border-radius:30px;background:url('${photo}') center 60%/cover}
</style></head><body><div class="card"><div class="main">
  <div class="k">${c.kicker}</div><h1>${c.title}</h1>${c.big ? `<div class="big">${c.big}</div>` : ''}
  ${c.sub ? `<div class="sub">${c.sub}</div>` : '<div style="margin-top:auto"></div>'}
  <div class="url">aravindkurapati.github.io</div>
</div>${c.photo ? '<div class="photo"></div>' : ''}</div></body></html>`;
};

mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
for (const c of cards) {
  await page.setContent(html(c), { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: path.join(OUT, `${c.name}.png`) });
  console.log(`og/${c.name}.png`);
}
await browser.close();
