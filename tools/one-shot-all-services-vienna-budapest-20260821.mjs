import fs from 'node:fs';

const targets = [
  ['portrait/index.html', 'Executive Portrait & Headshot Photographer | Vienna–Budapest | BANHALMI'],
  ['hu/portre/index.html', 'Executive portré és Headshot fotózás | Bécs–Budapest | BANHALMI'],
  ['de-at/portrait/index.html', 'Executive-Porträt & Headshot-Fotografie | Wien–Budapest | BANHALMI'],
  ['lifestyle/index.html', 'Brand Photography & Visual Positioning | Vienna–Budapest | BANHALMI'],
  ['hu/brand/index.html', 'Brandfotózás és vizuális pozicionálás | Bécs–Budapest | BANHALMI'],
  ['de-at/brand/index.html', 'Brandfotografie & visuelle Positionierung | Wien–Budapest | BANHALMI'],
  ['event-photography/index.html', 'C-Level Event Photography | Vienna–Budapest | BANHALMI'],
  ['hu/rendezvenyfotozas/index.html', 'C-Level rendezvényfotózás | Bécs–Budapest | BANHALMI'],
  ['de-at/event-photography/index.html', 'C-Level Eventfotografie | Wien–Budapest | BANHALMI'],
  ['glamour/index.html', 'Fine Art & Nude Art Photography | Vienna–Budapest | BANHALMI'],
  ['hu/muveszi-fotografia/index.html', 'Művészi portré és aktfotózás | Bécs–Budapest | BANHALMI'],
  ['de-at/fine-art/index.html', 'Fine-Art- & Aktfotografie | Wien–Budapest | BANHALMI']
];

const esc = (s) => s.replace(/&/g, '&amp;');

for (const [path, title] of targets) {
  let html = fs.readFileSync(path, 'utf8');
  const encoded = esc(title);
  const titleRe = /<title>[^<]*<\/title>/;
  const ogRe = /<meta\b(?=[^>]*property="og:title")[^>]*\/?\s*>/;
  const twRe = /<meta\b(?=[^>]*name="twitter:title")[^>]*\/?\s*>/;

  const titleMatches = html.match(new RegExp(titleRe.source, 'g')) || [];
  if (titleMatches.length !== 1) throw new Error(`${path}: expected exactly one title, found ${titleMatches.length}`);
  html = html.replace(titleRe, `<title>${encoded}</title>`);

  const ogMatches = html.match(new RegExp(ogRe.source, 'g')) || [];
  if (ogMatches.length > 1) throw new Error(`${path}: multiple og:title tags`);
  if (ogMatches.length === 1) html = html.replace(ogRe, `<meta content="${encoded}" property="og:title"/>`);
  else html = html.replace(`</title>`, `</title><meta content="${encoded}" property="og:title"/>`);

  const twMatches = html.match(new RegExp(twRe.source, 'g')) || [];
  if (twMatches.length > 1) throw new Error(`${path}: multiple twitter:title tags`);
  if (twMatches.length === 1) html = html.replace(twRe, `<meta name="twitter:title" content="${encoded}">`);
  else html = html.replace(`</title>`, `</title><meta name="twitter:title" content="${encoded}">`);

  fs.writeFileSync(path, html);
  const check = fs.readFileSync(path, 'utf8');
  for (const fragment of [`<title>${encoded}</title>`, `content="${encoded}" property="og:title"`, `name="twitter:title" content="${encoded}"`]) {
    if (!check.includes(fragment)) throw new Error(`${path}: verification failed for ${fragment}`);
  }
}

console.log('All EN/HU/DE service titles aligned to Vienna–Budapest.');
