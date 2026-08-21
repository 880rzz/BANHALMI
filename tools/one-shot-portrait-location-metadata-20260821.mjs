import fs from 'node:fs';

const changes = [
  {
    path: 'portrait/index.html',
    from: 'Executive Portrait &amp; Headshot Photography for Leaders | BANHALMI',
    to: 'Executive Portrait &amp; Headshot Photographer | Vienna–Budapest | BANHALMI'
  },
  {
    path: 'hu/portre/index.html',
    from: 'Executive portré és Headshot fotózás B2B vezetőkről | BANHALMI',
    to: 'Executive portré és Headshot fotózás | Bécs–Budapest | BANHALMI'
  },
  {
    path: 'de-at/portrait/index.html',
    from: 'Executive-Porträt &amp; Headshot für Führungskräfte | BANHALMI',
    to: 'Executive-Porträt &amp; Headshot-Fotografie | Wien–Budapest | BANHALMI'
  }
];

for (const item of changes) {
  let html = fs.readFileSync(item.path, 'utf8');
  const replacements = [
    [`<title>${item.from}</title>`, `<title>${item.to}</title>`],
    [`<meta content="${item.from}" property="og:title"/>`, `<meta content="${item.to}" property="og:title"/>`],
    [`<meta name="twitter:title" content="${item.from}">`, `<meta name="twitter:title" content="${item.to}">`]
  ];

  for (const [from, to] of replacements) {
    const count = html.split(from).length - 1;
    if (count !== 1) throw new Error(`${item.path}: expected exactly one match for ${from}, found ${count}`);
    html = html.replace(from, to);
  }

  fs.writeFileSync(item.path, html);

  const updated = fs.readFileSync(item.path, 'utf8');
  for (const [, to] of replacements) {
    const count = updated.split(to).length - 1;
    if (count !== 1) throw new Error(`${item.path}: replacement verification failed for ${to}`);
  }
}

console.log('Portrait location metadata updated for EN/HU/DE.');
