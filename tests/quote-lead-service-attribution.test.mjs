import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const source = readFileSync('assets/js/main.js', 'utf8');
const start = source.indexOf('function trackVerifiedQuoteLead()');
const end = source.indexOf('\n      setSubmitBusy(true);', start);
assert.ok(start > 0 && end > start, 'exact verified-delivery lead tracker is present');
const tracker = source.slice(start, end);
assert.ok(tracker.includes("window.gtag('event', 'generate_lead'"));
assert.ok(source.indexOf('if (isQuote) trackVerifiedQuoteLead();', end) > end,
  'lead tracking is still gated by the verified-delivery promise branch');

function fire({ locale = 'en', category = 'individual', consent = true,
  isQuote = true, analyticsPresent = true, gtagPresent = true } = {}) {
  const events = [];
  const window = {
    BANHALMI_ANALYTICS: analyticsPresent ? { hasConsent: () => consent } : undefined,
    gtag: gtagPresent ? (...args) => events.push(JSON.parse(JSON.stringify(args))) : undefined
  };
  const form = { getAttribute: key => key === 'data-lang' ? locale : null };
  const document = { documentElement: { lang: 'en' } };
  const payload = {
    categoryCode: category,
    name: 'PRIVATE PERSON - DO NOT TRACK',
    email: 'private@example.test',
    message: 'PERSONAL CONTENT - DO NOT TRACK',
    pageUrl: 'https://www.banhalmiphotography.com/requestaquote/?private=value',
    estimateGross: 999
  };
  runInNewContext(tracker + '\ntrackVerifiedQuoteLead();',
    { window, form, document, payload, isQuote, trackedCategoryCode: category },
    { filename: 'lead-event-tracker.js' });
  return events;
}

const services = {
  individual: 'portrait',
  group: 'portrait',
  brand: 'brand',
  event: 'event',
  art: 'artists'
};
for (const locale of ['en', 'hu', 'de-at']) {
  const code = locale === 'de-at' ? 'de' : locale;
  for (const [category, service] of Object.entries(services)) {
    const result = fire({ locale, category });
    assert.deepEqual(result, [['event', 'generate_lead', {
      lead_type: 'quote_request',
      form_language: code,
      event_category: 'quote_request',
      event_label: code + '_' + service
    }]], locale + ' ' + category + ' must send one anonymous, allowlisted event');
    assert.ok(!JSON.stringify(result).match(/PRIVATE PERSON|private@example|PERSONAL CONTENT|private=value|999/),
      'No customer content, contact fields, URL or amounts in analytics');
    assert.deepEqual(fire({ locale, category, consent: false }), [],
      'No event without analytics consent');
  }
}
assert.deepEqual(fire({ isQuote: false }), [], 'Do not count non-quote forms');
assert.deepEqual(fire({ analyticsPresent: false }), [], 'Fail closed without consent API');
assert.deepEqual(fire({ gtagPresent: false }), [], 'Fail closed without GA4');
assert.deepEqual(fire({ category: '__proto__' }), [['event', 'generate_lead', {
  lead_type: 'quote_request',
  form_language: 'en',
  event_category: 'quote_request',
  event_label: 'en_unspecified'
}]], 'Unknown values cannot leak or inject property values');
assert.deepEqual(fire({ category: 'sensitive-free-form-text@example.test' }),
  fire({ category: '__proto__' }), 'Untrusted category becomes anonymous fallback');
console.log('GA4 quote lead service attribution PASS: 3 languages, 5 categories, consent and PII fail-closed checks.');
