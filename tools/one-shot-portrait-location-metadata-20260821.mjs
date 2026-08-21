import fs from 'node:fs';

const changes = [
  {
    path: 'portrait/index.html',
    from: 'Executive Portrait &amp; Headshot Photography for Leaders | BANHALMI',
    to: 'Executive Portrait &amp; Headshot Photographer | Vienna–Budapest | BANHALMI',
    plainFrom: 'Executive Portrait & Headshot Photography for Leaders | BANHALMI',
    plainTo: 'Executive Portrait & Headshot Photographer | Vienna–Budapest | BANHALMI'
  },
  {
    path: 'hu/portre/index.html',
    from: 'Executive portré és Headshot fotózás B2B vezetőkről | BANHALMI',
    to: 'Executive portré és Headshot fotózás | Bécs–Budapest | BANHALMI',
    plainFrom: 'Executive portré és Headshot fotózás B2B vezetőkről | BANHALMI',
    plainTo: 'Executive portré és Headshot fotózás | Bécs–Budapest | BANHALMI'
  },
  {
    path: 'de-at/portrait/index.html',
    from: 'Executive-Porträt &amp; Headshot für Führungskräfte | BANHALMI',
    to: 'Executive-Porträt &amp; Headshot-Fotografie | Wien–Budapest | BANHALMI',
    plainFrom: 'Executive-Porträt & Headshot für Führungskräfte | BANHALMI',
    plainTo: 'Executive-Porträt & Headshot-Fotografie | Wien–Budapest | BANHALMI'
  }
];

for (const item of changes) {
  let html = fs.readFileSync(item.path, 'utf8');
  const encodedCount = html.split(item.from).length - 1;
  const plainCount = html.split(item.plainFrom).length - 1;
  const total = encodedCount + plainCount;
  if (total !== 3) {
    throw new Error(`${item.path}: expected exactly 3 title occurrences (title, og:title, twitter:title), found ${total}`);
  }
  html = html.split(item.from).join(item.to).split(item.plainFrom).join(item.plainTo);
  fs.writeFileSync(item.path, html);

  const updated = fs.readFileSync(item.path, 'utf8');
  const expectedEncoded = updated.split(item.to).length - 1;
  const expectedPlain = updated.split(item.plainTo).length - 1;
  if (expectedEncoded + expectedPlain !== 3) {
    throw new Error(`${item.path}: replacement verification failed`);
  }
}

console.log('Portrait location metadata updated for EN/HU/DE.');
