#!/usr/bin/env node
// Read-only three-language service evidence discovery audit.
// The Fine Art pages are allowed to use ART authority links instead of SSR registry blocks.
import fs from 'node:fs';
const pages = {
  portrait: ['portrait/index.html', 'hu/portre/index.html', 'de-at/portrait/index.html'],
  brand: ['lifestyle/index.html', 'hu/brand/index.html', 'de-at/brand/index.html'],
  event: ['event-photography/index.html', 'hu/rendezvenyfotozas/index.html', 'de-at/eventfotografie/index.html'],
  fineArt: ['fine-art/index.html', 'hu/muveszi-fotografia/index.html', 'de-at/fine-art/index.html']
};
const registry = JSON.parse(fs.readFileSync('service-trust-evidence.json', 'utf8'));
const failures = [];
for (const [service, files] of Object.entries(pages)) {
  if (!registry.services?.[service]) failures.push('Missing service registry key: ' + service);
  for (const file of files) {
    if (!fs.existsSync(file)) { failures.push('Missing page: ' + file); continue; }
    const html = fs.readFileSync(file, 'utf8');
    if (!/<link\b[^>]*rel=["']alternate["'][^>]*href=["']\/service-trust-evidence\.json["']/i.test(html)) {
      failures.push(file + ': missing service trust registry discovery link');
    }
    if (!/<main\b/i.test(html)) failures.push(file + ': missing main landmark');
    if (service !== 'fineArt' && !/data-service-evidence=["'](?:professional-registry|event-registry)["']/.test(html)) {
      failures.push(file + ': missing service evidence SSR marker');
    }
  }
}
if (failures.length) {
  console.error('Service evidence coverage FAILED:\n' + failures.join('\n'));
  process.exitCode = 1;
} else console.log('Service evidence coverage passed: 12 pages, 4 services, 3 languages.');
