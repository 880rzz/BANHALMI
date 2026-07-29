import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const AT_WWW = 'https://www.banhalmi.at/';
const AT_APEX = 'https://banhalmi.at/';
const HU_WWW = 'https://www.banhalminorbert.hu/';
const HU_APEX = 'https://banhalminorbert.hu/';
const ALIASES = [AT_WWW, AT_APEX, HU_WWW, HU_APEX];

function addAliasPairs(value) {
  if (Array.isArray(value)) {
    for (const item of value) addAliasPairs(item);
    return;
  }
  if (!value || typeof value !== 'object') return;
  for (const [key, item] of Object.entries(value)) {
    if (key === 'sameAs' && Array.isArray(item)) {
      const additions = [];
      if (item.includes(AT_WWW) && !item.includes(AT_APEX)) additions.push(AT_APEX);
      if (item.includes(HU_WWW) && !item.includes(HU_APEX)) additions.push(HU_APEX);
      if (additions.length) value[key] = [...item, ...additions];
    }
    addAliasPairs(value[key]);
  }
}

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.name === '.git' || entry.name === 'node_modules') return [];
    return entry.isDirectory() ? walk(full) : [full];
  });
}

function updateJsonFile(file) {
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  addAliasPairs(data);
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
}

function updateHtmlFile(file) {
  const original = fs.readFileSync(file, 'utf8');
  let jsonLdCount = 0;
  const updated = original.replace(/<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi, (whole, payload) => {
    const data = JSON.parse(payload);
    addAliasPairs(data);
    jsonLdCount += 1;
    return `<script type="application/ld+json">${JSON.stringify(data)}</script>`;
  });
  if (jsonLdCount && updated !== original) fs.writeFileSync(file, updated);
}

for (const name of ['entity.jsonld', 'entity-graph.json']) {
  updateJsonFile(path.join(ROOT, name));
}

const htmlFiles = walk(ROOT).filter((file) => file.endsWith('.html'));
for (const file of htmlFiles) updateHtmlFile(file);

function assertLanding(file, language, canonical) {
  const html = fs.readFileSync(path.join(ROOT, file), 'utf8');
  if (!html.includes(`<html lang="${language}"`)) throw new Error(`${file}: wrong or missing lang`);
  if (!html.includes(`href="${canonical}" rel="canonical"`)) throw new Error(`${file}: wrong canonical`);
  for (const [hreflang, url] of [
    ['en', 'https://www.norbertbanhalmi.com/'],
    ['de-AT', 'https://www.norbertbanhalmi.com/de-at/'],
    ['hu-HU', 'https://www.norbertbanhalmi.com/hu/'],
    ['x-default', 'https://www.norbertbanhalmi.com/']
  ]) {
    if (!html.includes(`href="${url}" hreflang="${hreflang}" rel="alternate"`)) {
      throw new Error(`${file}: missing hreflang ${hreflang}`);
    }
  }
  for (const alias of ALIASES) {
    if (!html.includes(alias)) throw new Error(`${file}: embedded schema missing ${alias}`);
  }
  for (const forbidden of ALIASES) {
    if (html.includes(`href="${forbidden}" rel="canonical"`)) throw new Error(`${file}: alias used as canonical`);
    if (html.includes(`href="${forbidden}" hreflang=`)) throw new Error(`${file}: alias used as hreflang target`);
  }
}

assertLanding('de-at/index.html', 'de-AT', 'https://www.norbertbanhalmi.com/de-at/');
assertLanding('hu/index.html', 'hu-HU', 'https://www.norbertbanhalmi.com/hu/');

for (const name of ['entity.jsonld', 'entity-graph.json']) {
  const text = fs.readFileSync(path.join(ROOT, name), 'utf8');
  JSON.parse(text);
  for (const alias of ALIASES) {
    if (!text.includes(alias)) throw new Error(`${name}: missing ${alias}`);
  }
}

console.log(`Embedded alias migration verified across ${htmlFiles.length} HTML files.`);
