import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

const script = path.resolve('tools/ensure-hero-webp-rights.mjs');
const fixture = fs.readFileSync('assets/img/portraits/hero/portrait-hero-640.webp');
const root = fs.mkdtempSync(path.join(os.tmpdir(), 'banhalmi-webp-rights-'));
const pages = [
  'portrait/index.html', 'lifestyle/index.html',
  'event-photography/index.html', 'fine-art/index.html',
  'hu/portre/index.html', 'hu/brand/index.html',
  'hu/rendezvenyfotozas/index.html', 'hu/muveszi-fotografia/index.html',
  'de-at/portrait/index.html', 'de-at/brand/index.html',
  'de-at/eventfotografie/index.html', 'de-at/fine-art/index.html'
];
const files = [];
const kinds = ['portraits', 'brand', 'events', 'fine-art'];
const sizes = [640, 960, 1440];
function chunks(buf) {
  assert.equal(buf.toString('ascii', 0, 4), 'RIFF');
  assert.equal(buf.toString('ascii', 8, 12), 'WEBP');
  assert.equal(buf.readUInt32LE(4), buf.length - 8);
  const result = [];
  for (let p = 12; p + 8 <= buf.length;) {
    const type = buf.toString('ascii', p, p + 4), size = buf.readUInt32LE(p + 4);
    result.push({ type, data: buf.subarray(p + 8, p + 8 + size) });
    p += 8 + size + (size & 1);
  }
  return result;
}
try {
  for (const kind of kinds) for (const size of sizes) {
    const rel = 'assets/img/' + kind + '/hero/' + kind + '-hero-' + size + '.webp';
    const target = path.join(root, rel);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, fixture);
    files.push(rel);
  }
  const html = '<html><img srcset="' + files.map(x => '/' + x + ' 640w').join(', ') + '"></html>';
  for (const page of pages) {
    const target = path.join(root, page);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, html);
  }
  const run = args => execFileSync(process.execPath, [script, '--root', root, ...args], { encoding: 'utf8', stdio: 'pipe' });
  assert.ok(run([]).includes('12 files'));
  const originalVp8 = chunks(fixture).find(c => c.type === 'VP8 ')?.data;
  assert.ok(originalVp8?.length, 'Real source HERO fixture should be VP8');
  for (const rel of files) {
    const out = fs.readFileSync(path.join(root, rel));
    const parts = chunks(out);
    assert.equal(parts[0].type, 'VP8X', rel + ': extended header required');
    assert.ok(parts[0].data[0] & 0x04, rel + ': XMP flag required');
    assert.equal(Buffer.compare(parts.find(c => c.type === 'VP8 ').data, originalVp8), 0,
      rel + ': pixel-bearing VP8 bytes must remain unchanged');
    const xml = parts.find(c => c.type === 'XMP ')?.data.toString('utf8');
    assert.ok(xml?.includes('<xmpRights:WebStatement>https://www.banhalmiphotography.com/terms-conditions/</xmpRights:WebStatement>'));
    assert.ok(xml.includes('<photoshop:Credit>Bánhalmi Norbert'));
  }
  assert.ok(run(['--verify-only']).includes('verification-only'));
  assert.ok(run([]).includes('0 new rights packets'), 'XMP tagging must be idempotent');

  const tampered = path.join(root, files[0]);
  const bytes = fs.readFileSync(tampered);
  const index = bytes.indexOf('https://www.banhalmiphotography.com/terms-conditions/');
  assert.ok(index > 0);
  bytes[index] = 0x58;
  fs.writeFileSync(tampered, bytes);
  assert.throws(() => run(['--verify-only']), /Command failed/,
    'Unknown or changed XMP license must fail instead of being silently overwritten');
} finally {
  fs.rmSync(root, { recursive: true, force: true });
}
console.log('12 real-WebP derivative fixtures: XMP rights, pixel-byte preservation, idempotence and fail-closed metadata passed.');
