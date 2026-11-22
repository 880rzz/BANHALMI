#!/usr/bin/env node
// Preserve picture pixels while attaching rights-only XMP to published
// first-party BANHALMI service HERO WebPs. No GPS, customer or EXIF copying.
// Run on the staged Pages artifact, not on Git-controlled originals.
import fs from 'node:fs';
import path from 'node:path';

const rootArg = process.argv.indexOf('--root');
if (rootArg < 0 || !process.argv[rootArg + 1]) {
  throw new Error('Specify --root <staged Pages artifact directory>');
}
const root = path.resolve(process.argv[rootArg + 1]);
const verifyOnly = process.argv.includes('--verify-only');
const locales = [
  'portrait/index.html', 'lifestyle/index.html',
  'event-photography/index.html', 'fine-art/index.html',
  'hu/portre/index.html', 'hu/brand/index.html',
  'hu/rendezvenyfotozas/index.html', 'hu/muveszi-fotografia/index.html',
  'de-at/portrait/index.html', 'de-at/brand/index.html',
  'de-at/eventfotografie/index.html', 'de-at/fine-art/index.html'
];
const RIGHTS = 'https://www.banhalmiphotography.com/terms-conditions/';
const CREDIT = 'Bánhalmi Norbert / Norbert Banhalmi / BANHALMI Photography';
const NOTICE = '© Bánhalmi Norbert / Norbert Banhalmi / BANHALMI Photography. All rights reserved.';
const xml = text => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const XMP = Buffer.from(
  '<?xpacket begin="\uFEFF" id="W5M0MpCehiHzreSzNTczkc9d"?>' +
  '<x:xmpmeta xmlns:x="adobe:ns:meta/"><rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">' +
  '<rdf:Description rdf:about="" xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
  'xmlns:xmpRights="http://ns.adobe.com/xap/1.0/rights/" xmlns:photoshop="http://ns.adobe.com/photoshop/1.0/">' +
  '<dc:creator><rdf:Seq><rdf:li>Bánhalmi Norbert</rdf:li></rdf:Seq></dc:creator>' +
  '<dc:rights><rdf:Alt><rdf:li xml:lang="x-default">' + xml(NOTICE) + '</rdf:li></rdf:Alt></dc:rights>' +
  '<photoshop:Credit>' + xml(CREDIT) + '</photoshop:Credit>' +
  '<xmpRights:WebStatement>' + RIGHTS + '</xmpRights:WebStatement>' +
  '<xmpRights:UsageTerms><rdf:Alt><rdf:li xml:lang="x-default">Licensed use only. See ' +
  RIGHTS + '</rdf:li></rdf:Alt></xmpRights:UsageTerms>' +
  '</rdf:Description></rdf:RDF></x:xmpmeta><?xpacket end="w"?>',
  'utf8'
);

