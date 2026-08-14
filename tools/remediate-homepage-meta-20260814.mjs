import fs from 'node:fs';

const config = {
  'index.html': {
    title: 'BANHALMI | Executive Portrait & Brand Photography | Vienna–Budapest',
    description: 'Executive portraits, headshots, brand photography and C-level event coverage in Vienna and Budapest. Strategic visual positioning for leaders and organisations.'
  },
  'hu/index.html': {
    title: 'BANHALMI | Executive portré és brandfotózás | Bécs–Budapest',
    description: 'Executive portré, headshot, brandfotózás és C-level eseményfotózás Bécsben és Budapesten. Stratégiai vizuális pozicionálás vezetőknek és szervezeteknek.'
  },
  'de-at/index.html': {
    title: 'BANHALMI | Executive-Porträt & Brandfotografie | Wien–Budapest',
    description: 'Executive-Porträts, Headshots, Brandfotografie und C-Level-Eventfotografie in Wien und Budapest. Strategische visuelle Positionierung für Führungskräfte und Organisationen.'
  }
};

for (const [file, meta] of Object.entries(config)) {
  let html = fs.readFileSync(file,'utf8');
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${meta.title}</title>`);
  html = html.replace(/<meta content="[^"]*" name="description"\/>/i, `<meta content="${meta.description}" name="description"/>`);
  html = html.replace(/<meta content="[^"]*" property="og:title"\/>/i, `<meta content="${meta.title}" property="og:title"/>`);
  html = html.replace(/<meta content="[^"]*" property="og:description"\/>/i, `<meta content="${meta.description}" property="og:description"/>`);
  html = html.replace(/<meta name="twitter:title" content="[^"]*">/i, `<meta name="twitter:title" content="${meta.title}">`);
  html = html.replace(/<meta name="twitter:description" content="[^"]*">/i, `<meta name="twitter:description" content="${meta.description}">`);
  html = html.replace(/"dateModified":"2026-07-15T23:30:00\+02:00"/g, '"dateModified":"2026-08-14T16:35:00+02:00"');
  const pageScript = /<script type="application\/ld\+json">(\{\"@context\":\"https:\/\/schema\.org\",\"@type\":\"WebPage\"[\s\S]*?)<\/script>/i;
  const m = html.match(pageScript);
  if (m) {
    const data = JSON.parse(m[1]);
    data.name = meta.title;
    data.headline = meta.title;
    data.description = meta.description;
    data.dateModified = '2026-08-14T16:35:00+02:00';
    html = html.replace(pageScript, `<script type="application/ld+json">${JSON.stringify(data)}</script>`);
  }
  fs.writeFileSync(file, html);
}
console.log('BANHALMI homepage title/description/freshness remediation complete for EN/HU/DE.');
