import fs from 'node:fs';

const edits = {
  'trust/index.html': [
    ['/privacy-policy/#processors','/privacy-policy/'],
    ['Executive portraiture, visual branding and C-level event photography from Vienna and Budapest.','Executive portraiture, visual branding and C-level event photography from Vienna and Budapest, with a substantial New York reference archive.']
  ],
  'hu/bizalom/index.html': [
    ['Vezetői portré, vizuális márkaépítés és Felsővezetői rendezvényfotózás Bécsből és Budapestről.','Vezetői portré, vizuális márkaépítés és felsővezetői rendezvényfotózás bécsi és budapesti bázissal, jelentős New York-i referenciaanyaggal.']
  ],
  'de-at/vertrauen/index.html': [
    ['Executive-Porträts, visuelles Branding und C-Level-Eventfotografie aus Wien und Budapest.','Executive-Porträts, visuelles Branding und C-Level-Eventfotografie mit Standorten in Wien und Budapest und einem umfangreichen New-York-Referenzarchiv.'],
    ['Executive-Porträts, visuelle Markenpositionierung und C-Level-Eventfotografie aus Wien und Budapest.','Executive-Porträts, visuelle Markenpositionierung und C-Level-Eventfotografie mit Standorten in Wien und Budapest und einem umfangreichen New-York-Referenzarchiv.']
  ]
};

for (const [file, replacements] of Object.entries(edits)) {
  let html = fs.readFileSync(file, 'utf8');
  for (const [from, to] of replacements) {
    if (html.includes(from)) html = html.replaceAll(from, to);
  }
  fs.writeFileSync(file, html);
}

const en = fs.readFileSync('trust/index.html','utf8');
if (en.includes('/privacy-policy/#processors')) throw new Error('Broken processors fragment still present');
if (!en.includes('substantial New York reference archive')) throw new Error('EN Trust geography update missing');
const hu = fs.readFileSync('hu/bizalom/index.html','utf8');
if (!hu.includes('jelentős New York-i referenciaanyaggal')) throw new Error('HU Trust geography update missing');
const de = fs.readFileSync('de-at/vertrauen/index.html','utf8');
if (!de.includes('umfangreichen New-York-Referenzarchiv')) throw new Error('DE Trust geography update missing');
console.log('Stage 33 Trust Center anchor and geography cleanup applied.');
