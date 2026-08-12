import fs from 'node:fs';

const path = 'tools/audit-regression.mjs';
let source = fs.readFileSync(path, 'utf8');
const replacements = [
  [
    "assert(read('index.html').includes('For leaders, founders and experts who need one credible visual identity across LinkedIn, company websites, press, speaking and internal communication—from a precise headshot to a complete public portrait system.'), 'English portrait card must include consolidated portrait range');",
    "assert(read('index.html').includes('For leaders, founders and experts who need credible headshots, business portraits and executive portraits across LinkedIn, company websites, press and speaking — with a clear route into personal-brand photography when one profile image is no longer enough.'), 'English portrait card must include the approved headshot → executive → personal-brand range');"
  ],
  [
    "assert(read('hu/index.html').includes('Vezetőknek, alapítóknak és szakértőknek, akiknek a LinkedInen, a vállalati weboldalon, a sajtóban, előadásokon és a belső kommunikációban is hiteles, egységes képi jelenlétre van szükségük — a pontos profilképtől a teljes nyilvános portrérendszerig.'), 'Hungarian portrait card must include consolidated portrait range');",
    "assert(read('hu/index.html').includes('Vezetőknek, alapítóknak és szakértőknek: üzleti headshot, üzleti portré és executive portré a LinkedInhez, vállalati weboldalhoz, sajtóhoz és előadásokhoz — a pontos profilképtől a teljes vezetői portrérendszerig.'), 'Hungarian portrait card must include the approved headshot → executive portrait range');"
  ],
  [
    "assert(read('de-at/index.html').includes('Für Führungskräfte, Gründer:innen und Expert:innen, die auf LinkedIn, der Unternehmenswebsite, in Presse, Vorträgen und interner Kommunikation eine glaubwürdige, konsistente visuelle Identität benötigen — vom präzisen Headshot bis zum vollständigen öffentlichen Porträtsystem.'), 'German portrait card must include consolidated portrait range');",
    "assert(read('de-at/index.html').includes('Für Führungskräfte, Gründer:innen und Expert:innen: Business-Headshots, Business-Porträts und Executive-Porträts für LinkedIn, Unternehmenswebsite, Presse und Vorträge — vom präzisen Profilbild bis zum vollständigen Leadership-Porträtsystem.'), 'German portrait card must include the approved Business-Headshot → Executive-Porträt range');"
  ]
];

for (const [from, to] of replacements) {
  const count = source.split(from).length - 1;
  if (count !== 1) throw new Error(`Expected exactly one old audit assertion; found ${count}`);
  source = source.replace(from, to);
}
fs.writeFileSync(path, source);
console.log('Updated exact homepage portrait-card regression contracts.');
