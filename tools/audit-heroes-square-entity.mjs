import fs from 'node:fs';

const CANONICAL = 'https://www.wikidata.org/wiki/Q299973';
const FORBIDDEN = ['Q189040', 'Q189130', 'Q146913', 'Q193202'];
const files = [
  'featured-work-peter-magyar.json',
  'data/featured-works.json',
  'assets/data/featured-works.json',
  'portrait/index.html',
  'hu/portre/index.html',
  'de-at/portrait/index.html',
  'case-studies/peter-magyar-portrait-2026/index.html',
  'hu/esettanulmanyok/magyar-peter-portre-2026/index.html',
  'de-at/fallstudien/peter-magyar-portraet-2026/index.html'
];
const failures = [];
for (const file of files) {
  if (!fs.existsSync(file)) { failures.push(`${file}: missing`); continue; }
  const text = fs.readFileSync(file, 'utf8');
  for (const bad of FORBIDDEN) {
    if (text.includes(`wikidata.org/wiki/${bad}`)) failures.push(`${file}: forbidden Heroes Square ID ${bad}`);
  }
  if (!text.includes('Q299973')) failures.push(`${file}: canonical Heroes Square ID Q299973 missing`);
}
const work = JSON.parse(fs.readFileSync('featured-work-peter-magyar.json', 'utf8'));
if (work.contentLocation?.sameAs !== CANONICAL) {
  failures.push(`featured-work-peter-magyar.json contentLocation.sameAs must be ${CANONICAL}`);
}
if (/visual strategic partner|vizuális stratégiai partner|strategischer visueller Partner/i.test(work.description || '')) {
  failures.push('featured-work ImageObject description must not use Organization marketing copy');
}
if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log(`Heroes Square entity audit passed: canonical ${CANONICAL}; forbidden IDs absent; flagship photo description is photographic.`);