function riffChunks(buffer) {
  if (buffer.length < 20 || buffer.toString('ascii', 0, 4) !== 'RIFF' ||
      buffer.toString('ascii', 8, 12) !== 'WEBP' ||
      buffer.readUInt32LE(4) !== buffer.length - 8) {
    throw new Error('Invalid WebP RIFF container');
  }
  let at = 12;
  const chunks = [];
  while (at + 8 <= buffer.length) {
    const type = buffer.toString('ascii', at, at + 4);
    const size = buffer.readUInt32LE(at + 4);
    const end = at + 8 + size + (size & 1);
    if (end > buffer.length) throw new Error('Invalid chunk bounds: ' + type);
    chunks.push({ type, at, offset: at + 8, size, end });
    at = end;
  }
  if (at !== buffer.length) throw new Error('Trailing garbage in WebP');
  return chunks;
}
function widthHeight(buffer, chunks) {
  const extended = chunks.find(c => c.type === 'VP8X');
  if (extended) {
    if (extended.size !== 10) throw new Error('Invalid VP8X chunk size');
    return [
      1 + buffer.readUIntLE(extended.offset + 4, 3),
      1 + buffer.readUIntLE(extended.offset + 7, 3)
    ];
  }
  const lossy = chunks.find(c => c.type === 'VP8 ');
  if (lossy && lossy.size >= 10) {
    if (buffer[lossy.offset + 3] !== 0x9d ||
        buffer[lossy.offset + 4] !== 0x01 ||
        buffer[lossy.offset + 5] !== 0x2a) throw new Error('Invalid VP8 key frame');
    return [
      buffer.readUInt16LE(lossy.offset + 6) & 0x3fff,
      buffer.readUInt16LE(lossy.offset + 8) & 0x3fff
    ];
  }
  const lossless = chunks.find(c => c.type === 'VP8L');
  if (lossless && lossless.size >= 5 && buffer[lossless.offset] === 0x2f) {
    const i = lossless.offset;
    return [
      1 + (buffer[i + 1] | ((buffer[i + 2] & 0x3f) << 8)),
      1 + ((buffer[i + 2] >> 6) | (buffer[i + 3] << 2) | ((buffer[i + 4] & 0xf) << 10))
    ];
  }
  throw new Error('Cannot safely determine WebP canvas size');
}
function stampWebP(buffer) {
  const chunks = riffChunks(buffer);
  const existingXmp = chunks.find(c => c.type === 'XMP ');
  if (existingXmp) {
    const text = buffer.toString('utf8', existingXmp.offset, existingXmp.offset + existingXmp.size);
    if (!text.includes('<xmpRights:WebStatement>' + RIGHTS + '</xmpRights:WebStatement>') ||
        !text.includes('Bánhalmi Norbert') || !text.includes('photoshop:Credit')) {
      // Do not override unknown licensor or copyright metadata.
      throw new Error('Existing XMP requires independent rights review');
    }
    return { bytes: buffer, changed: false };
  }
  const [w, h] = widthHeight(buffer, chunks);
  if (w < 1 || h < 1) throw new Error('Invalid canvas dimensions');
  const xmpHeader = Buffer.alloc(8);
  xmpHeader.write('XMP ', 0, 'ascii');
  xmpHeader.writeUInt32LE(XMP.length, 4);
  const xmpChunk = Buffer.concat([xmpHeader, XMP, XMP.length & 1 ? Buffer.alloc(1) : Buffer.alloc(0)]);
  const extended = chunks.find(c => c.type === 'VP8X');
  let revised;
  if (extended) {
    revised = Buffer.from(buffer);
    revised[extended.offset] |= 0x04; // XMP flag in VP8X header
    revised = Buffer.concat([revised, xmpChunk]);
  } else {
    const vp8x = Buffer.alloc(18);
    vp8x.write('VP8X', 0, 'ascii');
    vp8x.writeUInt32LE(10, 4);
    vp8x[8] = 0x04;
    vp8x.writeUIntLE(w - 1, 12, 3);
    vp8x.writeUIntLE(h - 1, 15, 3);
    revised = Buffer.concat([buffer.subarray(0, 12), vp8x, buffer.subarray(12), xmpChunk]);
  }
  revised.writeUInt32LE(revised.length - 8, 4);
  const checked = riffChunks(revised);
  if (!checked.some(c => c.type === 'XMP ') || !checked.some(c => c.type === 'VP8X') ||
      !(revised[checked.find(c => c.type === 'VP8X').offset] & 0x04)) {
    throw new Error('WebP XMP validation failed');
  }
  return { bytes: revised, changed: true };
}
const heroUrls = new Set();
for (const rel of locales) {
  const page = path.join(root, rel);
  if (!fs.existsSync(page)) throw new Error('Service route missing: ' + rel);
  const html = fs.readFileSync(page, 'utf8');
  const props = [...html.matchAll(/\b(?:src|srcset)="([^"]+)"/gi)];
  for (const m of props) {
    for (const part of m[1].split(',')) {
      const url = part.trim().split(/\s+/)[0];
      if (/^\/assets\/img\/(portraits|brand|events|fine-art)\/hero\/[A-Za-z0-9._-]+\.webp$/.test(url)) {
        heroUrls.add(url);
      }
    }
  }
}
if (heroUrls.size < 12) throw new Error('Too few first-party responsive HERO URLs: ' + heroUrls.size);
let added = 0;
for (const url of [...heroUrls].sort()) {
  const file = path.join(root, url.slice(1));
  if (!fs.existsSync(file)) throw new Error('Published hero asset missing: ' + url);
  const original = fs.readFileSync(file);
  const { bytes, changed } = stampWebP(original);
  if (verifyOnly && changed) throw new Error('Hero XMP missing: ' + url);
  if (!verifyOnly && changed) {
    fs.writeFileSync(file, bytes);
    added++;
  }
}
console.log('BANHALMI hero WebP XMP verified:', heroUrls.size, 'files;', added, 'new rights packets;', verifyOnly ? 'verification-only' : 'staged artifact');
