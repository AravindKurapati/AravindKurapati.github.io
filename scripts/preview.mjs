// Start `astro preview` on a port without a shell wrapper, so kill() really stops it.
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

export async function startPreview(port) {
  const astro = fileURLToPath(new URL('../node_modules/astro/bin/astro.mjs', import.meta.url));
  const proc = spawn(process.execPath, [astro, 'preview', '--host', '127.0.0.1', '--port', String(port)], { stdio: 'ignore' });
  for (let i = 0; i < 80; i++) {
    try { await fetch(`http://127.0.0.1:${port}/`); return proc; } catch { await new Promise((r) => setTimeout(r, 250)); }
  }
  proc.kill();
  throw new Error(`astro preview did not start on ${port}`);
}
