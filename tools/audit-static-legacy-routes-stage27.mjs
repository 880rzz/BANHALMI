import fs from 'node:fs';
import path from 'node:path';

const redirects = {
  'en/work': 'https://www.banhalmi.art/en/work',
  'hu/eletmu': 'https://www.banhalmi.art/hu/eletmu',
  'de-at/werk': 'https://www.banhalmi.art/de/werk',
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

const errors = [];
for (const [route, target] of Object.entries(redirects)) {
  const file = path.join(route, 'index.html');
  if (!fs.existsSync(file)) {
    errors.push(`missing ${file}`);
    continue;
  }
  const html = fs.readFileSync(file, 'utf8');
  for (const required of ['noindex,follow', `href="${target}"`, `content="0;url=${target}"`, 'window.location.replace']) {
    if (!html.includes(required)) errors.push(`${file}: missing ${required}`);
  }
}
for (const file of ['index.html', 'hu/index.html', 'de-at/index.html']) {
  if (fs.readFileSync(file, 'utf8').includes('· ·')) errors.push(`${file}: duplicated footer separator`);
}
if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(`Static redirect and footer audit passed (${Object.keys(redirects).length} routes).`);
