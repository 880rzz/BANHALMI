import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

// This is a dated, read-only evidence fixture. It must not be treated as a
// live Search Console connection or a promise of future traffic growth.
const baseline = JSON.parse(fs.readFileSync('tools/search-growth-baseline-2026-11-21.json', 'utf8'));
const base = 'https://www.banhalmiphotography.com';
const { gsc, ga4 } = baseline;
assert.equal(baseline.property, 'sc-domain:banhalmiphotography.com');
assert.equal(baseline.canonicalHost, 'www.banhalmiphotography.com');
assert.equal(baseline.snapshotDate, '2026-11-21');
assert.equal(gsc.last7Days.start, '2026-11-12');
assert.equal(gsc.last7Days.end, '2026-11-18');
assert.equal(gsc.indexingTracker.indexed + gsc.indexingTracker.notIndexed, gsc.indexingTracker.tracked);

const genericImpressions = gsc.genericQueryEvidence.reduce((sum, q) => sum + q.impressions, 0);
const genericClicks = gsc.genericQueryEvidence.reduce((sum, q) => sum + q.clicks, 0);
const nonGenericImpressions = gsc.last7Days.impressions - genericImpressions;
const nonGenericClicks = gsc.last7Days.clicks - genericClicks;
assert.ok(genericImpressions > 0 && nonGenericImpressions > 0, 'Query groups must partition positive impressions');
assert.equal(genericClicks, 0, 'Frozen baseline generic-query clicks must not be fabricated');
const share = 100 * genericImpressions / gsc.last7Days.impressions;
const nonGenericCtr = 100 * nonGenericClicks / nonGenericImpressions;
assert.ok(share > 80 && share < 100, 'Expected generic search exposure dominates this dated baseline');
assert.ok(nonGenericCtr > gsc.last7Days.ctrPercent,
  'Generic queries are skewing aggregate CTR; do not optimize blindly for portfolio/photography');

for (const row of gsc.commercialIntentEvidence) {
  assert.ok(row.query && Number.isFinite(row.impressions) && Number.isFinite(row.averagePosition));
  assert.ok(row.observedLanding.startsWith(base + '/'), 'Observed GSC landing must be canonical-domain URL');
  assert.ok(row.expectedServiceOwner.startsWith(base + '/'), 'Owner must be on canonical Pages domain');
  const route = new URL(row.expectedServiceOwner).pathname;
  const file = path.join('.', route, 'index.html');
  assert.ok(fs.existsSync(file), row.query + ': owner page missing: ' + file);
  const html = fs.readFileSync(file, 'utf8');
  assert.ok(html.includes('href="' + row.expectedServiceOwner + '" rel="canonical"'),
    row.query + ': owner page has wrong self-canonical');
  assert.ok(html.includes('Q56391118'), row.query + ': required Person identity source absent');
}

assert.ok(gsc.indexingTracker.knownLegacyGoogleCanonical.googleCanonical.includes('norbertbanhalmi.com'),
  'Preserve legacy canonical evidence until Google recrawls and changes it');
assert.equal(ga4.propertyId, 'properties/383874731');
assert.ok(ga4.chatgptReferralSessions > 0 && ga4.chatgptEngagedSessions <= ga4.chatgptReferralSessions);
assert.ok(ga4.chatgptVerifiedLeads <= ga4.chatgptReferralSessions);
assert.equal(ga4.chatgptVerifiedLeads, 0, 'Historical ChatGPT leads were not verified');
assert.ok(ga4.caveat.includes('not that a model recommended'), 'Never equate referrals with confirmed AI recommendations');
assert.ok(ga4.selfReferralSessions >= 0, 'Self-referrals need an attribution audit, not an unverified code hotfix');

const mainJs = fs.readFileSync('assets/js/main.js', 'utf8');
assert.ok(mainJs.includes("window.gtag('event', 'generate_lead'"),
  'Real lead must remain measurable after verified quote delivery');
assert.ok(mainJs.includes('if (isQuote) trackVerifiedQuoteLead();'),
  'Do not count mere form starts as verified leads');
assert.ok(mainJs.includes("typeof analytics.hasConsent !== 'function'"),
  'Analytics must stay consent-gated');

console.log('Search growth evidence audit PASS: ' + share.toFixed(2) +
  '% generic impressions, non-generic CTR ' + nonGenericCtr.toFixed(2) +
  '%; four intent-owner checks; lead and consent gate preserved; no SEO pages modified.');
