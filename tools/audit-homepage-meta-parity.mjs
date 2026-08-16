import fs from 'node:fs';

const expected = {
  'index.html': ['BANHALMI | Executive Portrait & Brand Photography | Vienna–Budapest','Executive portraits, headshots, brand photography and C-level event coverage in Vienna and Budapest. Strategic visual positioning for leaders, experts, artists, actors, teams and organisations.'],
  'hu/index.html': ['BANHALMI | Executive portré és brandfotózás | Bécs–Budapest','Executive portré, headshot, brandfotózás és C-level eseményfotózás Bécsben és Budapesten. Vizuális pozicionálás vezetőknek, szakembereknek, művészeknek, színészeknek és szervezeteknek.'],
  'de-at/index.html': ['BANHALMI | Executive-Porträt & Brandfotografie | Wien–Budapest','Executive-Porträts, Headshots, Brandfotografie und C-Level-Eventfotografie in Wien und Budapest. Visuelle Positionierung für Führungskräfte, Experten, Künstler, Schauspieler und Organisationen.']
};
const failures=[];
for (const [file,[title,desc]] of Object.entries(expected)) {
  const html=fs.readFileSync(file,'utf8');
  for (const token of [
    `<title>${title}</title>`,
    `content="${desc}" name="description"`,
    `content="${title}" property="og:title"`,
    `content="${desc}" property="og:description"`,
    `name="twitter:title" content="${title}"`,
    `name="twitter:description" content="${desc}"`
  ]) if(!html.includes(token)) failures.push(`${file}: missing ${token.slice(0,80)}`);
  if (/name="description"[^>]*content="[^"]*…|content="[^"]*…"[^>]*name="description"/i.test(html)) failures.push(`${file}: ellipsis-truncated meta description survived`);
  if (!html.includes('"dateModified":"2026-08-14T16:35:00+02:00"')) failures.push(`${file}: schema freshness not updated`);
  const page = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)].map(m=>{try{return JSON.parse(m[1])}catch{return null}}).find(x=>x?.['@type']==='WebPage');
  if (!page) failures.push(`${file}: WebPage schema missing`);
  else {
    if (page.name!==title || page.headline!==title) failures.push(`${file}: WebPage title parity drift`);
    if (page.description!==desc) failures.push(`${file}: WebPage description parity drift`);
    if (page.dateModified!=='2026-08-14T16:35:00+02:00') failures.push(`${file}: WebPage dateModified drift`);
  }
}
if(failures.length){console.error(failures.join('\n'));process.exit(1)}
console.log('BANHALMI homepage meta parity passed for EN/HU/DE with complete two-city titles, broadened audience descriptions and schema freshness.');
