import fs from 'node:fs';

const checks = [
  { file: 'index.html', href: '/glamour/', label: 'Explore fine-art photography' },
  { file: 'hu/index.html', href: '/hu/muveszi-fotografia/', label: 'Művészi fotográfia' },
  { file: 'de-at/index.html', href: '/de-at/fine-art/', label: 'Fine-Art-Fotografie' },
];

const errors = [];
for (const check of checks) {
  const html = fs.readFileSync(check.file, 'utf8');
  const section = (html.match(/<section[^>]+data-first-principles-path="stage68"[\s\S]*?<\/section>/) || [''])[0];
  if (!section.includes('class="fp-art-path"')) errors.push(`${check.file}: fine-art secondary path missing`);
  if (!section.includes(`href="${check.href}"`)) errors.push(`${check.file}: canonical fine-art route missing`);
  if (!section.includes(check.label)) errors.push(`${check.file}: localized fine-art label missing`);
  if ((section.match(/class="fp-choice/g) || []).length !== 6) errors.push(`${check.file}: primary decision grid must remain exactly six choices`);
}

const css = fs.readFileSync('assets/css/style.css', 'utf8');
for (const token of ['STAGE69-FINE-ART-PATH:START', '.fp-art-path']) {
  if (!css.includes(token)) errors.push(`style.css: missing ${token}`);
}

if (errors.length) {
  console.error('Stage69 fine-art path audit failed:');
  errors.forEach((e) => console.error(' - ' + e));
  process.exit(1);
}
console.log('Stage69 passed: fine-art photography remains an elegant secondary path in EN/HU/DE without expanding the six-choice primary decision grid.');
