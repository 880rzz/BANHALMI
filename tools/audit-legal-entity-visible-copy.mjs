import fs from 'node:fs';

const files = {
  en: fs.readFileSync('impressum/index.html', 'utf8'),
  de: fs.readFileSync('de-at/impressum/index.html', 'utf8'),
  hu: fs.readFileSync('hu/impresszum/index.html', 'utf8')
};

const canonicalLegalName = 'Banhalmi Norbert e.U.';
const forbidden = [
  'Norbert Banhalmi – Executive Porträt und visuelle Positionierung e.U.',
  'Bánhalmi Norbert e.U.',
  'Norbert Banhalmi e.U.'
];

const errors = [];
for (const [lang, html] of Object.entries(files)) {
  if (!html.includes(canonicalLegalName)) {
    errors.push(`${lang}: canonical legal name missing: ${canonicalLegalName}`);
  }
  for (const value of forbidden) {
    if (html.includes(value)) errors.push(`${lang}: forbidden legal-name drift present: ${value}`);
  }
}

if (!/<h2>Szolgáltatói[\s\S]{0,300}<p><strong>Banhalmi Norbert e\.U\.<\/strong><\/p>/i.test(files.hu)) {
  errors.push('hu: visible provider block must identify Banhalmi Norbert e.U. directly below Szolgáltatói adatok');
}
if (!/Cégnév:<\/strong>\s*Banhalmi Norbert e\.U\./i.test(files.hu)) {
  errors.push('hu: detailed company-data block must use Banhalmi Norbert e.U.');
}

if (errors.length) {
  console.error('LEGAL ENTITY VISIBLE COPY AUDIT FAILED');
  for (const error of errors) console.error('-', error);
  process.exit(1);
}

console.log('Legal entity visible-copy audit passed for EN/DE/HU.');
