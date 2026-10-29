import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const oldHosts = [
  'https://www.banhalmiphotography.com',
  'https://www.banhalmiphotography.com',
  'https://www.banhalmiphotography.com',
  'https://www.banhalmiphotography.com',
];
const canonical = 'https://www.banhalmiphotography.com';
const skip = new Set(['.git', 'node_modules']);
const textExt = new Set(['.html', '.htm', '.js', '.mjs', '.cjs', '.json', '.jsonld', '.txt', '.md', '.xml', '.yml', '.yaml', '.css', '.webmanifest']);

function walk(dir) {
  const out = [];
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (skip.has(ent.name)) continue;
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) out.push(...walk(full));
    else if (textExt.has(path.extname(ent.name).toLowerCase())) out.push(full);
  }
  return out;
}

let changed = 0;
for (const file of walk(root)) {
  const before = fs.readFileSync(file, 'utf8');
  let after = before;
  for (const host of oldHosts) after = after.split(host).join(canonical);
  after = after.replaceAll('www.banhalmiphotography.com', 'www.banhalmiphotography.com');
  after = after.replaceAll('banhalmiphotography.com', 'banhalmiphotography.com');
  after = after.replaceAll('<span class="brand-word"><strong>BANHALMI</strong> <span>Photography</span></span>', '<span class="brand-word"><strong>BANHALMI</strong> <span>Photography</span></span>');
  after = after.replaceAll('Brand: BANHALMI\n', 'Brand: BANHALMI Photography\n');
  after = after.replace(/("@type"\s*:\s*"Brand"[\s\S]{0,180}?"name"\s*:\s*)"BANHALMI"/g, '$1"BANHALMI Photography"');
  after = after.replaceAll('"name": "BANHALMI",\n      "url": "https://www.banhalmiphotography.com/"', '"name": "BANHALMI Photography",\n      "alternateName": ["BANHALMI", "Norbert Bánhalmi", "Bánhalmi Norbert"],\n      "url": "https://www.banhalmiphotography.com/"');
  if (after !== before) {
    fs.writeFileSync(file, after);
    changed++;
  }
}
console.log(`migrated ${changed} text files`);
