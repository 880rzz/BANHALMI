import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

// Search/AI structured data must describe user-visible service content.
// The standalone three-language FAQ already publishes full human-visible
// Q&A; measured service landing pages must not manufacture hidden FAQs.
const base = 'https://www.banhalmiphotography.com';
const cases = [
  ['portrait/index.html','/portrait/'],
  ['hu/portre/index.html','/hu/portre/'],
  ['de-at/portrait/index.html','/de-at/portrait/'],
  ['lifestyle/index.html','/lifestyle/'],
  ['hu/brand/index.html','/hu/brand/'],
  ['de-at/brand/index.html','/de-at/brand/']
];

for (const [file, route] of cases) {
  const html = readFileSync(file, 'utf8');
  const scripts = [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)]
    .map((m) => JSON.parse(m[1]));
  const nodes = scripts.flatMap((s) => s['@graph'] || [s]);
  assert.equal(nodes.filter((n) => n['@type'] === 'FAQPage').length, 0,
    file + ': unsupported FAQPage with no visible Q&A reintroduced');
  assert.equal(nodes.filter((n) => n['@type'] === 'Service').length, 1,
    file + ': preserve exactly one localized Service node');
  assert.ok(html.includes('href="' + base + route + '" rel="canonical"'),
    file + ': preserve localized self canonical');
  assert.ok(html.includes('<h1'), file + ': preserve human-readable service heading');
  assert.ok(html.includes('Q56391118'), file + ': preserve canonical Person authority');
}

for (const [file, route] of [
  ['faq/index.html','/faq/'],
  ['hu/gyik/index.html','/hu/gyik/'],
  ['de-at/faq/index.html','/de-at/faq/']
]) {
  const html = readFileSync(file, 'utf8');
  assert.ok(html.includes('href="' + base + route + '" rel="canonical"'),
    file + ': standalone FAQ self canonical missing');
  const nodes = [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)]
    .map((m) => JSON.parse(m[1])).flatMap((s) => s['@graph'] || [s]);
  const faqNodes = nodes.filter((n) => n['@type'] === 'FAQPage');
  assert.equal(faqNodes.length, 1, file + ': standalone visible FAQ source missing');
  assert.equal(faqNodes[0].mainEntity.length, 37, file + ': full visible answer set must be retained');
}
console.log('AEO structured-data visibility contract PASS: 6 service pages use Service, 3 FAQ pages publish visible answers.');
