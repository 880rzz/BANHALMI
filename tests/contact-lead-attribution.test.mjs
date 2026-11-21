import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

// Source-level and isolated execution checks. Never contact the live gateway.
const source = readFileSync(new URL('../assets/js/main.js', import.meta.url), 'utf8');
const start = source.indexOf('function trackVerifiedContactLead(data)');
const end = source.indexOf('setSubmitBusy(true);', start);
assert.ok(start > 0 && end > start, 'Verified contact analytics helper is present');
const tracker = source.slice(start, end);
assert.match(tracker, /data\.ok !== true \|\| data\.adminEmailSent !== true/);
assert.match(tracker, /analytics\.hasConsent\(\)/);
assert.ok(source.indexOf('else trackVerifiedContactLead(data);', end) > end,
  'Contact analytics only follows the resolved gateway promise');

function fire({ lang = 'en', response = { ok: true, adminEmailSent: true },
  consent = true, isQuote = false, analyticsPresent = true, gtagPresent = true } = {}) {
  const calls = [];
  const window = {
    BANHALMI_ANALYTICS: analyticsPresent ? { hasConsent: () => consent } : undefined,
    gtag: gtagPresent ? (...args) => calls.push(args) : undefined
  };
  const form = { getAttribute: () => lang };
  const document = { documentElement: { lang: 'en' } };
  runInNewContext(tracker + '\ntrackVerifiedContactLead(data);',
    { window, form, document, isQuote, data: response });
  return JSON.parse(JSON.stringify(calls));
}
for (const [lang, normalized] of [['en','en'],['hu-HU','hu'],['de-AT','de']]) {
  assert.deepEqual(fire({lang}), [['event', 'generate_lead', {
    lead_type: 'contact_enquiry',
    form_language: normalized,
    event_category: 'contact_enquiry',
    event_label: normalized + '_contact'
  }]]);
}
assert.deepEqual(fire({consent:false}), [], 'No lead tracking without explicit analytics consent');
assert.deepEqual(fire({isQuote:true}), [], 'Quote logic remains separate');
assert.deepEqual(fire({analyticsPresent:false}), [], 'Fail closed without consent API');
assert.deepEqual(fire({gtagPresent:false}), [], 'Fail closed without GA4');
assert.deepEqual(fire({response:{ok:false,adminEmailSent:true}}), [], 'Reject unsuccessful gateway status');
assert.deepEqual(fire({response:{ok:true,adminEmailSent:false}}), [], 'Reject unverified admin delivery');
assert.deepEqual(fire({response:{ok:true,adminEmailSent:true,unverified:true}}), [], 'Reject flagged unverified delivery');
assert.deepEqual(fire({response:{ok:true}}), [], 'Do not infer delivery from HTTP success alone');
const sensitive = { ok:true, adminEmailSent:true, email:'private@example.com',
  message:'Confidential client material', submissionId:'PRIVATE', pageUrl:'/?utm_source=chatgpt.com' };
assert.doesNotMatch(JSON.stringify(fire({response:sensitive})),
  /private@example\.com|Confidential client material|PRIVATE|utm_source/,
  'Contact analytics does not leak payload, identifiers or referral URLs');
const failClosed = 'if (!isQuote && (!data || data.ok !== true || data.adminEmailSent !== true || data.unverified === true))';
assert.ok(source.includes(failClosed), 'Never report contact success on unconfirmed gateway delivery');
assert.ok(source.indexOf(failClosed) < source.indexOf('else trackVerifiedContactLead(data);'),
  'Delivery verification must precede contact analytics and form reset');
console.log('GA4 verified contact lead attribution PASS: 3 languages, consent, delivery, false-success and PII guards.');
