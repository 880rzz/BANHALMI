import fs from 'node:fs';
import path from 'node:path';

const redirects = {
  'en/work': 'https://www.banhalmi.art/en/work',
  'about/norbert-banhalmi': 'https://www.banhalmi.art/about/norbert-banhalmi',
  'hu/rolam/banhalmi-norbert': 'https://www.banhalmi.art/hu/rolam/banhalmi-norbert',
  'de/ueber-mich/norbert-banhalmi': 'https://www.banhalmi.art/de/ueber-mich/norbert-banhalmi',
  press: 'https://www.banhalmi.art/press',
  'old-print': 'https://www.banhalmi.art/old-print',
  'hu/sajto/megjelenesek': 'https://www.banhalmi.art/hu/sajto/megjelenesek',
  'hu/sajto/nyomtatott': 'https://www.banhalmi.art/hu/sajto/nyomtatott',
  'de/presse/presseauftritte': 'https://www.banhalmi.art/de/presse/presseauftritte',
  'de/presse/print': 'https://www.banhalmi.art/de/presse/print'
};

const canonicalOeuvrePages = [
  'hu/eletmu/index.html',
  'de-at/werk/index.html'
];

const errors = [];
for (const [route, target] of Object.entries(redirects)) {
  const file = path.join(route, 'index.html');
  if (!fs.existsSync(file)) {
    errors.push(`missing ${file}`);
    continue;
  }
  const html = fs.readFileSync(file, 'utf8');
  if (/noindex/i.test(html)) errors.push(`${file}: redirect alias must not carry noindex; redirect and canonical are the consolidation signals`);
  for (const required of [
    `href="${target}"`,
    `content="0;url=${target}"`,
    'window.location.replace',
    '/assets/css/accessibility-stage14.css'
  ]) {
    if (!html.includes(required)) errors.push(`${file}: missing ${required}`);
  }
}
for (const file of canonicalOeuvrePages) {
  const html = fs.readFileSync(file, 'utf8');
  if (/noindex,follow|http-equiv="refresh"|window\.location\.replace/i.test(html)) {
    errors.push(`${file}: canonical oeuvre page must remain a full page, not a redirect`);
  }
}
for (const file of ['index.html', 'hu/index.html', 'de-at/index.html']) {
  if (fs.readFileSync(file, 'utf8').includes('· ·')) errors.push(`${file}: duplicated footer separator`);
}
if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(`Static redirect, accessibility, canonical oeuvre and footer audit passed (${Object.keys(redirects).length} aliases).`);
