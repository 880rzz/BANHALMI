#!/usr/bin/env node
import fs from 'node:fs';

const failures = [];
const portraitBrand = [
  ['portrait/index.html', '7503011271332773888', '7388473288043225088'],
  ['hu/portre/index.html', '7503011271332773888', '7388473288043225088'],
  ['de-at/portrait/index.html', '7503011271332773888', '7388473288043225088'],
  ['lifestyle/index.html', '7503011271332773888', '7388473288043225088'],
  ['hu/brand/index.html', '7503011271332773888', '7388473288043225088'],
  ['de-at/brand/index.html', '7503011271332773888', '7388473288043225088'],
];
for (const [file, ...needles] of portraitBrand) {
  const html = fs.readFileSync(file, 'utf8');
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1] || '';
  if (!main.includes('data-service-evidence="professional-registry"')) {
    failures.push(`${file}: missing SSR professional-registry evidence section`);
  }
  for (const n of needles) {
    if (!main.includes(n)) failures.push(`${file}: main missing LinkedIn activity ${n}`);
  }
}
for (const [file, ...needles] of [
  ['event-photography/index.html', '7388473288043225088', '7440773944644853760'],
  ['hu/rendezvenyfotozas/index.html', '7388473288043225088', '7440773944644853760'],
  ['de-at/eventfotografie/index.html', '7388473288043225088', '7440773944644853760'],
]) {
  const main = (fs.readFileSync(file, 'utf8').match(/<main\b[^>]*>([\s\S]*?)<\/main>/i) || [])[1] || '';
  if (!main.includes('data-service-evidence="event-registry"')) failures.push(`${file}: missing event-registry SSR section`);
  for (const n of needles) if (!main.includes(n)) failures.push(`${file}: main missing ${n}`);
}

const ste = JSON.parse(fs.readFileSync('service-trust-evidence.json', 'utf8'));
const eventReg = ste.services?.event?.professionalRegistryEvidence || [];
for (const id of ['linkedin-michael-broenner-7388473288043225088', 'linkedin-amcham-austria-7440773944644853760']) {
  if (!eventReg.includes(id)) failures.push(`service-trust-evidence: event.professionalRegistryEvidence missing ${id}`);
}

if (failures.length) {
  console.error('audit-service-registry-evidence-ssr FAILED');
  for (const f of failures) console.error(' -', f);
  process.exit(1);
}
console.log('audit-service-registry-evidence-ssr passed');
