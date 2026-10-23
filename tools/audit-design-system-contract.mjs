import fs from 'node:fs';

const css = fs.readFileSync('assets/css/site.css', 'utf8');
const doc = fs.readFileSync('BANHALMI-DESIGN-SYSTEM.md', 'utf8');
const fail = (ok, message) => { if (!ok) { console.error(`DESIGN SYSTEM FAIL: ${message}`); process.exitCode = 1; } };

for (const token of ['--space-1:8px', '--space-2:12px', '--space-3:16px', '--space-4:24px', '--space-5:40px', '--space-6:64px', '--space-7:96px', '--control-min:44px']) {
  fail(css.includes(token), `canonical token missing: ${token}`);
}
fail(css.includes('padding:0 var(--content-gutter)'), 'canonical desktop gutter is not used by .wrap');
fail(css.includes('padding-left:var(--content-gutter-mobile)'), 'canonical mobile gutter is not used by section direct children');
fail(css.includes('min-width:var(--control-min)') && css.includes('min-height:var(--control-min)'), 'menu control touch target contract missing');
for (const heading of ['## Decision path', '## Block rules', '## Tokens and responsive rules', '## Content and trust guardrails']) {
  fail(doc.includes(heading), `design system authority missing: ${heading}`);
}
if (!process.exitCode) console.log('BANHALMI unified design system contract OK');
