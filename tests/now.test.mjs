// Guards the privacy boundary: now.json may only carry the fields the site renders.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const now = JSON.parse(readFileSync(new URL('../src/data/now.json', import.meta.url), 'utf8'));

const TOP = ['schema', 'version', 'month', 'generated_at', 'months', 'films', 'books', 'gym', 'yt', 'steps', 'sleep', 'meals', 'place'];
const BANNED_KEYS = ['lat', 'lng', 'lon', 'geo', 'coords', 'video_id', 'channel', 'amount_usd', 'volume_lb', 'lifts', 'gym_key', 'address'];

function* walk(v, path = '$') {
  if (Array.isArray(v)) for (const [i, x] of v.entries()) yield* walk(x, `${path}[${i}]`);
  else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) { yield [path, k]; yield* walk(x, `${path}.${k}`); }
  else yield [path, v];
}

// A YouTube id is 11 chars of [A-Za-z0-9_-] mixing letters and digits.
const looksLikeVideoId = (s) => s.split(/[^A-Za-z0-9_-]+/).some((t) => t.length === 11 && /\d/.test(t) && /[A-Za-z]/.test(t));

test('top-level keys are exactly the allowlist', () => {
  assert.deepEqual(Object.keys(now).sort(), [...TOP].sort());
});

test('no banned keys anywhere', () => {
  for (const [path, k] of walk(now)) if (typeof k === 'string' && path !== undefined && BANNED_KEYS.includes(k)) assert.fail(`banned key ${k} at ${path}`);
});

test('no coordinates, video ids or money in string values', () => {
  for (const [path, v] of walk(now)) {
    if (typeof v !== 'string') continue;
    if (path.endsWith('.url')) continue;
    assert.doesNotMatch(v, /-?\d{1,3}\.\d{3,}\s*,\s*-?\d{1,3}\.\d{3,}/, `coordinate at ${path}`);
    assert.doesNotMatch(v, /\bgeo:/, `geo uri at ${path}`);
    assert.doesNotMatch(v, /\$\s?\d/, `money at ${path}`);
    assert.ok(!looksLikeVideoId(v), `video id at ${path}: ${v}`);
  }
});

test('12-month series line up with months', () => {
  assert.equal(now.months.length, 12);
  for (const k of ['films', 'gym', 'steps']) if (now[k]) assert.equal(now[k].by_month.length, 12, k);
});
