import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const canonical = 'https://www.trustindex.io/reviews/banhalmiphotography.com';
const sources = {
  en: { file: 'portrait/index.html', url: canonical },
  hu: { file: 'hu/portre/index.html', url: canonical + '/lang/hu' },
  // The owner's later explicit DE correction overrides the earlier duplicated third URL.
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
  'later owner correction requires distinct Hungarian and German review URLs');
assert.ok(review.guardrail.includes('Counts and ratings change'),
  'review score and count guardrail retained');
console.log('Trustindex profile source and review link canonicalization PASS: EN/HU/DE.');
