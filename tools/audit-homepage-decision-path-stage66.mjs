import { readFile } from 'node:fs/promises';

const booking = 'https://meet.bookipi.com/zk5ly35r';
const cases = [
  {
    file: 'index.html',
    quote: '/requestaquote/',
    gallery: 'https://www.banhalmi.art/#works',
    label: 'Book a 15-minute video call',
    note: 'Booking interface in English.'
  },
  {
    file: 'hu/index.html',
    quote: '/hu/ajanlatkeres/',
    gallery: 'https://www.banhalmi.art/hu/#works',
    label: 'Foglalj 15 perces videóhívást',
    note: 'A foglalási felület angol nyelvű.'
  },
  {
    file: 'de-at/index.html',
    quote: '/de-at/anfrage/',
    gallery: 'https://www.banhalmi.art/de-at/#works',
    label: '15-minütiges Videogespräch buchen',
    note: 'Die Buchungsoberfläche ist auf Englisch.'
  }
];

const errors = [];
for (const entry of cases) {
  const html = await readFile(entry.file, 'utf8');
  if (!html.includes('data-home-decision-path="consultation"')) errors.push(`${entry.file}: homepage consultation path missing`);
  if (!html.includes(booking)) errors.push(`${entry.file}: canonical Bookipi booking URL missing`);
  if (!html.includes(entry.label)) errors.push(`${entry.file}: localized 15-minute call label missing`);
  if (!html.includes(entry.note)) errors.push(`${entry.file}: localized English-interface note missing`);
  if (!html.includes(`href="${entry.quote}"`)) errors.push(`${entry.file}: pricing/quote path missing`);
  if (!html.includes(entry.gallery)) errors.push(`${entry.file}: ART gallery bridge missing`);
  const bookingCount = html.split(booking).length - 1;
  if (bookingCount !== 1) errors.push(`${entry.file}: homepage must expose the direct booking URL exactly once, found ${bookingCount}`);
}

const ecosystem = JSON.parse(await readFile('ecosystem.json', 'utf8'));
if (ecosystem?.canonicalConsultation?.bookingUrl !== booking) errors.push('ecosystem.json: canonical consultation URL drifted');
if (ecosystem?.canonicalConsultation?.durationMinutes !== 15) errors.push('ecosystem.json: canonical consultation duration must remain 15 minutes');

if (errors.length) {
  console.error('Stage66 homepage decision-path audit failed:');
  for (const error of errors) console.error(' - ' + error);
  process.exit(1);
}
console.log('Stage66 passed: EN/HU/DE homepages expose pricing, ART gallery and the canonical 15-minute direct consultation without changing the ecosystem contract.');
