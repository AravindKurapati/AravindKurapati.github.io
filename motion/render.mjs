// Render the hero loop. Every frame is loop.html's seek(t); nothing depends on wall-clock time.
//   node motion/render.mjs sheet       one frame per beat, tiled into out/contact.png
//   node motion/render.mjs check       first frame vs the frame at t = T (must match)
//   node motion/render.mjs full        60 fps, 4 subframes blended per frame, into public/loop/
//   node motion/render.mjs encode      re-encode from motion/frames without re-capturing
import { chromium } from 'playwright';
import ffmpeg from 'ffmpeg-static';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');
const OUT = path.join(HERE, 'out');
const FRAMES = path.join(HERE, 'frames');
const PUBLIC = path.join(ROOT, 'public', 'loop');
const FPS = 60, SUB = 4, SIZE = 1440, SHIP = 1080;

const mode = process.argv[2] ?? 'sheet';
const now = JSON.parse(readFileSync(path.join(ROOT, 'src', 'data', 'now.json'), 'utf8'));

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: SIZE, height: SIZE }, deviceScaleFactor: 1 });
await page.addInitScript((data) => { window.NOW = data; window.NOW_RENDER = true; }, now);
await page.goto(pathToFileURL(path.join(HERE, 'loop.html')).href);
await page.evaluate(() => window.ready);
const { T, BEAT, BEATS } = await page.evaluate(() => window.LOOP);
const stage = page.locator('#stage');
const shot = async (t, file) => {
  await page.evaluate((x) => window.seek(x), t);
  await stage.screenshot({ path: file });
};
const run = (args) => execFileSync(ffmpeg, ['-y', '-loglevel', 'error', ...args], { stdio: 'inherit' });

mkdirSync(OUT, { recursive: true });

if (mode === 'sheet') {
  const dir = path.join(OUT, 'beats');
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  for (let n = 0; n < BEATS; n++) {
    // 60% into each beat: after the move on it, before the next state's exit fade.
    await shot(n * BEAT + BEAT * 0.6, path.join(dir, `beat_${String(n + 1).padStart(2, '0')}.png`));
  }
  run(['-i', path.join(dir, 'beat_%02d.png'), '-vf',
    "scale=320:320,drawtext=text='%{eif\\:n+1\\:d}':x=12:y=10:fontsize=22:fontcolor=0x8a8782,tile=7x4:padding=8:color=0xe9e7e3",
    '-frames:v', '1', path.join(OUT, 'contact.png')]);
  console.log(`wrote ${path.join(OUT, 'contact.png')}`);
}

if (mode === 'check') {
  const a = path.join(OUT, 'first.png'), z = path.join(OUT, 'last.png');
  await shot(0, a);
  // Just before the wrap: the true last instant of the loop.
  await shot(T - 1e-6, z);
  const res = spawnSync(ffmpeg, ['-i', a, '-i', z, '-lavfi', 'psnr', '-f', 'null', '-'], { encoding: 'utf8' });
  const line = res.stderr.split('\n').find((l) => l.includes('PSNR')) ?? res.stderr;
  console.log(line.trim());
  // inf = identical. Under 50 dB would show as a stutter at the wrap.
  const db = /average:(inf|[\d.]+)/.exec(line)?.[1];
  if (db !== 'inf' && !(Number(db) >= 50)) { console.error('FAIL: loop does not close'); process.exitCode = 1; }
  else console.log('ok: first frame matches the end of the loop');
}

if (mode === 'full') {
  rmSync(FRAMES, { recursive: true, force: true });
  mkdirSync(FRAMES, { recursive: true });
  const total = Math.round(T * FPS) * SUB;
  const t0 = Date.now();
  for (let i = 0; i < total; i++) {
    await shot(i / (FPS * SUB), path.join(FRAMES, `f_${String(i).padStart(5, '0')}.png`));
    if (i % 240 === 0) console.log(`${i}/${total} subframes, ${((Date.now() - t0) / 1000).toFixed(0)}s`);
  }
}

if (mode === 'full' || mode === 'encode') {
  mkdirSync(PUBLIC, { recursive: true });
  // tmix averages each frame with the 3 before it (motion blur); framestep keeps every 4th.
  // No expressions in this filter string: commas inside them need escaping that is easy to lose.
  const blur = `tmix=frames=${SUB},framestep=${SUB},setpts=N/(${FPS}*TB),scale=${SHIP}:${SHIP}:flags=lanczos`;
  const src = ['-framerate', String(FPS * SUB), '-i', path.join(FRAMES, 'f_%05d.png'), '-vf', blur, '-r', String(FPS)];
  run([...src, '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '22', '-preset', 'slow', '-movflags', '+faststart', '-an', path.join(PUBLIC, 'loop.mp4')]);
  run([...src, '-c:v', 'libvpx-vp9', '-b:v', '0', '-crf', '34', '-row-mt', '1', '-an', path.join(PUBLIC, 'loop.webm')]);
  run(['-i', path.join(FRAMES, 'f_00000.png'), '-vf', `scale=${SHIP}:${SHIP}`, '-q:v', '3', path.join(PUBLIC, 'loop-poster.jpg')]);
  // Guard against the 240 fps mistake: the shipped file must have exactly T * FPS frames.
  const probe = spawnSync(ffmpeg, ['-i', path.join(PUBLIC, 'loop.mp4'), '-f', 'null', '-'], { encoding: 'utf8' }).stderr;
  const frames = Number([...probe.matchAll(/frame=\s*(\d+)/g)].at(-1)?.[1]);
  if (frames !== Math.round(T * FPS)) throw new Error(`loop.mp4 has ${frames} frames, expected ${Math.round(T * FPS)}`);
  writeFileSync(path.join(PUBLIC, 'meta.json'), JSON.stringify({ month: now.month, seconds: T, fps: FPS, frames }, null, 2));
  console.log(`wrote ${PUBLIC} (${frames} frames)`);
}

await browser.close();
