import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const errors = [];
const oldIds = [
  'https://www.banhalmi.art/#studio-vienna',
  'https://www.banhalmi.art/#studio-budapest'
];
const textExtensions = new Set(['.html', '.json', '.jsonld', '.txt', '.md', '.js', '.mjs', '.xml']);

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['.git', 'node_modules'].includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full);
      continue;
    }
    if (!textExtensions.has(path.extname(entry.name).toLowerCase())) continue;
    const text = fs.readFileSync(full, 'utf8');
    for (const id of oldIds) if (text.includes(id)) errors.push(`${path.relative(root, full)}: legacy duplicate Place ID remains: ${id}`);
  }
}
walk(root);

const homepageContracts = {
  'index.html': ['https://www.norbertbanhalmi.com/', 'https://www.banhalmi.art/', 'https://blog.banhalmi.art/'],
  'hu/index.html': ['https://www.norbertbanhalmi.com/hu/', 'https://www.banhalmi.art/hu/', 'https://blog.banhalmi.art/'],
  'de-at/index.html': ['https://www.norbertbanhalmi.com/de-at/', 'https://www.banhalmi.art/de-at/', 'https://blog.banhalmi.art/']
};
for (const [relative, urls] of Object.entries(homepageContracts)) {
  const html = fs.readFileSync(path.join(root, relative), 'utf8');
  if (!html.includes('data-banhalmi-ecosystem')) errors.push(`${relative}: visible official ecosystem navigation missing`);
  if (!html.includes('/assets/css/ecosystem-links.css')) errors.push(`${relative}: ecosystem stylesheet missing`);
  for (const url of urls) if (!html.includes(`href="${url}"`)) errors.push(`${relative}: ecosystem link missing ${url}`);
}

for (const relative of ['entity.jsonld', 'entity-graph.json', 'knowledge.json', 'ecosystem.json', 'llms.txt', 'ai.txt']) {
  const text = fs.readFileSync(path.join(root, relative), 'utf8');
  for (const url of ['https://www.norbertbanhalmi.com/about/', 'https://www.norbertbanhalmi.com/', 'https://www.banhalmi.art/', 'https://blog.banhalmi.art/']) {
    if (!text.includes(url)) errors.push(`${relative}: official entity ecosystem URL missing ${url}`);
  }
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log('Stage-one professional entity ecosystem audit passed: canonical studio Place IDs and visible three-site navigation are aligned.');
