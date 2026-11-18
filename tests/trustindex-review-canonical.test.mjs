import assert from 'node:assert/strict';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const canonical = 'https://www.trustindex.io/reviews/banhalmiphotography.com';
const sources = {
  en: { file: 'portrait/index.html', url: canonical },
  hu: { file: 'hu/portre/index.html', url: canonical + '/lang/hu' },
  de: { file: 'de-at/portrait/index.html', url: canonical + '/lang/de' }
};
for (const [locale, source] of Object.entries(sources)) {
  const html = readFileSync(source.file, 'utf8');
  const section = html.match(/<section class="trustindex-evidence"[^>]*>[\s\S]*?<\/section>/)?.[0];
  assert.ok(section, locale + ': reviews evidence section exists');
  const hrefs = [...section.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>/g)].map(x => x[1]);
  assert.deepEqual(hrefs, [source.url], locale + ': exact external review link');
  assert.match(section, /rel="noopener noreferrer"[^>]*target="_blank"/,
    locale + ': safe external link');
  assert.doesNotMatch(section, /ratingValue|ratingCount|reviewCount|aggregateRating/i,
    locale + ': no invented rating counts in review section');
}
const raw = readFileSync('service-trust-evidence.json', 'utf8');
const evidence = JSON.parse(raw);
const review = evidence.customerReviewEvidence;
assert.equal(review.source, canonical);
for (const locale of Object.keys(sources)) {
  assert.equal(review.localizedSources[locale], sources[locale].url, locale + ': evidence URL parity');
}
const thirdPartyReview = evidence.evidence?.find?.(x => x.id === 'trustindex-google-reviews-2026')
  ?? evidence.sources?.find?.(x => x.id === 'trustindex-google-reviews-2026')
  ?? null;
assert.ok(raw.includes('"id": "trustindex-google-reviews-2026"'), 'review identity retained');
assert.ok(!raw.includes('https://www.trustindex.io/reviews/banhalmi.art'),
  'retired art-domain review profile removed from professional trust evidence');
assert.ok(raw.includes('"url": "' + canonical + '"'),
  'review source references the canonical profile');
assert.ok(raw.includes(canonical + '/lang/hu') && raw.includes(canonical + '/lang/de'),
  'both owner-confirmed Hungarian and German locale URLs are present');
assert.ok(review.guardrail.includes('Counts and ratings change'),
  'review score and count guardrail retained');

// Exhaustive audit of published/source review links, not just the three UI cards.
// Historical negative examples in tests and build tools are not customer-facing links.
const approved = new Set([canonical, canonical + '/lang/hu', canonical + '/lang/de']);
const tracked = execFileSync('git', ['ls-files', '-z'], { encoding: 'utf8' })
  .split('\0').filter(Boolean);
let inspectedLinks = 0;
for (const file of tracked) {
  if (/^(?:tests|tools|\.github|docs)\//.test(file)) continue;
  if (!/\.(?:html?|json|jsonld|mjs|js|ts|tsx|md|txt|xml|yaml|yml)$/i.test(file)) continue;
  if (!existsSync(file) || statSync(file).size > 8_000_000) continue;
  const data = readFileSync(file, 'utf8');
  for (const match of data.matchAll(/https?:\/\/(?:www\.)?trustindex\.io\/reviews\/[a-z0-9.-]+(?:\/lang\/[a-z-]+)?/gi)) {
    const url = match[0];
    assert.ok(approved.has(url), file + ': stale or unsupported Trustindex URL: ' + url);
    if (file.endsWith('.html')) {
      const expected = file.startsWith('hu/') ? canonical + '/lang/hu'
        : file.startsWith('de-at/') ? canonical + '/lang/de' : canonical;
      assert.equal(url, expected, file + ': review link must match page language');
    }
    inspectedLinks++;
  }
}
assert.ok(inspectedLinks >= 8, 'published and machine-readable Trustindex references were inspected');

console.log('Trustindex profile source and review link canonicalization PASS: EN/HU/DE.');
