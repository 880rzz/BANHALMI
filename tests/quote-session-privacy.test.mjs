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
console.log('Quote session privacy and delivery-state source contract passed');
