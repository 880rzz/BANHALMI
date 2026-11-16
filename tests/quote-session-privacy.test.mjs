import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../assets/js/site-config.js', import.meta.url), 'utf8');
const draftSection = source.slice(source.indexOf('function draftKey(form)'), source.indexOf('function messageFor(lang, key)'));
assert.ok(draftSection.length > 1000, 'Quote draft functions must exist');
for (const method of ['getItem', 'setItem', 'removeItem']) {
  assert.match(draftSection, new RegExp('sessionStorage\\.' + method + '\\(draftKey\\(form\\)'), 'Draft ' + method + ' must be session-scoped');
}
assert.doesNotMatch(draftSection, /localStorage\.(?:getItem|setItem)\(/, 'Never read or write persistent quote drafts');
assert.match(draftSection, /function purgeLegacyDraft\(form\)[\s\S]*?localStorage\.removeItem\(draftKey\(form\)\)/, 'Purge old persistent drafts');
assert.match(source, /purgeLegacyDraft\(form\);\s*restoreDraft\(form\);/, 'Purge legacy drafts before restoring session draft');
assert.match(source, /body\.adminEmailSent === true && body\.customerEmailSent === true/, 'Require both delivery confirmations');
assert.match(source, /if\(verifiedDelivery\)\{\s*clearDraft\(form\);\s*form\.reset\(\);/, 'Clear only after verified delivery');
assert.match(source, /if\(!response\.ok \|\| !body \|\| body\.ok !== true\) throw/, 'Reject unsuccessful gateway responses');
assert.match(source, /data\.ok === true && data\.adminEmailSent === true && data\.customerEmailSent === true/, 'Guard must require gateway success and both delivery flags');
assert.match(source, /markDeliveryState\(response\.ok \? data : null\)/, 'HTTP failure must not mark delivery verified');
assert.match(source, /document\.querySelectorAll\('form\[data-smart-quote\]'\)\.forEach/, 'Guided quote drafts must be session-scoped');
assert.match(source, /form\.addEventListener\('reset',[\s\S]*?clearDraft\(form\)/, 'Clearing the guided quote requires verified delivery');
const quoteMain = readFileSync(new URL('../assets/js/main.js', import.meta.url), 'utf8');
const leadHook = quoteMain.slice(quoteMain.indexOf('function trackVerifiedQuoteLead()'), quoteMain.indexOf('setSubmitBusy(true);', quoteMain.indexOf('function trackVerifiedQuoteLead()')));
assert.ok(leadHook.length > 250, 'Verified quote analytics hook must exist');
assert.match(leadHook, /analytics\.hasConsent\(\)/, 'Lead event must require explicit analytics consent');
assert.match(leadHook, /gtag\('event', 'generate_lead'/, 'Only verified quote emits GA4 generate_lead');
assert.doesNotMatch(leadHook, /payload|submissionId|\.email|\.name|\.message/, 'Never include client identity or enquiry details in lead event');
assert.match(quoteMain, /if \(isQuote\) trackVerifiedQuoteLead\(\);\s*form\.reset\(\)/, 'Emit consent-safe conversion only in fully verified success path');

console.log('Quote session privacy and delivery-state source contract passed');
