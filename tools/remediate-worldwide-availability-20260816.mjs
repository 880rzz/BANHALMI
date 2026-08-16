import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const extensions = new Set(['.html', '.json', '.jsonld', '.txt']);
let changed = 0;

function normalize(text) {
  return text
    .replace(/in Vienna, Budapest and across Europe/g, 'in Vienna and Budapest, with agreed projects available worldwide')
    .replace(/Vienna, Budapest and across Europe/g, 'Vienna and Budapest, with agreed projects available worldwide')
    .replace(/across Europe/g, 'worldwide by arrangement');
}

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['.git', 'node_modules', '_site', 'artifacts'].includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.isFile() && extensions.has(path.extname(entry.name))) {
      const before = fs.readFileSync(full, 'utf8');
      const after = normalize(before);
      if (after !== before) {
        fs.writeFileSync(full, after);
        changed++;
      }
    }
  }
}

walk(root);
console.log(`Normalized worldwide availability wording in ${changed} file(s).`);
