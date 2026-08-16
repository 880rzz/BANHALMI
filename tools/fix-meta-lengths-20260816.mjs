import fs from 'node:fs';

const replacements = [
  {
    file: 'hu/index.html',
    from: 'Executive portré, headshot, brandfotózás és C-level eseményfotózás Bécsben és Budapesten. Stratégiai vizuális pozicionálás vezetőknek, cégvezetőknek, szakembereknek, művészeknek, színészeknek, csapatoknak és szervezeteknek.',
    to: 'Executive portré, headshot, brandfotózás és C-level eseményfotózás Bécsben és Budapesten. Vizuális pozicionálás vezetőknek, szakembereknek, művészeknek, színészeknek és szervezeteknek.'
  },
  {
    file: 'de-at/index.html',
    from: 'Executive-Porträts, Headshots, Brandfotografie und C-Level-Eventfotografie in Wien und Budapest. Strategische visuelle Positionierung für Führungskräfte, Unternehmer, Experten, Künstler, Schauspieler, Teams und Organisationen.',
    to: 'Executive-Porträts, Headshots, Brandfotografie und C-Level-Eventfotografie in Wien und Budapest. Visuelle Positionierung für Führungskräfte, Experten, Künstler, Schauspieler und Organisationen.'
  },
  {
    file: 'portrait/index.html',
    from: 'Executive portrait and headshot photography in Vienna and Budapest for leaders, entrepreneurs, experts, artists, actors and personal brands, built for credible professional use across press, web, LinkedIn and brand communication.',
    to: 'Executive portrait and headshot photography in Vienna and Budapest for leaders, entrepreneurs, experts, artists and actors. For press, web, LinkedIn and brand communication.'
  }
];

for (const {file, from, to} of replacements) {
  let body = fs.readFileSync(file, 'utf8');
  const count = body.split(from).length - 1;
  if (count < 1) throw new Error(`${file}: expected description not found`);
  body = body.split(from).join(to);
  fs.writeFileSync(file, body);
  console.log(`${file}: replaced ${count} description occurrence(s); new length=${to.length}`);
}

const parityPath = 'tools/audit-homepage-meta-parity.mjs';
let parity = fs.readFileSync(parityPath, 'utf8');
for (const {file, from, to} of replacements.filter(x => x.file !== 'portrait/index.html')) {
  if (!parity.includes(from)) throw new Error(`${parityPath}: expected ${file} description not found`);
  parity = parity.split(from).join(to);
}
fs.writeFileSync(parityPath, parity);

for (const {file, to} of replacements) {
  if (to.length > 210 || to.length < 65) throw new Error(`${file}: new description length ${to.length} outside 65–210`);
}
console.log('Meta description remediation complete.');
